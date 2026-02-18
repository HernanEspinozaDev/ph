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
                // Facebook suele requerir el ID numérico (ej: 123456789) no el alias
                // Si es perfil: fb://profile/{id}
                // Si es página: fb://page/{id}
                appUrl = `fb://profile/${id}`;
                break;
            case 'tiktok':
                // TikTok suele funcionar bien con https, pero su esquema es:
                appUrl = `snssdk1233://user/profile/${id}`;
                // Nota: TikTok es complejo, a veces es mejor dejar el webUrl
                break;
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
