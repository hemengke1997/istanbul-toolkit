async function report(coverage: any, ...args: any[]) {
  const reponame = 'react-app'
  console.log(args, 'args')
  await fetch(`http://localhost:3000/${reponame}/coverage/client?v=temp_git_commit_id`, {
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
