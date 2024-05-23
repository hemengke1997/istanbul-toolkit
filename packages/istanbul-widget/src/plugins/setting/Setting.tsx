import { isObject, remove, toNumber } from '@minko-fe/lodash-pro'
import { useLocalStorageState, useMemoizedFn, useSetState, useUpdateEffect } from '@minko-fe/react-hook'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
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
import { useToast } from '@/components/ui/use-toast'
import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import Context from '../../core/Context'

type Config = {
  reporter: string
  enable_auto_report: boolean
  report_interval: number
  report_min_interval: number
  report_on_pageleave: boolean
}

const default_interval = 60
const default_min_interval = 60

function Settings() {
  const { plugin, reportFn, setReportActions, setReportFnParams } = Context.usePicker([
    'plugin',
    'reportFn',
    'setReportActions',
    'setReportFnParams',
  ])
  const { setting } = plugin || {}

  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const config = useMemo(() => {
    return {
      enable_auto_report: !!setting?.autoReport,
      report_interval: isObject(setting?.autoReport) ? setting.autoReport.interval : default_interval,
      report_min_interval: isObject(setting?.autoReport) ? setting.autoReport.minInterval : default_min_interval,
      report_on_pageleave: setting?.onLeavePage,
      reporter: '',
    } as Config
  }, [setting])

  const validateReporterId = 'validate-reporter'
  const validateReporter = useMemoizedFn(() => {
    if (setting?.requireReporter && !staticConfig?.reporter) {
      throw new Error('请填写上报人')
    }
  })

  useEffect(() => {
    setReportActions((t) => {
      remove(t.before, (action) => action.id === validateReporterId)

      return {
        before: [
          ...t.before,
          {
            id: validateReporterId,
            fn: validateReporter,
          },
        ],
      }
    })
  }, [validateReporter])

  const requireReporter = useMemo(() => !!setting?.requireReporter, [setting])

  // 静态表单值
  const [staticConfig, setStaticConfig] = useLocalStorageState<Config>(`${ISTANBUL_WIDGET_ID}_config`, {
    defaultValue: config,
  })

  // 动态表单值
  const [dynamicConfig, setDynamicConfig] = useSetState<Config>(staticConfig!)

  const onSubmit = useMemoizedFn((data: Config) => {
    const { enable_auto_report, report_interval, reporter } = data

    if (requireReporter && !reporter) {
      return toast({
        description: '请填写上报人',
        variant: 'destructive',
      })
    }

    if (enable_auto_report && report_interval < config.report_min_interval) {
      return toast({
        description: `自动上报间隔不能小于${config.report_min_interval}秒`,
        variant: 'destructive',
      })
    }

    setStaticConfig(data)
    setDialogOpen(false)
    toast({
      description: '设置保存成功',
    })
  })

  const flush = useMemoizedFn(() => {
    reportFn?.run(false)
    reportFn?.flush()
  })

  useEffect(() => {
    const { report_on_pageleave } = staticConfig || {}

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
  }, [staticConfig?.report_on_pageleave])

  useEffect(() => {
    setReportFnParams({
      setting: staticConfig,
    })

    if (staticConfig?.enable_auto_report && staticConfig.report_interval) {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
      window.__istanbulWidgetAutoReportInterval = window.setInterval(() => {
        flush()
      }, staticConfig.report_interval * 1000)
    } else if (!staticConfig?.enable_auto_report) {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
    }
  }, [staticConfig])

  const dialogOpenTimer = useRef<number>()
  useUpdateEffect(() => {
    if (!dialogOpen) {
      dialogOpenTimer.current = window.setTimeout(() => {
        setDynamicConfig(staticConfig!)
        clearTimeout(dialogOpenTimer.current)
        // animation end
      }, 150)
    } else {
      dialogOpenTimer.current && clearTimeout(dialogOpenTimer.current)
    }
    return () => {
      dialogOpenTimer.current && clearTimeout(dialogOpenTimer.current)
    }
  }, [dialogOpen])

  const onReset = useMemoizedFn(() => {
    setStaticConfig(config)
  })

  useEffect(() => {
    return () => {
      clearInterval(window.__istanbulWidgetAutoReportInterval)
    }
  }, [])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} variant={'secondary'}>
          {setting?.text || '设置'}
        </Button>
      </DialogTrigger>
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
                  <span className={'iw-my-3 iw-block'}>恢复默认设置</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onReset()
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
  )
}

export default memo(Settings)
