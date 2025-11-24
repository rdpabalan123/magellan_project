import React, { createContext, useContext, useEffect, useState } from 'react'
const ThemeContext = createContext()
export function useTheme(){ return useContext(ThemeContext) }


export default function ThemeProvider({ children }){
// auto: follow system, but allow override
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const [theme, setTheme] = useState(() => localStorage.getItem('mag_theme') || (prefersDark ? 'dark' : 'light'))
useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('mag_theme', theme) }, [theme])
return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}