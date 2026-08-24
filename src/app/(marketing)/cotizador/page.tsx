'use client';

import { useCotizadorStore } from '@/hooks/useCotizadorStore';
import { useState, useEffect } from 'react';
import { saveQuote } from '@/app/actions/save-quote';
import { uploadPdf } from '@/app/actions/upload-pdf';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRouter } from 'next/navigation';

export default function CotizadorPage() {
    const router = useRouter();
    const { items, getTotal, removeItem, clearCart, updateQuantity } = useCotizadorStore();
    const [mounted, setMounted] = useState(false);
    
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('Boleta');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [waLinkState, setWaLinkState] = useState('');
    
    // Generate an ID for this session if it doesn't exist
    const [quoteId, setQuoteId] = useState('');

    useEffect(() => {
        setMounted(true);
        setQuoteId(`COT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    }, []);

    if (!mounted) return null;

    const generatePDF = async () => {
        const doc = new jsPDF();
        const magenta = [232, 17, 127]; // #e8117f
        const darkGray = [60, 60, 60];

        // 1. Load Logo
        try {
            const img = new Image();
            img.src = '/logo.webp';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            // Draw to canvas to get base64 PNG
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const pngDataUrl = canvas.toDataURL('image/png');
                doc.addImage(pngDataUrl, 'PNG', 14, 15, 40, 40);
            }
        } catch (e) {
            console.error("Error cargando logo", e);
            // Fallback text if logo fails
            doc.setFontSize(22);
            doc.setTextColor(magenta[0], magenta[1], magenta[2]);
            doc.setFont("helvetica", "bold");
            doc.text("Pastelería Hijitos", 14, 30);
        }

        // 2. Top Right Info (Date, Quote No)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.text("Fecha:", 140, 25);
        doc.text("Cotización No:", 140, 31);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(new Date().toLocaleDateString('es-CL'), 170, 25);
        doc.text(quoteId, 170, 31);

        // 3. Client & Company Data
        doc.setFontSize(10);
        
        // Left Column (Client)
        doc.setFont("helvetica", "bold");
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.text("Cliente / R.Social", 14, 60);
        doc.text("R.U.T.", 14, 66);
        doc.text("Dirección", 14, 72);
        doc.text("Ciudad", 14, 78);
        doc.text("Documento", 14, 84);

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(`: ${nombre || 'Consumidor Final'}`, 45, 60);
        doc.text(`: ${rut || '---'}`, 45, 66);
        doc.text(`: ${direccion || '---'}`, 45, 72);
        doc.text(`: ${ciudad || '---'}`, 45, 78);
        doc.text(`: ${tipoDocumento}`, 45, 84);

        // Right Column (Company)
        // Draw a vertical line separator
        doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
        doc.setLineWidth(1);
        doc.line(110, 55, 110, 85);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text("PASTELERÍA HIJITOS", 115, 60);
        doc.setFont("helvetica", "normal");
        doc.text("Mariano Casanova 336, Local 02", 115, 66);
        doc.text("Cartagena, Valparaíso", 115, 72);
        doc.text("Teléfono: +56 9 8742 1819", 115, 78);

        // 4. Greeting
        doc.text("Estimado(a) Cliente,", 14, 100);
        doc.text("Junto con saludar hacemos entrega del siguiente presupuesto detallado a continuación:", 14, 106);

        // 5. Table
        const tableData = items.map(item => [
            item.cantidad.toString(),
            `${item.nombre}\n${item.categoria.toUpperCase()}`,
            `$${item.precio_unitario.toLocaleString('es-CL')}`,
            `$${(item.precio_unitario * item.cantidad).toLocaleString('es-CL')}`
        ]);

        const totalValue = getTotal();
        const subtotalNeto = Math.round(totalValue / 1.19);
        const iva = totalValue - subtotalNeto;

        let finalY = 115;

        // @ts-ignore
        autoTable(doc, {
            startY: 115,
            head: [['Cantidad', 'Descripción del Producto', 'P. Unitario', 'Total']],
            body: tableData,
            foot: [
                ['', '', 'Subtotal Neto:', `$${subtotalNeto.toLocaleString('es-CL')}`],
                ['', '', 'IVA (19%):', `$${iva.toLocaleString('es-CL')}`],
                ['', '', 'Total a Pagar:', `$${totalValue.toLocaleString('es-CL')}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [200, 200, 200], textColor: [0,0,0], fontStyle: 'bold' },
            footStyles: { fillColor: [255, 255, 255], textColor: [0,0,0], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 25 },
                2: { halign: 'right', cellWidth: 30 },
                3: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
            },
            didDrawPage: (data: any) => {
                finalY = data.cursor.y;
            }
        });

        // 6. Footer Information (Validez & Bank)
        finalY += 10;
        
        // Validate if we need a new page
        if (finalY > 230) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("*Validez del presupuesto 7 días a partir de esta fecha*", 14, finalY);

        finalY += 5;

        // Bank Box
        doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(14, finalY, 182, 45, 3, 3);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.text("Forma de pago", 20, finalY + 8);
        doc.text("Datos de transferencia", 80, finalY + 8);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text("• Transferencia Bancaria", 20, finalY + 16);
        doc.text("Enviar comprobante indicando", 20, finalY + 24);
        doc.text("el número de la cotización.", 20, finalY + 29);

        doc.text("Nombre: LORENA NOEMI CASTILLO", 80, finalY + 16);
        doc.text("RUT: 22.374.725-6", 80, finalY + 21);
        doc.text("Banco: Banco Estado", 80, finalY + 26);
        doc.text("Tipo: Cuenta Vista", 80, finalY + 31);
        doc.text("N° Cuenta: 36571047751", 80, finalY + 36);

        // Final bottom bar
        doc.setFillColor(magenta[0], magenta[1], magenta[2]);
        doc.rect(14, 280, 182, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("PASTELERIAHIJITOS.CL", 105, 286, { align: 'center' });

        // En lugar de descargarlo, retornamos el PDF en Base64
        return doc.output('datauristring');
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setIsGenerating(true);

        try {
            // 1. Generate PDF as Base64
            const base64Pdf = await generatePDF();

            // 2. Upload to Cloudflare R2
            const uploadRes = await uploadPdf(quoteId, base64Pdf);
            if (!uploadRes.success || !uploadRes.url) {
                throw new Error(uploadRes.error || "No se pudo obtener la URL pública del PDF.");
            }

            // 3. Save to DB (only ID, URL and total)
            const res = await saveQuote(quoteId, uploadRes.url, getTotal(), items);
            if (!res.success) {
                console.error("No se pudo guardar la cotización en DB:", res.error);
            }

            // 4. Send WhatsApp with URL instead of file
            const numeroWs = '56987421819';
            
            let mensaje = `Hola *Pastelería Hijitos*!%0A`;
            mensaje += `Tengo una cotización número *${quoteId}* generada en su sitio web.%0A%0A`;
            if (nombre) mensaje += `*Cliente:* ${nombre}%0A`;
            if (rut) mensaje += `*RUT:* ${rut}%0A`;
            mensaje += `*Documento:* ${tipoDocumento}%0A`;
            mensaje += `*Total cotizado:* $${getTotal().toLocaleString('es-CL')}%0A%0A`;
            mensaje += `📄 *Ver PDF:* ${uploadRes.url}`;

            const waLink = `https://wa.me/${numeroWs}?text=${mensaje}`;
            
            setGeneratedUrl(uploadRes.url);
            setWaLinkState(waLink);
            setIsSuccess(true);
            
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error inesperado al generar la cotización.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Cotizador de Eventos</h1>
                <p className="text-gray-500 mb-8">Tu carrito de cotización está vacío.</p>
                <div className="flex gap-4">
                    <Link href="/salados" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Ver Salados</Link>
                    <Link href="/dulces" className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">Ver Dulces</Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-green-200 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cotización Generada!</h2>
                    <p className="text-gray-600 mb-6">Tu cotización {quoteId} ha sido guardada temporalmente.</p>
                    <div className="flex flex-col gap-3">
                        <a href={waLinkState} target="_blank" rel="noreferrer" className="w-full px-6 py-3 bg-[#25D366] text-white rounded-md hover:bg-[#128C7E] transition font-bold flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                            Enviar por WhatsApp
                        </a>
                        <a href={generatedUrl} target="_blank" rel="noreferrer" download className="w-full px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition font-bold flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            Descargar PDF
                        </a>
                        <button onClick={() => { clearCart(); router.push('/'); }} className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 transition font-medium mt-2">
                            Hacer nueva cotización
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-serif text-gray-900 mb-2">Revisar Cotización</h1>
                <p className="text-gray-500 mb-8">Revisa los productos seleccionados y genera tu PDF.</p>

                <form onSubmit={handleGenerate}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <span className="font-mono text-sm text-gray-500 font-semibold bg-gray-200 px-3 py-1 rounded-full">{quoteId}</span>
                        <button onClick={clearCart} className="text-red-500 text-sm hover:underline">Vaciar Cotizador</button>
                    </div>
                    
                    <ul className="divide-y divide-gray-100">
                        {items.map(item => (
                            <li key={item.producto_id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                {item.imagen_url && <img src={item.imagen_url} alt={item.nombre} className="w-20 h-20 object-cover rounded-md" />}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-gray-900 text-lg">{item.nombre}</h3>
                                    <p className="text-gray-500 text-sm capitalize">{item.categoria}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-500 mb-2">Cantidad</p>
                                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-md p-1">
                                        <button 
                                            onClick={() => updateQuantity(item.producto_id, Math.max(item.cantidad_minima || 1, item.cantidad - (item.incremento || 1)))}
                                            disabled={item.cantidad <= (item.cantidad_minima || 1)}
                                            className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            min={item.cantidad_minima || 1}
                                            step={item.incremento || 1}
                                            value={item.cantidad}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val)) updateQuantity(item.producto_id, val);
                                            }}
                                            onBlur={(e) => {
                                                let val = parseInt(e.target.value);
                                                const min = item.cantidad_minima || 1;
                                                const step = item.incremento || 1;
                                                if (isNaN(val) || val < min) {
                                                    val = min;
                                                } else if (step > 1) {
                                                    val = Math.round(val / step) * step;
                                                    if (val < min) val = min;
                                                }
                                                updateQuantity(item.producto_id, val);
                                            }}
                                            className="w-12 text-center text-sm font-semibold bg-transparent border-none p-0 focus:ring-0"
                                        />
                                        <button 
                                            onClick={() => updateQuantity(item.producto_id, item.cantidad + (item.incremento || 1))}
                                            className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-sm text-gray-500">${item.precio_unitario.toLocaleString('es-CL')} c/u</p>
                                    <p className="font-bold text-gray-900 text-lg">${(item.precio_unitario * item.cantidad).toLocaleString('es-CL')}</p>
                                </div>
                                <button onClick={() => removeItem(item.producto_id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
                        <span className="text-gray-500">Total Cotización</span>
                        <span className="text-3xl font-bold text-gray-900">${getTotal().toLocaleString('es-CL')}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Datos del Cliente (Opcional)</h3>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                        <p className="text-sm text-yellow-800 font-medium">
                            <span className="font-bold">Aviso de Privacidad:</span> En cumplimiento con la Ley de Protección de Datos Personales de Chile, los datos ingresados en este formulario <span className="font-bold underline">NO serán guardados en nuestra base de datos</span>. Solo se utilizarán para imprimir tu archivo PDF de cotización, el cual estará disponible por un máximo de 7 días.
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">Estos datos aparecerán impresos en tu PDF.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="Boleta" checked={tipoDocumento === 'Boleta'} onChange={e => setTipoDocumento(e.target.value)} className="text-pink-600 focus:ring-pink-500" />
                                    <span>Boleta</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="Factura" checked={tipoDocumento === 'Factura'} onChange={e => setTipoDocumento(e.target.value)} className="text-pink-600 focus:ring-pink-500" />
                                    <span>Factura</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o Razón Social <span className="text-red-500">*</span></label>
                            <input required type="text" minLength={3} value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" placeholder="Ej. Juan Pérez / Empresa SpA" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">R.U.T. <span className="text-red-500">*</span></label>
                            <input required type="text" minLength={8} pattern="^[0-9\.\-]+[kK0-9]$" title="Ingresa un RUT válido" value={rut} onChange={e => setRut(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" placeholder="Ej. 12.345.678-9" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-red-500">*</span></label>
                            <input required type="tel" minLength={8} value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" placeholder="Ej. +56 9 1234 5678" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección <span className="text-red-500">*</span></label>
                            <input required type="text" minLength={4} value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" placeholder="Ej. Los Pinos 123" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad <span className="text-red-500">*</span></label>
                            <input required type="text" minLength={3} value={ciudad} onChange={e => setCiudad(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" placeholder="Ej. San Antonio" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/salados" className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium">Seguir Cotizando</Link>
                    <button 
                        type="submit"
                        disabled={isGenerating}
                        className="px-8 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition font-bold disabled:opacity-70 flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generando...
                            </>
                        ) : (
                            "Generar Cotización"
                        )}
                    </button>
                </div>
                </form>
            </div>
        </main>
    );
}
