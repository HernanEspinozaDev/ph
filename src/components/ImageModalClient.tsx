'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageModalClientProps {
  src: string;
  alt: string;
}

export default function ImageModalClient({ src, alt }: ImageModalClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="mb-16 relative aspect-video w-full overflow-hidden rounded-2xl shadow-md border border-gray-100 cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white bg-black/50 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Ver imagen completa
            </span>
        </div>
      </div>

      {isOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button 
                className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black p-2 rounded-full transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                }}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <Image 
                src={src} 
                alt={alt} 
                fill
                className="object-contain"
                sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
