"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return(
        <div className = "flex items-center justify-center min-h-screen bg-gray-900">
            <div className = "w-1/2 bg-gray-800 p-20 rounded-lg shadow-md ">

            </div>
        </div>
    );
}