import Image from 'next/image';
import Link from 'next/link';
import { getProducts, Product } from '@/data/products';
import { getAffiliatesByTags } from '@/data/affiliates';
import { getDictionary } from '@/get-dictionary';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ShareButtons from '@/components/ShareButtons';
import ImageZoom from '@/components/ImageZoom';
import BuyButton from '@/components/BuyButton';
import { ProductSchema } from '@/components/SchemaScript';
import Footer from '@/components/Footer';

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

    // Intelligent related products
    const calculateRelevance = (candidate: Product, current: Product): number => {
        let score = 0;

        // Same category: +10 points
        if (candidate.category === current.category) score += 10;

        // Shared tags: +2 per shared tag
        const sharedTags = candidate.tags?.filter(t =>
            current.tags?.includes(t)
        )?.length || 0;
        score += sharedTags * 2;

        return score;
    };

    const related = products
        .filter(p => p.id !== id) // Exclude current product
        .map(p => ({
            ...p,
            relevance: calculateRelevance(p, product)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);

    // Get related affiliate products by matching tags
    const affiliateProducts = product.tags ? getAffiliatesByTags(product.tags) : [];

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* SEO Schema */}
            <ProductSchema
                name={product.name || product.name_en || product.name_es || 'Design'}
                description={product.description || product.description_en || product.description_es || 'Original anime design'}
                image={product.image}
                price={product.price || '$20'}
                url={product.buyUrl}
            />

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
                        <span className="bg-black dark:bg-white text-white dark:text-black font-mono text-xs px-2 py-1 uppercase">{product.category || 'PRODUCT'}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6">{product.name || product.name_en || product.name_es || 'Untitled Product'}</h1>


                    <p className="font-mono text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-md">
                        {product.description || product.description_en || product.description_es || 'No description available.'}
                    </p>

                    <ShareButtons
                        url={`/${lang}/product/${product.id}`}
                        title={product.name}
                        description={product.description}
                    />

                    <BuyButton
                        productId={product.id}
                        productName={product.name}
                        buyUrl={product.buyUrl}
                        platform="redbubble"
                        label={dict.product_detail.buy_redbubble}
                        className="w-full md:w-auto text-center bg-accent text-white px-8 py-5 font-bold text-lg uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border-2 border-black dark:border-white transition-all shadow-[4px_4px_0px_#111111] dark:shadow-[4px_4px_0px_#f4f4f0] transform hover:-translate-y-1 mt-6 inline-block"
                    />

                    {/* CRO: Security text and product variants */}
                    <div className="mt-4 space-y-2">
                        <p className="font-mono text-[10px] text-gray-500">
                            ✓ {lang === 'es' ? 'Envío seguro vía Redbubble.' : 'Secure fulfillment via Redbubble.'}
                        </p>
                        <p className="font-mono text-[11px] text-gray-600 dark:text-gray-400">
                            🎨 {lang === 'es' ? 'También en: Stickers • Hoodies • Tazas • Posters y +60 más' : 'Also on: Stickers • Hoodies • Mugs • Posters and 60+ more'}
                        </p>
                    </div>
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

            {/* Amazon Affiliate Products */}
            {affiliateProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 pt-16 border-t border-black/20 dark:border-white/20">
                    <h3 className="text-xl font-bold mb-6 uppercase flex items-center gap-2">
                        🛒 {lang === 'es' ? 'Productos Relacionados en Amazon' : 'Related Products on Amazon'}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 mb-6">
                        {lang === 'es'
                            ? 'Como Asociado de Amazon, gano por compras elegibles.'
                            : 'As an Amazon Associate, I earn from qualifying purchases.'}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {affiliateProducts.slice(0, 4).map(affiliate => (
                            <a
                                key={affiliate.id}
                                href={affiliate.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="group block border border-black/20 dark:border-white/20 bg-white dark:bg-[#111111] hover:border-black dark:hover:border-white transition-all hover:-translate-y-1 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_rgba(255,255,255,1)]"
                            >
                                <div className="relative aspect-square border-b border-black/20 dark:border-white/20 overflow-hidden">
                                    <Image
                                        src={affiliate.image}
                                        alt={lang === 'es' && affiliate.name_es ? affiliate.name_es : affiliate.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-xs uppercase line-clamp-2">
                                        {lang === 'es' && affiliate.name_es ? affiliate.name_es : affiliate.name}
                                    </h4>
                                    <p className="font-mono text-[10px] text-orange-600 dark:text-orange-400 mt-1">
                                        {affiliate.price} →
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            <Footer lang={lang} />
        </main>
    );
}
