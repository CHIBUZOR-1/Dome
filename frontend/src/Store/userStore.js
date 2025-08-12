import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify'
import { persist } from 'zustand/middleware';

export const userSnip = create(persist(
    (set) => ({
        user: null,
        register: async() => {
            console.log('sign-Up')
        },
        login: async() => {
            console.log('sign-in')
        },
        verifyEmail: async()=> {},
        forgotPassword: async()=> {},
        resetPassword: async()=> {},
        fetchUsers: async() => {},
        updateProfile: async()=> {
            console.log('update')
        },
        logout: async() => {}
    }),
    {
        name: 'user-storage', // key in localStorage
        partialize: (state) => ({ 
            user: state.user,
        }) // only persist the needed field
    }
))

export default userSnip;