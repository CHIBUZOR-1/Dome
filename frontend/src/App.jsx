import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import About from './Pages/About';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/Home';
import VerifyEmail from './Pages/VerifyEmail';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='About' element={<About />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/dome' element={<Home />}/>
        <Route path='/verify-acct' element={<VerifyEmail />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
      </Routes>
    </>
  )
}

export default App
