import Image from 'next/image';
import Link from 'next/link';
import { getProducts, Product } from '@/data/products';
import { getDictionary } from '@/get-dictionary';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ShareButtons from '@/components/ShareButtons';
import ImageZoom from '@/components/ImageZoom';

interface ProductPageProps {
    params: Promise<{
        lang: 'en' | 'es';
        id: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { lang, id } = await params;
    const products = getProducts(lang);
    const product = products.find(p => p.id === id);

    if (!product) {
        return {
            title: '404 - Product Not Found',
        };
    }

    return {
        title: `${product.name} | Retro Archive`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { lang, id } = await params;
    const products = getProducts(lang);
    const product = products.find(p => p.id === id);
    const dict = await getDictionary(lang);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f4f0] text-black">
                <h1 className="text-4xl font-black font-mono">404 // PRODUCT NOT FOUND</h1>
            </div>
        );
    }

    const related = products.filter(p => p.id !== id).slice(0, 3);

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* Header */}
            <Header lang={lang} dict={dict} />

            {/* Breadcrumb / Back */}
            <div className="px-6 py-4 border-b border-black dark:border-white">
                <Link href={`/${lang}`} className="flex items-center gap-2 font-mono text-xs font-bold hover:underline w-fit">
                    <ArrowLeft size={16} /> {dict.product_detail.back}
                </Link>
            </div>

            {/* Product Detail */}
            <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12">
                {/* Image with Zoom */}
                <div className="flex-1 w-full">
                    <ImageZoom
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="bg-black dark:bg-white text-white dark:text-black font-mono text-xs px-2 py-1 uppercase">{product.category}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6">{product.name}</h1>


                    <p className="font-mono text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-md">
                        {product.description}
                    </p>

                    <ShareButtons
                        url={`https://retro-archive.vercel.app/${lang}/product/${product.id}`}
                        title={product.name}
                        description={product.description}
                    />

                    <a
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto text-center bg-accent text-white px-8 py-5 font-bold text-lg uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border-2 border-black dark:border-white transition-all shadow-[4px_4px_0px_#111111] dark:shadow-[4px_4px_0px_#f4f4f0] transform hover:-translate-y-1 mt-6 inline-block"
                    >
                        {dict.product_detail.buy_redbubble}
                    </a>
                </div>
            </section>

            {/* Related Grid */}
            <section className="max-w-7xl mx-auto px-6 pt-20 border-t border-black dark:border-white">
                <h3 className="text-3xl font-black mb-10 uppercase italic">{dict.product_detail.related}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {related.map(p => (
                        <Link key={p.id} href={`/${lang}/product/${p.id}`} className="block group border border-black dark:border-white bg-white dark:bg-[#111111]">
                            <div className="relative aspect-square border-b border-black dark:border-white overflow-hidden">
                                <Image src={p.image} alt={p.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold uppercase text-sm">{p.name}</h4>
                                <p className="font-mono text-xs text-gray-500">{p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <footer className="border-t border-black dark:border-white bg-white dark:bg-black py-12 px-6 mt-20">
                <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-2xl mb-4">RETRO<span className="text-accent">.ARCHIVE</span></h4>
                        <div className="flex justify-center md:justify-start gap-4 mb-4">
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Twitter} />
                        </div>
                        <p className="font-mono text-xs max-w-xs text-gray-500">
                            {dict.footer.description}
                        </p>
                    </div>
                    <div className="font-mono text-xs text-center md:text-right">
                        <p>© 2024</p>
                        <p>{dict.footer.rights}</p>
                        <p>DESIGNED BY LUCAS</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
