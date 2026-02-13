import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MenuGroup } from '@/types/menu';

interface MenuSidebarProps {
    activeGroup: string;
    onSelectGroup: (id: string) => void;
    groups: MenuGroup[];
}

export function MenuSidebar({ activeGroup, onSelectGroup, groups }: MenuSidebarProps) {
    return (
        <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 z-50">
            <div className="p-6 flex justify-center border-b border-stone-100">
                <div className="relative w-32 h-20">
                    <Image
                        src="/logo.webp"
                        alt="Logo Hijitos"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p className="px-4 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Carta</p>
                {groups.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => onSelectGroup(group.id)}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            activeGroup === group.id
                                ? "bg-amber-100 text-amber-900 border-l-4 border-amber-500"
                                : "text-stone-600 hover:bg-stone-50"
                        )}
                    >
                        {group.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-stone-100 text-xs text-center text-stone-400">
                © 2024 Pastelería Hijitos
            </div>
        </div>
    );
}
