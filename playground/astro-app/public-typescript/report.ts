async function report(coverage: any) {
  console.log(coverage, 'coverage')
  const reponame = 'astro-app'
  await fetch(`http://localhost:3000/${reponame}/coverage/client?v=${__GIT_COMMIT_ID__}`, {
    body: JSON.stringify(coverage),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

window.__report = report

const customClick = (...args: any[]) => {
  console.log('自定义按钮点击事件', args)
}

window.__customClick = customClick
