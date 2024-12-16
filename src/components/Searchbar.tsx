'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card } from "./ui/card"
import { Search } from 'lucide-react'
import { BackgroundGradient } from "./ui/background-gradient";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)

  return (
      <Card className={`w-11/12  md:w-full max-w-2xl mx-auto transition-all duration-300 rounded-3xl ${isFocused ? 'shadow-lg' : 'shadow'}`}>
        <BackgroundGradient>
            <div className="flex items-center rounded-full">
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="flex-grow rounded-2xl bg-black/40 border-none text-lg focus:outline-none focus:ring-0 placeholder-gray-300"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <Button 
                variant={'default'}
                type="submit" 
                size="lg"
                className="rounded-full ml-1"
              >
              <Search className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Search</span>
              </Button>
           </div>
        </BackgroundGradient>
      </Card>
  )
}

