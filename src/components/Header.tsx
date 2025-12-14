"use client";

import { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  {
    label: 'Pastelería Hijitos',
    dropdown: [
      { label: 'Nuestra Historia', href: '/about' },
      { label: 'Nuestro Equipo', href: '/team' },
      { label: 'Nuestras Ubicaciones', href: '/locations' },
      { label: 'Contacto', href: '/contact' },
    ],
  },
  { label: 'Fuente de Soda', href: '/fuente-de-soda' },
  { label: 'Tortas', href: '/tortas' },
  {
    label: 'Eventos y Catering',
    dropdown: [
      { label: 'Dulces', href: '/dulces' },
      { label: 'Salados', href: '/salados' },
    ],
  },
  { label: 'Pedir en Línea', href: '/order-online' },
];

const mobileNavLinks = [
  {
    label: 'Pastelería Hijitos',
    dropdown: [
      { label: 'Nuestra Historia', href: '/about' },
      { label: 'Nuestro Equipo', href: '/team' },
      { label: 'Nuestras Ubicaciones', href: '/locations' },
      { label: 'Contacto', href: '/contact' },
    ],
  },
  { label: 'Fuente de Soda', href: '/fuente-de-soda' },
  { label: 'Tortas', href: '/tortas' },
  {
    label: 'Eventos y Catering',
    dropdown: [
      { label: 'Dulces', href: '/dulces' },
      { label: 'Salados', href: '/salados' },
    ],
  },
  { label: 'Pedir en Línea', href: '/order-online' },
];

export function Header() {
  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <div key={link.label}>
        {link.dropdown ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group relative text-sm font-light uppercase tracking-wide text-primary transition-opacity hover:opacity-70 hover:bg-transparent">
                  {link.label}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                   <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                {link.dropdown.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="text-primary font-light transition-opacity hover:opacity-70">{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        ) : (
          <Button asChild variant="ghost" className="group relative text-sm font-light uppercase tracking-wide text-primary transition-opacity hover:opacity-70 hover:bg-transparent">
            <Link
              href={link.href!}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </Button>
        )}
        </div>
      ))}
    </>
  );

  const MobileNavContent = () => (
    <nav className="flex flex-col gap-6 p-8 pt-24 text-lg">
      {mobileNavLinks.map((link) => (
        <div key={link.label}>
          {link.dropdown ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-light uppercase tracking-wider text-muted-foreground">{link.label}</p>
              {link.dropdown.map((item) => (
                <Link key={item.label} href={item.href} className="text-primary font-light transition-opacity hover:opacity-70">
                  {item.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link href={link.href!} className="text-primary font-light uppercase tracking-wider transition-opacity hover:opacity-70">
              {link.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex flex-1 items-center lg:flex-none">
            <Image
              src="/logo.webp"
              alt="Pastelería Hijitos Logo"
              width={200}
              height={80}
              className="h-24 w-auto object-contain"
            />
          </Link>

          <nav className="hidden w-full items-center justify-center gap-2 lg:flex">
            <NavContent />
          </nav>

          <div className="flex flex-1 justify-end lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-primary" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background p-0">
                 <MobileNavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
