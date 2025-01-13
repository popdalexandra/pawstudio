'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';


const links = [
    {
      title: 'Rapoarte',
      href: '/admin/overview',
    },
    {
      title: 'Administrare',
      href: '/admin/products',
    },
    {
      title: 'Comenzi',
      href: '/admin/orders',
    },
    {
      title: 'Utilizatori',
      href: '/admin/users',
    },
  ];

const MainNav = ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();

    return ( <nav  className={cn('flex items-center space-x-4 lg:space-x-6', className)}
    {...props}>
        {links.map((item) => (
        <Link
        key={item.href}
        href={item.href}
        className={cn(
          'text-sm font-medium transition-colors hover:text-pink-300',
          pathname.includes(item.href)
            ? 'font-bold text-pink-900' // Textul să fie bold și roz când suntem pe acea pagină
            : 'text-muted-foreground' // Altfel, culoare normală
        )}
      >
        {item.title}
      </Link>
      
      ))}
        
        </nav> );
}
 
export default MainNav;