import { useState, useEffect } from 'react';

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [prevOffset, setPrevOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentOffset = window.scrollY;
            if (currentOffset > prevOffset && currentOffset > 50) {
                setScrollDirection('down');
            } else if (currentOffset < prevOffset) {
                setScrollDirection('up');
            }
            setPrevOffset(currentOffset);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevOffset]);

    return scrollDirection;
}
