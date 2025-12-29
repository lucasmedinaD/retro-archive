import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-block mb-8 font-mono text-sm hover:underline"
                >
                    ← VOLVER
                </Link>

                <h1 className="text-5xl font-black mb-8 uppercase">Privacy Policy</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-6">

                    <p className="text-xs text-gray-500">Última actualización: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">1. Información que Recopilamos</h2>
                        <p>
                            En RETRO.ARCHIVE, nos tomamos en serio tu privacidad. Esta política describe qué información recopilamos y cómo la utilizamos.
                        </p>
                        <h3 className="text-lg font-bold mt-4 mb-2">1.1 Información que Proporcionas</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Email (si te suscribes al newsletter)</li>
                            <li>Información de navegación (cookies, analytics)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">2. Cómo Usamos tu Información</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Enviar actualizaciones del newsletter (solo si te suscribes)</li>
                            <li>Mejorar la experiencia del sitio web</li>
                            <li>Analizar el uso del sitio (Google Analytics)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">3. Cookies y Tecnologías Similares</h2>
                        <p>
                            Utilizamos cookies para recordar tus preferencias (modo oscuro, idioma, favoritos). Estas cookies se almacenan localmente en tu navegador y no contienen información personal identificable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">4. Compartir Información</h2>
                        <p>
                            No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cuando sea requerido por ley</li>
                            <li>Con servicios de analytics (Google Analytics) para mejorar el sitio</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">5. Tus Derechos</h2>
                        <p>Tienes derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Solicitar una copia de tu información</li>
                            <li>Solicitar la eliminación de tu información</li>
                            <li>Desuscribirte del newsletter en cualquier momento</li>
                            <li>Deshabilitar cookies en tu navegador</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">6. Enlaces de Afiliados</h2>
                        <p>
                            Este sitio contiene enlaces de afiliados a productos en Redbubble. Cuando haces clic en estos enlaces y realizas una compra, podemos recibir una pequeña comisión sin costo adicional para ti.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">7. Seguridad</h2>
                        <p>
                            Implementamos medidas de seguridad razonables para proteger tu información. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">8. Cambios a esta Política</h2>
                        <p>
                            Podemos actualizar esta política ocasionalmente. Te notificaremos de cualquier cambio significativo publicando la nueva política en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">9. Contacto</h2>
                        <p>
                            Si tienes preguntas sobre esta política de privacidad, contáctanos en:
                        </p>
                        <p className="font-bold">Instagram: @lucasmedinad</p>
                    </section>

                </div>
            </div>
        </main>
    );
}
