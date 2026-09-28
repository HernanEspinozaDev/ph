import Link from 'next/link';
import Image from 'next/image';
import { SocialLink } from '@/components/SocialLink';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#30263a] px-5 pb-6 pt-14 text-white sm:px-8 sm:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-fuchsia-300/10 blur-3xl" />
      <div className="container relative mx-auto max-w-7xl">
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1fr] lg:gap-10">
          <div>
            <Link href="/" className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <Image
                src="/logo.webp"
                alt="Pastelería Hijitos Logo"
                width={180}
                height={72}
                className="h-20 w-auto object-contain object-left"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
              Pastelería familiar en Cartagena. Preparaciones hechas con cariño para compartir en tus momentos especiales.
            </p>
          </div>

          <nav aria-label="Explora el sitio">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Explora</h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link className="transition-colors hover:text-white" href="/pasteleria">Pastelería</Link></li>
              <li><Link className="transition-colors hover:text-white" href="/cocteleria">Coctelería y catering</Link></li>
              <li><Link className="transition-colors hover:text-white" href="/tortas">Tortas</Link></li>
              <li><Link className="transition-colors hover:text-white" href="/locations">Ubicaciones</Link></li>
              <li><Link className="transition-colors hover:text-white" href="/contact">Contacto</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Visítanos</h2>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3"><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-200" /><span>Mariano Casanova 336, local 02<br />Cartagena, Valparaíso</span></li>
              <li><a className="flex items-center gap-3 transition-colors hover:text-white" href="tel:+56987421819"><Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-fuchsia-200" />+56 9 8742 1819</a></li>
              <li><a className="flex items-center gap-3 break-all transition-colors hover:text-white" href="mailto:pasteleriahijitos@gmail.com"><Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-fuchsia-200" />pasteleriahijitos@gmail.com</a></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Síguenos</h2>
            <div className="flex gap-3">
              <SocialLink
                platform="facebook"
                webUrl="https://www.facebook.com/pasteleria.hijitos"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <FacebookIcon className="h-5 w-5 text-white" />
              </SocialLink>

              <SocialLink
                platform="instagram"
                username="pasteleria.hijitos"
                webUrl="https://instagram.com/pasteleria.hijitos/"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <InstagramIcon className="h-5 w-5 text-white" />
              </SocialLink>
            </div>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm text-fuchsia-100 transition-colors hover:text-white">
              Hablemos de tu evento <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pastelería Hijitos · Cartagena, Chile</p>
          <nav aria-label="Información legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="transition-colors hover:text-white" href="/politica-de-privacidad">Política de privacidad</Link>
            <Link className="transition-colors hover:text-white" href="/condiciones-de-servicio">Términos y condiciones</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
