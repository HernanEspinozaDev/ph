import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Términos para el uso del sitio web, catálogo y cotizador de Pastelería Hijitos en Cartagena.',
  alternates: { canonical: '/condiciones-de-servicio' },
};

const sectionClass = 'space-y-3';

export default function TermsOfServicePage() {
  return (
    <article className="bg-white px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Uso del sitio</p>
        <h1 className="font-serif text-4xl text-primary sm:text-5xl">Términos y condiciones</h1>
        <p className="mt-4 text-sm text-muted-foreground">Última actualización: 28 de septiembre de 2026</p>

        <div className="mt-10 space-y-9 leading-7 text-gray-700">
          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Alcance</h2>
            <p>Estos términos regulan el acceso y uso de pasteleriahijitos.cl, su catálogo de productos y el cotizador de eventos. Al navegar por el sitio, aceptas utilizarlos de forma lícita y respetuosa.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Catálogo, precios y disponibilidad</h2>
            <p>El catálogo presenta productos y valores referenciales. La disponibilidad, los detalles, el precio final y las condiciones de retiro o entrega deben confirmarse directamente con Pastelería Hijitos. Las fotografías son ilustrativas; la presentación puede variar según el producto y su elaboración.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Cotizaciones</h2>
            <p>El cotizador genera una propuesta de productos y valores; no procesa pagos ni confirma por sí mismo una compra, reserva o pedido. Las cotizaciones emitidas indican una vigencia de siete días. Para concretar un pedido, la persona debe comunicarse con el negocio y recibir confirmación de disponibilidad y condiciones.</p>
            <p>La persona que genera una cotización es responsable de revisar los datos ingresados y de compartir el PDF únicamente con quienes corresponda. El archivo queda accesible por su enlace durante un máximo de siete días, según la regla de eliminación configurada en Cloudflare.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Reseñas y contenido de terceros</h2>
            <p>Las reseñas de Google se muestran como opiniones de sus autores y no necesariamente representan una declaración de Pastelería Hijitos. Google, WhatsApp, redes sociales y otros sitios enlazados son servicios de terceros, sujetos a sus propias condiciones y políticas.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Contenido del sitio</h2>
            <p>Los textos, fotografías, logotipos y elementos de marca del sitio pertenecen a Pastelería Hijitos o se utilizan con autorización de sus titulares. No está permitido copiarlos o reutilizarlos con fines comerciales sin autorización, salvo los usos permitidos por la ley.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Disponibilidad y cambios</h2>
            <p>El sitio puede actualizarse, suspenderse o modificar sus contenidos para reflejar cambios de productos, precios o servicios. Estos términos no limitan los derechos que la legislación aplicable reconoce a las personas consumidoras.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-medium text-gray-900">Contacto</h2>
            <p>Para consultas sobre el sitio, productos o cotizaciones, contáctanos en <a className="text-primary underline underline-offset-4" href="mailto:pasteleriahijitos@gmail.com">pasteleriahijitos@gmail.com</a> o al <a className="text-primary underline underline-offset-4" href="tel:+56987421819">+56 9 8742 1819</a>.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
