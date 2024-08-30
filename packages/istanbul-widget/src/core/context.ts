import { useDebounceFn, useLatest, useSetState } from 'ahooks'
import { createContainer } from 'context-state'
import { useToast } from '@/components/ui'
import { IstanbulWidget } from './core'
import { type IstanbulWidgetOptions, type PluginName, type PluginType, type ReportParams } from './options.interface'

export type InitialWidgetProps = IstanbulWidgetOptions & {
  /**
   * 插件
   */
  pluginList: { [id: string]: PluginType }
}

function useContext(initialValues: InitialWidgetProps) {
  /* ------------------- 上报 ------------------- */
  type Action = {
    id: string
    fn: (params: ReportParams, ...args: any[]) => Promise<void> | void
  }
  const [reportActions, setReportActions] = useSetState<{
    before: Action[]
    on: Action[]
    after: Action[]
  }>({
    before: [],
    on: [],
    after: [],
  })

  const { toast } = useToast()

  const { beforeReport, onReport, afterReport } = initialValues.plugin?.report || {}

  /**
   * 额外参数，上报触发时代入
   */
  const [_params, setReportFnParams] = useSetState<{
    [key in PluginName]?: any
  }>({})

  const params = useLatest(_params)

  const reportFn = useDebounceFn(
    async (showToast: boolean = true) => {
      const latestParams = params.current
      try {
        // before report
        await Promise.all(reportActions.before.map(async (action) => await action.fn(latestParams)))
        await beforeReport?.(window.__coverage__, latestParams)

        await Promise.all(reportActions.on.map(async (action) => await action.fn(latestParams)))
        await onReport?.(window.__coverage__, latestParams)
        showToast &&
          toast({
            description: '上报成功',
          })
      } catch (e) {
        showToast &&
          toast({
            description: '上报失败，请打开控制台查看原因',
            variant: 'destructive',
          })
        IstanbulWidget.logger.error('[istanbul-widget]:', e)
      } finally {
        // after report
        await Promise.all(reportActions.after.map(async (action) => await action.fn(latestParams)))
        await afterReport?.(window.__coverage__, latestParams)
      }
    },
    {
      wait: 300,
      leading: true,
      trailing: false,
    },
  )

  return {
    ...initialValues,
    reportActions,
    setReportActions,
    reportFn,
    setReportFnParams,
    reportFnparams: params.current,
  }
}

const Context = createContainer(useContext)

export default Context
