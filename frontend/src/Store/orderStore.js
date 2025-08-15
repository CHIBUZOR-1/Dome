import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify'
import { persist } from 'zustand/middleware';

export const orderSnip = create((set)=> ({
    orders: async()=> {},
    getOrders: async()=> {},
    updateOrder: async()=> {},
    trackOrder: async()=> {}
}))