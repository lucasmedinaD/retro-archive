import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';

interface PrivacyPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function PrivacyPolicy({ params }: PrivacyPageProps) {
    const { lang } = await params;
    const isEs = lang === 'es';

    const content = {
        back: isEs ? '← VOLVER' : '← BACK',
        title: isEs ? 'Política de Privacidad' : 'Privacy Policy',
        lastUpdated: isEs ? 'Última actualización' : 'Last updated',
        sections: isEs ? [
            {
                title: '1. Información que Recopilamos',
                content: 'En RETRO.ARCHIVE, nos tomamos en serio tu privacidad. Esta política describe qué información recopilamos y cómo la utilizamos.',
                list: ['Email (si te suscribes al newsletter)', 'Información de navegación (cookies, analytics)']
            },
            {
                title: '2. Cómo Usamos tu Información',
                content: '',
                list: ['Enviar actualizaciones del newsletter (solo si te suscribes)', 'Mejorar la experiencia del sitio web', 'Analizar el uso del sitio (Google Analytics)']
            },
            {
                title: '3. Cookies y Tecnologías Similares',
                content: 'Utilizamos cookies para recordar tus preferencias (modo oscuro, idioma, favoritos). Estas cookies se almacenan localmente en tu navegador y no contienen información personal identificable.',
                list: []
            },
            {
                title: '4. Compartir Información',
                content: 'No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:',
                list: ['Cuando sea requerido por ley', 'Con servicios de analytics (Google Analytics) para mejorar el sitio']
            },
            {
                title: '5. Tus Derechos',
                content: 'Tienes derecho a:',
                list: ['Solicitar una copia de tu información', 'Solicitar la eliminación de tu información', 'Desuscribirte del newsletter en cualquier momento', 'Deshabilitar cookies en tu navegador']
            },
            {
                title: '6. Enlaces de Afiliados',
                content: 'Este sitio contiene enlaces de afiliados a productos en Redbubble. Cuando haces clic en estos enlaces y realizas una compra, podemos recibir una pequeña comisión sin costo adicional para ti.',
                list: []
            },
            {
                title: '7. Seguridad',
                content: 'Implementamos medidas de seguridad razonables para proteger tu información. Sin embargo, ningún método de transmisión por Internet es 100% seguro.',
                list: []
            },
            {
                title: '8. Cambios a esta Política',
                content: 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cualquier cambio significativo publicando la nueva política en esta página.',
                list: []
            },
            {
                title: '9. Contacto',
                content: 'Si tienes preguntas sobre esta política de privacidad, contáctanos:',
                list: []
            }
        ] : [
            {
                title: '1. Information We Collect',
                content: 'At RETRO.ARCHIVE, we take your privacy seriously. This policy describes what information we collect and how we use it.',
                list: ['Email (if you subscribe to the newsletter)', 'Browsing information (cookies, analytics)']
            },
            {
                title: '2. How We Use Your Information',
                content: '',
                list: ['Send newsletter updates (only if you subscribe)', 'Improve website experience', 'Analyze site usage (Google Analytics)']
            },
            {
                title: '3. Cookies and Similar Technologies',
                content: 'We use cookies to remember your preferences (dark mode, language, favorites). These cookies are stored locally in your browser and do not contain personally identifiable information.',
                list: []
            },
            {
                title: '4. Sharing Information',
                content: 'We do not sell, rent, or share your personal information with third parties, except:',
                list: ['When required by law', 'With analytics services (Google Analytics) to improve the site']
            },
            {
                title: '5. Your Rights',
                content: 'You have the right to:',
                list: ['Request a copy of your information', 'Request deletion of your information', 'Unsubscribe from the newsletter at any time', 'Disable cookies in your browser']
            },
            {
                title: '6. Affiliate Links',
                content: 'This site contains affiliate links to products on Redbubble. When you click these links and make a purchase, we may receive a small commission at no additional cost to you.',
                list: []
            },
            {
                title: '7. Security',
                content: 'We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.',
                list: []
            },
            {
                title: '8. Changes to This Policy',
                content: 'We may update this policy occasionally. We will notify you of any significant changes by posting the new policy on this page.',
                list: []
            },
            {
                title: '9. Contact',
                content: 'If you have questions about this privacy policy, contact us:',
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
