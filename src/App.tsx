import { Home } from "./pages"
import { Contact } from "./pages"
import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {

  return (
    <>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </>
  )
}

export default App
