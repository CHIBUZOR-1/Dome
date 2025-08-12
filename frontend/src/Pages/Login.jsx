import React from 'react'
import { Fillz } from '../Components/Formz'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const nav = useNavigate()
  return (
    <div className='w-full p-2 h-[100vh] flex'>
      <div className='w-full flex h-full pt-11 flex-col gap-2 items-center'>
        <Fillz iconClass={'bx  bxs-envelope'} type='text' placeholder='Email..'/>
        <Fillz iconClass={'bx bxs-lock-alt'} type='password' placeholder='**********'/>
        <div className='w-full flex items-center justify-center'>
          <button className='text-gray-50 text-xl w-[50%] bg-gray-600 px-2 rounded-md'>
            Login
          </button> 
        </div>
        <div className='w-full'>
            <div className='flex p-2'>
              <p onClick={()=> nav('/forgot-password')} className='ml-auto text-blue-500 font-medium hover:underline cursor-pointer'>Forgot Password</p>
            </div>
            <div className='flex items-center p-2 justify-center'>
              <p className='text-slate-500 dark:text-slate-300 font-medium'>Don't have an account? <span onClick={()=> nav('/register')} className='text-blue-500 hover:underline cursor-pointer'>Sign up</span></p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login