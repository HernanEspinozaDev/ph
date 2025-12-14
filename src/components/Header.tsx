"use client";

import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

const navLinks = [
  {
    label: 'Pophams Bakery',
    dropdown: [
      { label: 'Our Story', href: '#' },
      { label: 'Our Team', href: '#' },
      { label: 'Our Locations', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  { label: 'Pophams Home', href: '#' },
  {
    label: 'Events & Catering',
    dropdown: [
      { label: 'Events', href: '#' },
      { label: 'Venue Hire', href: '#' },
    ],
  },
  { label: 'Order Online', href: '#' },
];

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const NavContent = () => (
    <>
      {navLinks.map((link) =>
        link.dropdown ? (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => setOpenDropdown(link.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-light uppercase tracking-wide text-primary transition-opacity hover:opacity-70">
              {link.label}
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === link.label && (
              <div className="absolute left-0 top-full z-20 min-w-[200px] border border-border bg-background/90 py-2 shadow-lg backdrop-blur-sm">
                {link.dropdown.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-6 py-2.5 text-sm font-light text-primary transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={link.label}
            href={link.href!}
            className="text-sm font-light uppercase tracking-wide text-primary transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        )
      )}
    </>
  );
  
  const MobileNavContent = () => (
    <nav className="flex flex-col gap-6 p-8 pt-24 text-lg">
      {navLinks.map((link) => (
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
          <Link href="/" className="flex-1">
            <h1 className="text-xl font-light tracking-[0.2em] text-primary">POPHAMS</h1>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavContent />
          </nav>

          <div className="flex flex-1 justify-end md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-primary" />
                  <span className="sr-only">Open menu</span>
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
