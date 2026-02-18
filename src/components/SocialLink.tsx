'use client';

import { useState, useEffect } from 'react';

interface SocialLinkProps {
    platform: 'instagram' | 'facebook' | 'tiktok' | 'default';
    username?: string; // Para Instagram/TikTok
    id?: string;       // Para Facebook (Necesitas el ID numérico, no el user)
    webUrl: string;
    children: React.ReactNode;
    className?: string;
}

export const SocialLink = ({ platform, username, id, webUrl, children, className }: SocialLinkProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detectar si es dispositivo móvil
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
            setIsMobile(true);
        }
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (!isMobile) return; // En escritorio dejamos que el <a href> normal funcione

        e.preventDefault();
        let appUrl = '';

        // 1. Definir los esquemas de URL (Deep Links)
        switch (platform) {
            case 'instagram':
                // Abre perfil de Instagram
                appUrl = `instagram://user?username=${username}`;
                break;
            case 'facebook':
                // Usa facewebmodal para abrir con URL/username sin necesitar ID numérico
                appUrl = `fb://facewebmodal/f?href=${encodeURIComponent(webUrl)}`;
                break;
            case 'tiktok':
                // TikTok maneja bien los Universal Links, mejor usar el webUrl directo para deep linking
                // Si preferimos intentar esquema: `snssdk1233://user/profile/${id}` pero requiere ID numérico
                // Dejamos que el fallback o el comportamiento por defecto maneje la redirección
                window.open(webUrl, '_blank');
                return;
            default:
                window.open(webUrl, '_blank');
                return;
        }

        // 2. Intentar abrir la App
        const start = Date.now();
        window.location.href = appUrl;

        // 3. Fallback: Si después de 1.5s seguimos aquí, abrir la web
        // (El navegador bloqueará este timeout si la app se abrió correctamente y cambió el foco)
        setTimeout(() => {
            const end = Date.now();
            if (end - start < 2500 && !document.hidden) {
                window.open(webUrl, '_blank');
            }
        }, 1500);
    };

    return (
        <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </a>
    );
};
