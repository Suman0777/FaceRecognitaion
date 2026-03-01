import React from 'react'
import { AuroraText } from "@/components/ui/aurora-text"

const NavBar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-8 py-2 bg-black/50 backdrop-blur-lg border-b border-white/10 rounded-2xl shadow-lg">
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-white  flex items-center gap-2">
        F a c e <AuroraText>App</AuroraText>
      </h1>

      <a 
        href="https://github.com/Suman0777/FaceRecognitaion" 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-white/10 transition duration-300"
      >
        <img
          src="github.svg"
          alt="GitHub"
          className="w-6 h-6 sm:w-7 sm:h-7 invert"
        />
      </a>

    </nav>
  )
}

export default NavBar