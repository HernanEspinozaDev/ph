import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
);

export function Footer() {
  return (
    <footer className="bg-primary px-4 py-16 text-primary-foreground">
      <div className="container mx-auto">
        <div className="mb-12 grid gap-12 md:grid-cols-3">
          <div>
            <h4 className="mb-4 text-sm font-light uppercase tracking-wider">Menú del pie de página</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-light transition-opacity hover:opacity-70">Buscar</Link></li>
              <li><Link href="#" className="text-sm font-light transition-opacity hover:opacity-70">Preguntas Frecuentes</Link></li>
              <li><Link href="/locations" className="text-sm font-light transition-opacity hover:opacity-70">Ubicaciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-light uppercase tracking-wider">Suscríbete a nuestro boletín</h4>
            <p className="mb-4 text-sm font-light opacity-80">Promociones, nuevos productos y ventas. Directamente a tu bandeja de entrada.</p>
            <form className="flex">
                <Input type="email" placeholder="Tu email" className="rounded-r-none border-primary-foreground/50 bg-primary/80 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-offset-primary" />
                <Button type="submit" variant="secondary" className="rounded-l-none bg-primary-foreground text-primary hover:bg-primary-foreground/80">Suscribirse</Button>
            </form>
          </div>
           <div>
             <h4 className="mb-4 text-sm font-light uppercase tracking-wider">Síguenos</h4>
             <div className="flex gap-4">
                <a href="https://www.facebook.com/pasteleria.hijitos" aria-label="Facebook" className="transition-opacity hover:opacity-70"><FacebookIcon className="h-6 w-6" /></a>
                <a href="https://www.instagram.com/pasteleria.hijitos/" aria-label="Instagram" className="transition-opacity hover:opacity-70"><InstagramIcon className="h-6 w-6" /></a>
             </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm font-light">
          <p>© {new Date().getFullYear()} Pastelería Hijitos.</p>
        </div>
      </div>
    </footer>
  );
}
