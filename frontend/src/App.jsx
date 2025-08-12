import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import About from './Pages/About';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='About' element={<About />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
      </Routes>
    </>
  )
}

export default App
