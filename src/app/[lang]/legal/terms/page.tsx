import Link from 'next/link';

interface TermsPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function TermsOfService({ params }: TermsPageProps) {
    const { lang } = await params;
    const isEs = lang === 'es';

    const content = {
        back: isEs ? '← VOLVER' : '← BACK',
        title: isEs ? 'Términos de Servicio' : 'Terms of Service',
        lastUpdated: isEs ? 'Última actualización' : 'Last updated',
        sections: isEs ? [
            {
                title: '1. Aceptación de Términos',
                content: 'Al acceder y usar RETRO.ARCHIVE, aceptas estos términos de servicio. Si no estás de acuerdo, por favor no uses el sitio.',
                list: []
            },
            {
                title: '2. Descripción del Servicio',
                content: 'RETRO.ARCHIVE es una plataforma de showcase que presenta productos de merchandise anime con diseños minimalistas. Los productos se venden a través de terceros (principalmente Redbubble).',
                list: []
            },
            {
                title: '3. Enlaces de Afiliados',
                content: 'Este sitio contiene enlaces de afiliados. Cuando haces clic en "VER DETALLES" o "COMPRAR", serás redirigido a la tienda del vendedor (Redbubble). RETRO.ARCHIVE puede recibir una comisión por compras realizadas a través de estos enlaces.',
                list: []
            },
            {
                title: '4. Sin Garantías de Productos',
                content: 'RETRO.ARCHIVE no fabrica ni vende productos directamente. Todos los productos son vendidos por terceros. No garantizamos:',
                list: ['Disponibilidad de productos', 'Exactitud de precios', 'Calidad de productos', 'Tiempos de envío']
            },
            {
                title: '5. Propiedad Intelectual',
                content: 'El diseño, código y contenido original de RETRO.ARCHIVE están protegidos por derechos de autor. Los diseños de productos exhibidos pertenecen a sus respectivos creadores.',
                list: []
            },
            {
                title: '6. Uso Aceptable',
                content: 'No puedes:',
                list: ['Usar el sitio para fines ilegales', 'Intentar hackear o comprometer la seguridad', 'Copiar o distribuir el contenido sin permiso', 'Usar bots o scraping automatizado']
            },
            {
                title: '7. Limitación de Responsabilidad',
                content: 'RETRO.ARCHIVE se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables de:',
                list: ['Pérdidas o daños derivados del uso del sitio', 'Problemas con productos comprados a través de enlaces de afiliados', 'Interrupciones del servicio o errores técnicos']
            },
            {
                title: '8. Modificaciones',
                content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en esta página.',
                list: []
            },
            {
                title: '9. Contacto',
                content: 'Para preguntas sobre estos términos:',
                list: []
            }
        ] : [
            {
                title: '1. Acceptance of Terms',
                content: 'By accessing and using RETRO.ARCHIVE, you accept these terms of service. If you do not agree, please do not use the site.',
                list: []
            },
            {
                title: '2. Service Description',
                content: 'RETRO.ARCHIVE is a showcase platform featuring anime merchandise products with minimalist designs. Products are sold through third parties (mainly Redbubble).',
                list: []
            },
            {
                title: '3. Affiliate Links',
                content: 'This site contains affiliate links. When you click "VIEW DETAILS" or "BUY", you will be redirected to the seller\'s store (Redbubble). RETRO.ARCHIVE may receive a commission for purchases made through these links.',
                list: []
            },
            {
                title: '4. No Product Warranties',
                content: 'RETRO.ARCHIVE does not manufacture or sell products directly. All products are sold by third parties. We do not guarantee:',
                list: ['Product availability', 'Price accuracy', 'Product quality', 'Shipping times']
            },
            {
                title: '5. Intellectual Property',
                content: 'The design, code, and original content of RETRO.ARCHIVE are protected by copyright. Product designs displayed belong to their respective creators.',
                list: []
            },
            {
                title: '6. Acceptable Use',
                content: 'You may not:',
                list: ['Use the site for illegal purposes', 'Attempt to hack or compromise security', 'Copy or distribute content without permission', 'Use bots or automated scraping']
            },
            {
                title: '7. Limitation of Liability',
                content: 'RETRO.ARCHIVE is provided "as is" without warranties of any kind. We are not responsible for:',
                list: ['Losses or damages arising from site use', 'Problems with products purchased through affiliate links', 'Service interruptions or technical errors']
            },
            {
                title: '8. Modifications',
                content: 'We reserve the right to modify these terms at any time. Changes will take effect upon posting on this page.',
                list: []
            },
            {
                title: '9. Contact',
                content: 'For questions about these terms:',
                list: []
            }
        ]
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href={`/${lang}`}
                    className="inline-block mb-8 font-mono text-sm hover:underline"
                >
                    {content.back}
                </Link>

                <h1 className="text-5xl font-black mb-8 uppercase">{content.title}</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-6">

                    <p className="text-xs text-gray-500">{content.lastUpdated}: {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}</p>

                    {content.sections.map((section, i) => (
                        <section key={i}>
                            <h2 className="text-2xl font-bold mt-8 mb-4">{section.title}</h2>
                            {section.content && <p>{section.content}</p>}
                            {section.list.length > 0 && (
                                <ul className="list-disc pl-6 space-y-2">
                                    {section.list.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {i === content.sections.length - 1 && (
                                <p className="font-bold mt-4">
                                    Email: <a href="mailto:theproject2.5d@gmail.com" className="text-accent hover:underline">theproject2.5d@gmail.com</a>
                                </p>
                            )}
                        </section>
                    ))}

                </div>
            </div>
        </main>
    );
}
