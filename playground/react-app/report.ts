async function report(coverage: any) {
  const reponame = 'react-app'
  await fetch(`http://localhost:3000/${reponame}/coverage/client?v=temp_git_commit_id`, {
    body: JSON.stringify(coverage),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

window.__report = report
