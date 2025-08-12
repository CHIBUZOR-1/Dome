import React, { useState } from 'react'
import { Fillz } from '../Components/Formz'
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState();
    const [isSubmitted, setIsSubmitted] = useState()
  return (
    <div className='flex h-screen items-center justify-center'>
        <div className='w-[90%] p-2 border'>
          <div className='w-full bg-white p-1 rounded-md'>
            <h1 className='font-medium text-center text-blue-500 text-xl'>Forgot Password</h1>
            {
              !isSubmitted ? (
                <form>
                  <p className='text-gray-500 mb-6 text-center '>Enter your email address <span className='max-sm:hidden'>and we'll send you a link to reset your password.</span></p>
                  <Fillz iconClass={'bxr  bxs-envelope'} type="text" name='email' onChange={(e) => setEmail(e.target.value)} placeholder="Email.."/>
                  <div  className='w-full flex items-center justify-center py-1'>
                    <button type='submit' className='bg-gray-700 p-1 w-[80%] rounded-md flex items-center gap-1 justify-center text-white font-semibold'>
                      Submit
                    </button>
                  </div>
                </form>
              ) : (
                <div className='flex items-center justify-center'>
                  <p className='text-gray-400 mb-6'>If an account exists for {email}, you will receive a password reset link shortly.</p>
                </div>
              )
            }
          </div>
          <div className='px-8 py-4 bg-gray-700 bg-opacity-55 flex justify-center'>
            <Link to={"/"} className='text-sm font-medium text-slate-50 flex items-center'>
              <i className='bx bxs-left-arrow'></i> Back to Login
            </Link>
          </div>
        </div>
        
      </div>
  )
}

export default ForgotPassword