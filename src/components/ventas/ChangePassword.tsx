'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changePassword } from '@/app/actions/account';
import { useState, useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {pending ? 'Actualizando...' : 'Cambiar Contraseña'}
        </button>
    );
}

const initialState = {
    success: false,
    message: '',
};

export default function ChangePassword() {
    // @ts-ignore
    const [state, formAction] = useFormState(changePassword, initialState);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (state?.success) {
            // Optional: reset form or redirect
            const form = document.getElementById('password-form') as HTMLFormElement;
            form?.reset();
        }
    }, [state?.success]);

    const validatePasswords = (formData: FormData) => {
        const newPass = formData.get('newPassword') as string;
        const confirmPass = formData.get('confirmPassword') as string;

        if (newPass.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres.');
            return false;
        }
        if (newPass !== confirmPass) {
            setPasswordError('Las contraseñas no coinciden.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">
                Cambiar Contraseña
            </h3>

            <form id="password-form" action={formAction} onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);
                if (!validatePasswords(formData)) {
                    e.preventDefault();
                }
            }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                    <input
                        type="password"
                        name="currentPassword"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input
                        type="password"
                        name="newPassword"
                        required
                        minLength={8}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        minLength={8}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>

                {passwordError && (
                    <div className="text-sm text-red-600">
                        {passwordError}
                    </div>
                )}

                {state?.message && (
                    <div className={`text-sm p-2 rounded ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {state.message}
                    </div>
                )}

                <div className="pt-2">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
