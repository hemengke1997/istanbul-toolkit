import { useState } from 'react'

export default function Home() {
  const [x, setX] = useState(0)

  return <div onClick={() => setX((t) => t + 1)}>this is home {x}</div>
}
