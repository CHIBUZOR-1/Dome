import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify'

export const productSnip = create((set)=> ({
    getProducts: async()=> {},
    addProducts: async()=> {},
    deleteProduct: async()=> {},
    updateProduct: async()=> {}
}))