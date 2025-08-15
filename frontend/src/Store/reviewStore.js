import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify'
import { persist } from 'zustand/middleware';

export const reviewSnip = create((set)=> ({
    reviews: null,
    addReview: async() => {}
}))