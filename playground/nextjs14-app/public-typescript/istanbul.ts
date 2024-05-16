import { IstanbulWidget } from 'istanbul-widget/lib'

const toFormData = (obj) => {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}

async function report(coverage, params, ..._args) {
  console.log(coverage, 'coverage')
  const reponame = 'nextjs-app'
  const res = await fetch(`http://localhost:3000/${reponame}/coverage/client?v=${__GIT_COMMIT_ID__}`, {
    body: toFormData({
      coverage,
      params,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error('上报失败')
  }
}

new IstanbulWidget({
  defaultPosition: {
    y: 100,
  },
  plugin: {
    report: {
      async onReport(...args) {
        await report(...args)
      },
    },
    setting: {
      requireReporter: false,
      autoReport: false,
    },
  },
})
