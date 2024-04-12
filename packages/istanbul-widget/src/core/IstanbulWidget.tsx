import { toNumber } from '@minko-fe/lodash-pro'
import { useDebounceFn, useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
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
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/components/utils'
import { $ } from '@/utils/query'
import { ISTANBUL_WIDGET_ID } from '@/utils/tool'
import Draggable from './components/Draggable'
import { type Config, type IstanbulWidgetOptions } from './options.interface'

export type CompInstance = {
  destroy: () => void
  update: (newProps: CoreProps) => void
}

export function render({ target, ...coreProps }: { target: HTMLElement } & CoreProps): CompInstance {
  const container = document.createElement('div')
  container.id = ISTANBUL_WIDGET_ID
  target.appendChild(container)
  const reactRoot = ReactDOM.createRoot(container)
  reactRoot.render(<Core {...coreProps} />)

  return {
    destroy() {
      reactRoot.unmount()
    },
    update(newProps: CoreProps) {
      reactRoot.render(<Core {...coreProps} {...newProps} />)
    },
  }
}

type CoreProps = {
  theme: IstanbulWidgetOptions['theme']
  onAction: IstanbulWidgetOptions['report']['onAction']
  beforeAction?: IstanbulWidgetOptions['report']['beforeAction']
  afterAction?: IstanbulWidgetOptions['report']['afterAction']
  position: {
    x: number
    y: number
  }
  show: boolean
  min_internal: number
  onConfigChanged: (c: Config) => void
  onReset: () => void
  config: Config
  originConfig: Config
  requireReporter: boolean
}

function Core(props: CoreProps) {
  const {
    position,
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

  return (
    <>
      <div
        className={cn(
          show ? 'iw-block' : 'iw-hidden',
          'iw-fixed iw-z-[49] iw-right-0 iw-top-0 iw-left-0 iw-bottom-0 iw-pointer-events-none',
        )}
      >
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <Draggable position={position}>
            <div className='iw-flex iw-gap-x-2'>
              <Button size='sm' onClick={debouncedReport}>
                上报
              </Button>
              <DialogTrigger asChild>
                <Button size={'sm'} variant={'secondary'}>
                  设置
                </Button>
              </DialogTrigger>
            </div>
          </Draggable>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>上报设置</DialogTitle>
            </DialogHeader>

            <div className='iw-flex iw-flex-col iw-gap-3 iw-py-2'>
              <div className='iw-flex iw-items-center iw-gap-4'>
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
              <div className='iw-flex iw-items-center iw-gap-4'>
                <Label>自动上报</Label>
                <Switch
                  checked={dynamicConfig.enable_auto_report}
                  onCheckedChange={(checked) => setDynamicConfig({ enable_auto_report: checked })}
                />
              </div>
              {dynamicConfig.enable_auto_report && (
                <div className='iw-flex iw-items-center iw-gap-4'>
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
              <div className='iw-flex iw-items-center iw-gap-4'>
                <Label>离开页面时上报</Label>
                <Switch
                  checked={dynamicConfig.report_on_pageleave}
                  onCheckedChange={(checked) => setDynamicConfig({ report_on_pageleave: checked })}
                />
              </div>
            </div>

            <DialogFooter className={'iw-gap-y-2'}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>重置设置</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重置？</AlertDialogTitle>
                    <AlertDialogDescription>恢复默认设置</AlertDialogDescription>
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
