'use client';

import { Switch } from '@headlessui/react';

interface ToggleProps {
    enabled: boolean;
    onChange?: (checked: boolean) => void;
    srLabel?: string;
}

export default function ToggleSwitch({ enabled, onChange, srLabel }: ToggleProps) {
    return (
        <Switch
            checked={enabled}
            onChange={onChange || (() => { })}
            className={`${enabled ? 'bg-green-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
            <span className="sr-only">{srLabel || 'Toggle'}</span>
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>
    );
}
