import ImageModalClient from '@/components/ImageModalClient';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="mb-12 text-center text-5xl font-serif text-primary">Nuestra Historia</h1>
        
        <ImageModalClient src="/historia.webp" alt="Historia de Pastelería Hijitos" />

        <div className="space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xl font-light leading-relaxed text-gray-700">
            Nuestros inicios se remontan al año 2006. Comenzamos desde abajo, vendiendo directamente en la calle 
            como vendedores ambulantes. En un principio, eran nuestros hijos quienes iban puerta por puerta, 
            ofreciendo las preparaciones familiares en bandejas por porciones. De ahí nace nuestro querido nombre: 
            <strong> Pastelería Hijitos</strong>.
          </p>
          
          <p className="text-xl font-light leading-relaxed text-gray-700">
            Con el tiempo y mucha dedicación, fuimos perfeccionando nuestras recetas hasta crear nuestros famosos 
            <strong> pastelitos a $100</strong>, los cuales vendíamos todos los veranos unidos como familia. 
            Fue en esa época que Cristian comenzó a recorrer todo Cartagena con su carrito, llevando nuestros 
            sabores a la tradicional Terraza, a las Ferias y a la emblemática Plaza de Cartagena.
          </p>

          <p className="text-xl font-light leading-relaxed text-gray-700">
            Todo lo que somos hoy es el resultado de un inmenso esfuerzo y un trabajo conjunto de elaboración. 
            La dedicación de Lorena, junto a Cristian y sus hijos, conforman la verdadera historia y el corazón 
            de Pastelería Hijitos. 
          </p>

          <p className="text-xl font-light leading-relaxed text-gray-700">
            Actualmente, no solo seguimos fieles a nuestras raíces, sino que hemos crecido para acompañarte en 
            tus momentos más importantes: realizamos <strong>pedidos de coctelería y eventos</strong>, 
            y creamos hermosas <strong>tortas personalizadas</strong> hechas con el mismo cariño del primer día.
          </p>
        </div>
      </div>
    </div>
  );
}
