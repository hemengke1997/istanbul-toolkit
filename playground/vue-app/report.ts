function report(coverage: any) {
  const reponame = 'vue-app'
  fetch(`http://localhost:8988/${reponame}/coverage/client`, {
    body: JSON.stringify(coverage),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

window.__report = report
