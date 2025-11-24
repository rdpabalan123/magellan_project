import React, { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext()
export function useAuth(){ return useContext(AuthContext) }


export default function AuthProvider({ children }){
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('mag_user')))
useEffect(()=>{ localStorage.setItem('mag_user', JSON.stringify(user)) }, [user])
const login = (email) => setUser({ email })
const logout = () => setUser(null)
return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}