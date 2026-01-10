import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset: number = 150) {
    const [activeId, setActiveId] = useState<string>(ids[0]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ids.map(id => document.getElementById(id));
            const scrollPosition = window.scrollY + offset;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveId(ids[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ids, offset]);

    const scrollToSection = (id: string, headerOffset: number = 100) => {
        const section = document.getElementById(id);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - headerOffset,
                behavior: 'smooth',
            });
            setActiveId(id);
        }
    };

    return { activeId, scrollToSection };
}
