import React from 'react'
import { ThemeToggle } from './theme-toggle'
import Image from 'next/image'

const Navbar = () => {
    return (
        <div className='flex justify-end items-center p-2 bg-background text-foreground'>
            <ThemeToggle />
        </div>
    )
}

export default Navbar