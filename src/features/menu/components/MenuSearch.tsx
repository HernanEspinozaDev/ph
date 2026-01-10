import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MenuSearchProps {
    value: string;
    onChange: (val: string) => void;
}

export function MenuSearch({ value, onChange }: MenuSearchProps) {
    return (
        <div className="sticky top-[105px] lg:top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-sm p-4 border-b border-stone-200/50">
            <div className="relative max-w-2xl mx-auto lg:mx-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                    placeholder="Buscar en la carta (ej. Churrasco Italiano)..."
                    className="pl-10 bg-white border-stone-200 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
