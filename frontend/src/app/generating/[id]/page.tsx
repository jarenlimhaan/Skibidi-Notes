'use client';

import ToiletAnimation from "@/components/loading"
import withAuth from '@/components/auth/authGuard';
import { useParams } from 'next/navigation';
import { useEffect } from "react";



const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const GeneratingLoading = () => {

    const params = useParams();
    const id = params.id;

    // Poll the backend to check if is done 
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${backendURL}/api/generator/status/${id}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                // handle response, e.g., redirect if done
                if (data.status === "Not Found" ) {
                    window.location.href = `/library`;
                }
                else if(data.status === "SUCCESS") {
                    window.location.href = `/library?id=${id}`;
                }
            })
            .catch(console.error);
        }, 10000);

        return () => clearInterval(interval);
    }, [id]);


    // if is still generating show the toilet
    return (
        <ToiletAnimation/>
    )

}

export default withAuth(GeneratingLoading)