import { createContext,useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext()
export function AuthProvider({children}) {
    const [user , setUser] = useState(null)
    const fetchUser = async()=>{
        try {
            const res = await api.me()
            setUser(res.user || null)
        } catch (error) {
            setUser(null)
        }
    }
    useEffect(()=>{fetchUser()},[])

    const logout = async()=>{
        await api.logout()
        setUser(null)
        window.location.href("/")
    }

    return (
        <AuthContext.Provider value={{user,setUser,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)