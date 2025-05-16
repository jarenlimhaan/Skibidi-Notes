'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: () => axios.get(`http://localhost:8000/api/users`).then(res => res.data),
})

export const useUserById = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
     queryFn: () => axios.get(`${backendURL}/api/users/${id}`).then(res => res.data),
     enabled: !!id,
})}