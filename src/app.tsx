import React from 'react'

interface IProps {
  name: string
  age: number
}

function App(props: IProps) {
  const { name, age } = props
  return (
    <div className="app">
      <span>{`Hello!1111 222I'm ${name}, ${age} years old.`}</span>
    </div>
  )
}

export default App
