import { Component } from "solid-js"
import { Routes, Route } from "@solidjs/router"
import Todos from "./pages/Todos"

// This uses the solid router more for show than for actual use
const App: Component = () => {
  return (
    <div>
      <Routes>
        <Route path="/" component={Todos} />
        <Route path="/solid-mobx-todomvc" component={Todos} />
      </Routes>
    </div>
  )
}

export default App
