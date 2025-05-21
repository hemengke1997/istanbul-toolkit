import { lazy, Suspense, useEffect, useState } from 'react'
import Static from './Static'
import './App.css'

const Lazy = lazy(() => import('./Lazy'))

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    window.__init_istanbul_widget__?.()
  }, [])

  return (
    <>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
      <Suspense fallback={<div />}>
        <Lazy />
      </Suspense>
      <Static />
    </>
  )
}

export default App
