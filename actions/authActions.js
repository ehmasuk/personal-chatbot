"use server"
import { signIn, signOut } from "@/auth"

export const login = async(data)=>{
    await signIn("credentials", data)
}

export const logout = async() => {
    await signOut()
}