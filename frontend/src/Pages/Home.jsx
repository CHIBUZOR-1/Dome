import React from 'react'
import { Searchz } from '../Components/Formz'

const Home = () => {
  return (
    <div className='w-full h-full'>
        <div className='h-14 bg-slate-600 flex gap-2 items-center justify-between p-2 shadow-md'>
            <h1 className='text-xl text-slate-50 font-bold'>DOME</h1>
            <Searchz iconClass={'bx bx-search'} type='text' />
            <div className='flex'>
                <div><p className=' p-2 text-slate-50 font-semibold'>Login</p></div>
                <div>
                    <button>Sign up</button>
                </div>
            </div>
            <div className='text-slate-50 relative'>
                <i class='bx bxs-cart text-3xl' ></i>
                <p className='absolute top-0 right-0 bg-red-500 w-4 h-4 flex items-center justify-center rounded-full text-xs'>0</p>
            </div>
        </div>
    </div>
  )
}

export default Home