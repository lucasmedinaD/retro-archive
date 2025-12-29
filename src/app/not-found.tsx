import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white p-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-[12rem] md:text-[16rem] font-black leading-none">404</h1>
                    <div className="h-1 bg-black dark:bg-white w-full mb-4" />
                    <p className="text-2xl md:text-3xl font-mono uppercase tracking-wider">
                        SIGNAL NOT FOUND
                    </p>
                </div>

                <p className="text-sm md:text-base font-mono text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
                    La página que buscas no existe en nuestro archivo. Puede haber sido movida o eliminada.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold uppercase text-sm tracking-widest border-2 border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all"
                    >
                        ← VOLVER AL INICIO
                    </Link>
                    <Link
                        href="/en"
                        className="inline-block bg-transparent text-black dark:text-white px-8 py-4 font-bold uppercase text-sm tracking-widest border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        VER CATÁLOGO
                    </Link>
                </div>
            </div>
        </div>
    );
}
