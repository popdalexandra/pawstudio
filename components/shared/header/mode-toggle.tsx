'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {useTheme} from "next-themes";
import { SunIcon, MoonIcon, SunMoon } from 'lucide-react';

const ModeToggle = () => {

const [mounted, setMounted] = useState(false);
const {theme, setTheme} = useTheme();

useEffect(() => {
    setMounted(true);   
}, []);

if(!mounted){
    return null;
}

    return ( <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='ghost' className = 'focus-visible:ring-0 focus-visible:ring-offset-0'>
                {theme === 'system' ? (<SunMoon/>) : theme === 'dark'? (<MoonIcon/>): (<SunIcon/>) }
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 w-40 text-center"
            >
            <DropdownMenuLabel className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                Apariție
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

                <DropdownMenuCheckboxItem
                    checked={theme === "system"}
                    onCheckedChange={() => setTheme("system")}
                    className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1"
                >
                    Sistem
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme("dark")}
                    className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1"
                >
                    Întunecat
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onCheckedChange={() => setTheme("light")}
                    className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1"
                >
                    Luminos
                </DropdownMenuCheckboxItem>
                
        </DropdownMenuContent>
    </DropdownMenu> );
}
 
export default ModeToggle;