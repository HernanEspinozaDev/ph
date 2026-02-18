import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MenuGroup } from '@/types/menu';
import { SocialLinks } from '@/components/SocialLinks';

interface MobileMenuNavProps {
    activeGroup: string;
    onSelectGroup: (id: string) => void;
    groups: MenuGroup[];
}

export function MobileMenuNav({ activeGroup, onSelectGroup, groups }: MobileMenuNavProps) {
    return (
        <div className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Logo */}
            <div className="flex flex-col items-center justify-center py-3 border-b border-stone-100 gap-2">
                <div className="relative w-40 h-24">
                    <Image
                        src="/logo.webp"
                        alt="Logo Hijitos"
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <SocialLinks />
            </div>
            {/* Scrollable Nav */}
            <div className="flex overflow-x-auto whitespace-nowrap bg-white px-4 py-3 scrollbar-hide gap-3 border-b border-stone-200">
                {groups.map((group) => (
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
