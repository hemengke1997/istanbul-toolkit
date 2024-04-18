import { toNumber } from '@minko-fe/lodash-pro'
import { useDebounceFn, useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/components/utils'
import { $ } from '@/utils/query'
import { ISTANBUL_WIDGET_ID } from '@/utils/tool'
import Draggable from './components/Draggable'
import { type Config, type IstanbulWidgetOptions, type Position } from './options.interface'

export type IstanbulWidgetProps = {
  theme: IstanbulWidgetOptions['theme']
  float: IstanbulWidgetOptions['float']
  onAction: IstanbulWidgetOptions['report']['onAction']
  beforeAction?: IstanbulWidgetOptions['report']['beforeAction']
  afterAction?: IstanbulWidgetOptions['report']['afterAction']
  position: Position
  defaultPosition: Position
  show: boolean
  min_internal: number
  onConfigChanged: (c: Config) => void
  onReset: () => void
  config: Config
  originConfig: Config
  requireReporter: boolean
}

export default function IstanbulWidget(props: IstanbulWidgetProps) {
  const {
    position,
    defaultPosition,
    show,
    min_internal,
    onConfigChanged,
    config,
    onReset,
    originConfig,
    onAction,
    beforeAction,
    afterAction,
    theme,
    requireReporter,
    float,
  } = props

  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)

  // 静态表单值
  const staticConfig = useRef<Config>(config)

  // 动态表单值
  const [dynamicConfig, setDynamicConfig] = useSetState<Config>(config)

  const onSubmit = (data: Config) => {
    const { enable_auto_report, report_interval, reporter } = data
    if (requireReporter && !reporter) {
      return toast({
        description: '请填写上报人',
        variant: 'destructive',
      })
    }
    if (enable_auto_report && report_interval < min_internal) {
      return toast({
        description: `自动上报间隔不能小于${min_internal}秒`,
        variant: 'destructive',
      })
    }

    onConfigChanged(data)
    staticConfig.current = data
    setDialogOpen(false)
    toast({
      description: '设置保存成功',
    })
  }

  const { run: debouncedReport, flush: report } = useDebounceFn(
    async (showToast = true) => {
      // before report
      await beforeAction?.()
      try {
        if (requireReporter && !staticConfig.current.reporter) {
          console.warn('[istanbul-widget]: 请填写上报人')
        }
        await onAction(window.__coverage__)
        showToast &&
          toast({
            description: '上报成功',
          })
      } catch (e) {
        toast({
          description: '上报失败，请打开控制台查看原因',
          variant: 'destructive',
        })
        console.error('[istanbul-widget]: report error', e)
      } finally {
        // after report
        await afterAction?.()
      }
    },
    {
      wait: 300,
      leading: true,
      trailing: false,
    },
  )

  const flush = () => {
    debouncedReport(false)
    report()
  }

  useEffect(() => {
    const { report_on_pageleave } = staticConfig.current

    if (report_on_pageleave) {
      window.addEventListener('beforeunload', () => {
        flush()
      })
      window.addEventListener('popstate', () => {
        flush()
      })
    }
    return () => {
      window.removeEventListener('beforeunload', () => {
        flush()
      })
      window.removeEventListener('popstate', () => {
        flush()
      })
    }
  }, [staticConfig.current.report_on_pageleave])

  useEffect(() => {
    if (staticConfig.current.enable_auto_report && staticConfig.current.report_interval) {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
      window.__istanbulWidgetAutoReportInterval = window.setInterval(() => {
        flush()
      }, staticConfig.current.report_interval * 1000)
    } else if (!staticConfig.current.enable_auto_report) {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
    }
  }, [staticConfig.current])

  useEffect(() => {
    return () => {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
    }
  }, [])

  useUpdateEffect(() => {
    if (!dialogOpen) {
      const timer = setTimeout(() => {
        setDynamicConfig(staticConfig.current)
        clearTimeout(timer)
        // animation end
      }, 150)
    }
  }, [dialogOpen])

  useLayoutEffect(() => {
    const darkClass = 'istanbul-widget-dark'
    const lightClass = 'istanbul-widget-light'

    const dom = document.querySelector(`#${ISTANBUL_WIDGET_ID}`) as HTMLDivElement

    if (theme === 'dark') {
      $.removeClass(dom, lightClass)
      $.addClass(dom, darkClass)
    } else {
      $.removeClass(dom, darkClass)
      $.addClass(dom, lightClass)
    }
  }, [])

  const dragging = useRef<boolean>(false)

  return (
    <>
      <div
        className={cn(
          show ? 'iw-block' : 'iw-hidden',
          'iw-fixed iw-z-[49] iw-right-0 iw-top-0 iw-left-0 iw-bottom-0 iw-pointer-events-none',
        )}
      >
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <Popover>
            <div>
              <Draggable
                position={position}
                defaultPosition={defaultPosition}
                dragOptions={{
                  onDrag() {
                    dragging.current = true
                  },
                  onDragEnd() {
                    const t = setTimeout(() => {
                      dragging.current = false
                      clearTimeout(t)
                    }, 60)
                  },
                }}
                float={float}
              >
                <PopoverTrigger
                  asChild
                  onClick={(e) => {
                    if (dragging.current) {
                      e.preventDefault()
                      return
                    }
                  }}
                >
                  <div
                    className='iw-rounded-full iw-w-9 iw-h-9 iw-flex iw-justify-center iw-items-center iw-p-2'
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className='iw-icon-[vscode-icons--file-type-testjs] iw-w-full iw-h-full iw-cursor-pointer'></div>
                  </div>
                </PopoverTrigger>
              </Draggable>
            </div>
            <PopoverContent sideOffset={2}>
              <div className='iw-flex iw-items-center iw-space-x-2 iw-rounded-md iw-p-2 iw-text-xs iw-shadow'>
                <PopoverClose asChild>
                  <Button size='sm' onClick={debouncedReport} data-state='closed'>
                    上报
                  </Button>
                </PopoverClose>

                <PopoverClose asChild>
                  <DialogTrigger asChild>
                    <Button size={'sm'} variant={'secondary'}>
                      设置
                    </Button>
                  </DialogTrigger>
                </PopoverClose>
              </div>
              <PopoverArrow />
            </PopoverContent>
          </Popover>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>上报设置</DialogTitle>
            </DialogHeader>

            <div className='iw-flex iw-flex-col iw-space-y-3 iw-py-4'>
              <div className='iw-flex iw-items-center iw-space-x-4'>
                <Label className={'iw-whitespace-nowrap iw-flex-none'}>
                  上报人 {requireReporter && <span className={'iw-text-red-600'}>*</span>}
                </Label>
                <Input
                  autoFocus={false}
                  type='text'
                  className={'iw-flex-1'}
                  placeholder='请输入上报人'
                  value={dynamicConfig.reporter}
                  onChange={(e) => setDynamicConfig({ reporter: e.target.value })}
                ></Input>
              </div>
              <div className='iw-flex iw-items-center iw-space-x-4'>
                <Label>自动上报</Label>
                <Switch
                  checked={dynamicConfig.enable_auto_report}
                  onCheckedChange={(checked) => setDynamicConfig({ enable_auto_report: checked })}
                />
              </div>
              {dynamicConfig.enable_auto_report && (
                <div className='iw-flex iw-items-center iw-space-x-4'>
                  <Label className='iw-whitespace-nowrap'>自动上报间隔</Label>
                  <Input
                    type='number'
                    placeholder='秒'
                    autoComplete='off'
                    value={dynamicConfig.report_interval}
                    onChange={(e) => setDynamicConfig({ report_interval: toNumber(e.target.value) })}
                  />
                </div>
              )}
              <div className='iw-flex iw-items-center iw-space-x-4'>
                <Label>离开页面时上报</Label>
                <Switch
                  checked={dynamicConfig.report_on_pageleave}
                  onCheckedChange={(checked) => setDynamicConfig({ report_on_pageleave: checked })}
                />
              </div>
            </div>

            <DialogFooter className={'iw-flex'}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>重置设置</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重置？</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className={'iw-my-3'}>恢复默认设置</div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onReset()
                        staticConfig.current = originConfig
                        setDialogOpen(false)
                        toast({
                          description: '设置已重置',
                          variant: 'default',
                        })
                      }}
                    >
                      确认
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type='submit'
                onClick={() => {
                  onSubmit(dynamicConfig)
                }}
                className={'iw-mb-2'}
              >
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  )
}
