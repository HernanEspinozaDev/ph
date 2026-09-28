import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Conoce cómo Pastelería Hijitos utiliza la información del cotizador, las reseñas de Google y las tecnologías necesarias para operar este sitio.',
  alternates: { canonical: '/politica-de-privacidad' },
};

const sectionClass = 'space-y-3';

export default function PrivacyPolicyPage() {
  return (
    <article className="bg-white px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Información y transparencia</p>
        <h1 className="font-serif text-4xl text-primary sm:text-5xl">Política de privacidad</h1>
        <p className="mt-4 text-sm text-muted-foreground">Última actualización: 28 de septiembre de 2026</p>

        <div className="mt-10 space-y-9 leading-7 text-gray-700">
          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Quién opera este sitio</h2>
            <p>Este sitio es operado bajo el nombre comercial Pastelería Hijitos, en Cartagena, Región de Valparaíso, Chile. Para consultas sobre privacidad o sobre una cotización, puedes escribir a <a className="text-primary underline underline-offset-4" href="mailto:pasteleriahijitos@gmail.com">pasteleriahijitos@gmail.com</a> o llamar al <a className="text-primary underline underline-offset-4" href="tel:+56987421819">+56 9 8742 1819</a>.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Navegación por el sitio</h2>
            <p>No solicitamos que las personas creen una cuenta para navegar por las páginas públicas y no utilizamos herramientas de analítica publicitaria ni píxeles de seguimiento en el código de este sitio. El proveedor de alojamiento, Cloudflare, puede procesar información técnica de las solicitudes para entregar y proteger el servicio.</p>
            <p>El cotizador guarda en el almacenamiento local del navegador los productos seleccionados, sus cantidades y precios para mantener el carrito entre páginas. Esa información queda en el dispositivo del visitante y puede borrarse limpiando los datos del sitio en el navegador.</p>
            <p>El panel privado de ventas utiliza cookies funcionales para mantener la sesión de administración y recordar preferencias de interfaz. No son cookies publicitarias ni de analítica. Las páginas públicas no requieren iniciar sesión.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Cotizaciones y datos del cliente</h2>
            <p>Si generas una cotización, el formulario solicita nombre o razón social, RUT, teléfono, dirección, ciudad y tipo de documento. Estos datos se incorporan al PDF junto con los productos, cantidades y precios elegidos.</p>
            <p>Al generar la cotización, el PDF se sube a Cloudflare R2 y queda disponible mediante un enlace público temporal. La configuración de Cloudflare elimina el archivo automáticamente siete días después de su carga, que es el plazo de vigencia de la cotización. No necesitas solicitar el borrado cuando venza ese plazo. Durante esos siete días, cualquier persona que tenga el enlace puede abrir el PDF; puedes pedir que lo eliminemos antes escribiendo al correo de contacto. No compartas el enlace si no deseas que otras personas vean los datos incluidos.</p>
            <p>Para gestionar la cotización, el sitio guarda en Cloudflare D1 el folio, enlace al PDF, total y detalle de productos. El borrado automático de Cloudflare R2 elimina el archivo PDF, pero no elimina ese registro de D1. Puedes solicitar la eliminación anticipada del PDF o la eliminación del registro asociado escribiendo al correo de contacto indicado en esta política.</p>
            <p>El botón de WhatsApp abre un mensaje preparado con algunos datos de la cotización y el enlace al PDF. El mensaje solo se envía al negocio si la persona confirma el envío en WhatsApp. WhatsApp procesa la información de acuerdo con su propia <a className="text-primary underline underline-offset-4" href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noreferrer">política de privacidad</a>.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Reseñas de Google</h2>
            <p>La página de inicio consulta Google Business Profile para mostrar reseñas públicas de la ficha de Pastelería Hijitos. Podemos mostrar el nombre público del autor, su puntuación, el comentario, la fecha y, si existe, la respuesta del negocio. El contenido se solicita al servidor de Google para presentar las reseñas y no se guarda en Cloudflare D1 ni R2. La configuración conserva en D1 la cuenta y ubicación elegidas, el orden de presentación y si el bloque está activo.</p>
            <p>La autorización OAuth pertenece a la cuenta administradora del negocio. El refresh token y el secreto del cliente se guardan como secretos en Cloudflare y solo se usan en el servidor para renovar el acceso y consultar reseñas. El navegador de los visitantes no recibe esas credenciales ni necesita iniciar sesión con Google. La administración puede ocultar las reseñas desde el panel y revocar la autorización desde la cuenta de Google. Para solicitar que eliminemos la configuración guardada en D1, escribe al correo de contacto.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Servicios externos</h2>
            <p>Algunas páginas cargan tipografías de Google Fonts y un mapa insertado de Google Maps. Al abrir esos recursos, el navegador se conecta directamente con Google, que puede procesar datos técnicos de la conexión conforme a sus políticas. También hay enlaces a servicios externos, como redes sociales y WhatsApp; al abrirlos, se aplican sus términos y políticas de privacidad.</p>
            <p>Consulta las políticas de <a className="text-primary underline underline-offset-4" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google</a> y <a className="text-primary underline underline-offset-4" href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare</a> para conocer sus prácticas.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Solicitudes y cambios</h2>
            <p>Para consultar, corregir o solicitar la eliminación de información asociada a una cotización, escribe a <a className="text-primary underline underline-offset-4" href="mailto:pasteleriahijitos@gmail.com">pasteleriahijitos@gmail.com</a> e indica el folio de la cotización si lo tienes. Actualizaremos esta política cuando cambien las funciones del sitio o la forma en que se procesa la información.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
