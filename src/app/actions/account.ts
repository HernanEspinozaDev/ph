'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function changePassword(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || !session.id) {
        return { success: false, message: 'No has iniciado sesión.' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: 'Todos los campos son obligatorios.' };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: 'las contraseñas no coinciden.' };
    }

    if (newPassword.length < 8) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' };
    }

    try {
        const { env } = getRequestContext();
        const db = env.DB;

        // Get user from DB to verify current password
        const { results } = await db.prepare('SELECT * FROM usuarios WHERE id = ?').bind(session.id).all<any>();
        const user = results[0];

        if (!user) {
            return { success: false, message: 'Usuario no encontrado.' };
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return { success: false, message: 'La contraseña actual es incorrecta.' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.prepare('UPDATE usuarios SET password = ? WHERE id = ?')
            .bind(hashedPassword, session.id)
            .run();

        return { success: true, message: 'Contraseña actualizada correctamente.' };

    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, message: 'Error al actualizar la contraseña.' };
    }
}
