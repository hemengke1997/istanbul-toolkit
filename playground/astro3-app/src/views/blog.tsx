import { createContext } from 'react'

const C = createContext({ a: 'test' })

export default function Blog() {
  return (
    <C.Provider value={{ a: '1' }}>
      <div style={{ color: 'wheat' }}>
        <h1>Blog</h1>
        <p>Welcome to my blog!</p>
      </div>
    </C.Provider>
  )
}
