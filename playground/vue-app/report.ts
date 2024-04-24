async function report(coverage: any) {
  const reponame = 'vue-app'
  await fetch(`http://localhost:3000/${reponame}/coverage/client?v=${__GIT_COMMIT_ID__}`, {
    body: JSON.stringify(coverage),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

window.__report = report
