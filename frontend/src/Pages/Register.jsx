import React, { useState } from 'react'
import { Fillz } from '../Components/Formz'
import { useNavigate } from 'react-router-dom'
import PasswordMeter from '../Components/PasswordMeter'

const Register = () => {
  const nav = useNavigate();
  const [info, setInfo] = useState({
    password: '',
    confirm: ''
  })
  const change = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value})
  }
  return (
    <div className='w-full h-[100vh] p-2'>
      <div className='w-full h-full items-center gap-3 flex flex-col pt-10'>
        <form className='w-full flex flex-col gap-3'>
          <Fillz iconClass={'bx  bxs-user'} type='text' placeholder='Name..'/>
          <Fillz iconClass={'bx  bxs-envelope'} type='text' placeholder='Email..'/>
          <Fillz iconClass={'bx bxs-lock-alt'} name='password' onChange={change} value={info?.password} type='password' placeholder='**********'/>
          <Fillz iconClass={'bx bxs-lock-alt'} name='confirm' onChange={change} value={info?.confirm} type='password' placeholder='**********'/>
          <div className='w-full p-1'>
              <PasswordMeter password={info.password}/>
          </div>
          <div className='w-full flex items-center justify-center'>
            <button className='text-gray-50 active:bg-slate-400 font-medium text-xl w-[50%] bg-gray-600 px-2 rounded-md'>
              Sign up
            </button> 
          </div>
        </form>
        <div onClick={()=> nav('/')} className='w-full rounded-md bg-gray-800 p-3'>
          <p className='font-semibold text-center max-sm:text-xs text-white'>Already have an account? <span className=' hover:underline text-blue-400 hover:text-blue-300 animate-pulse cursor-pointer'>Login</span></p>
        </div>
      </div>
    </div>
  )
}

export default Register