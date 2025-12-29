import Link from 'next/link';

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-block mb-8 font-mono text-sm hover:underline"
                >
                    ← VOLVER
                </Link>

                <h1 className="text-5xl font-black mb-8 uppercase">Terms of Service</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-6">

                    <p className="text-xs text-gray-500">Última actualización: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceptación de Términos</h2>
                        <p>
                            Al acceder y usar RETRO.ARCHIVE, aceptas estos términos de servicio. Si no estás de acuerdo, por favor no uses el sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">2. Descripción del Servicio</h2>
                        <p>
                            RETRO.ARCHIVE es una plataforma de showcase que presenta productos de merchandise anime con diseños minimalistas. Los productos se venden a través de terceros (principalmente Redbubble).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">3. Enlaces de Afiliados</h2>
                        <p>
                            Este sitio contiene enlaces de afiliados. Cuando haces clic en "VER DETALLES" o "COMPRAR", serás redirigido a la tienda del vendedor (Redbubble). RETRO.ARCHIVE puede recibir una comisión por compras realizadas a través de estos enlaces.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">4. Sin Garantías de Productos</h2>
                        <p>
                            RETRO.ARCHIVE no fabrica ni vende productos directamente. Todos los productos son vendidos por terceros. No garantizamos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Disponibilidad de productos</li>
                            <li>Exactitud de precios</li>
                            <li>Calidad de productos</li>
                            <li>Tiempos de envío</li>
                        </ul>
                        <p className="mt-4">
                            Todas las transacciones y disputas deben resolverse directamente con el vendedor (Redbubble).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">5. Propiedad Intelectual</h2>
                        <p>
                            El diseño, código y contenido original de RETRO.ARCHIVE están protegidos por derechos de autor. Los diseños de productos exhibidos pertenecen a sus respectivos creadores.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">6. Uso Aceptable</h2>
                        <p>No puedes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Usar el sitio para fines ilegales</li>
                            <li>Intentar hackear o comprometer la seguridad</li>
                            <li>Copiar o distribuir el contenido sin permiso</li>
                            <li>Usar bots o scraping automatizado</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitación de Responsabilidad</h2>
                        <p>
                            RETRO.ARCHIVE se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Pérdidas o daños derivados del uso del sitio</li>
                            <li>Problemas con productos comprados a través de enlaces de afiliados</li>
                            <li>Interrupciones del servicio o errores técnicos</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">8. Modificaciones</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mt-8 mb-4">9. Contacto</h2>
                        <p>
                            Para preguntas sobre estos términos:
                        </p>
                        <p className="font-bold">Instagram: @lucasmedinad</p>
                    </section>

                </div>
            </div>
        </main>
    );
}
