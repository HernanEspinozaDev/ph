import Image from 'next/image';
import { MENU_GROUPS } from '@/lib/menuData';
import { cn } from '@/lib/utils';

interface MobileMenuNavProps {
    activeGroup: string;
    onSelectGroup: (id: string) => void;
}

export function MobileMenuNav({ activeGroup, onSelectGroup }: MobileMenuNavProps) {
    return (
        <div className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Logo */}
            <div className="flex justify-center py-3 border-b border-stone-100">
                <div className="relative w-40 h-24">
                    <Image
                        src="/logo.webp"
                        alt="Logo Hijitos"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            {/* Scrollable Nav */}
            <div className="flex overflow-x-auto whitespace-nowrap bg-white px-4 py-3 scrollbar-hide gap-3 border-b border-stone-200">
                {MENU_GROUPS.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => onSelectGroup(group.id)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                            activeGroup === group.id
                                ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200"
                                : "bg-white border-stone-200 text-stone-600"
                        )}
                    >
                        {group.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
