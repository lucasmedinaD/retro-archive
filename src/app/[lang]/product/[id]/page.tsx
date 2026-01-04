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
import ScarcityLabel from '@/components/ScarcityLabel';
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

            {/* Product Detail - Matching TransformationDetail Layout */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Image Section (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="border-2 border-black dark:border-white bg-white dark:bg-[#111] overflow-hidden">
                        <ImageZoom
                            src={product.image}
                            alt={product.name}
                        />
                    </div>
                </div>

                {/* Sidebar Info (1/3 width) */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <p className="font-mono text-xs text-accent mb-1 tracking-widest">
                            REF-{product.id.slice(-6).toUpperCase()}
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] mb-4 tracking-tighter">
                            {product.name || product.name_en || product.name_es || 'Untitled Product'}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-black dark:bg-white text-white dark:text-black font-mono text-xs px-2 py-1 uppercase font-bold">
                            {product.category || 'PRODUCT'}
                        </span>
                        {product.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="border border-black/20 dark:border-white/20 text-gray-500 font-mono text-xs px-2 py-1 uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="border-l-2 border-black dark:border-white pl-4 mb-6">
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description || product.description_en || product.description_es || 'No description available.'}
                        </p>
                    </div>

                    <div className="mt-auto space-y-6">
                        {/* Price / Stats Box */}
                        <div className="border-2 border-black dark:border-white p-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-mono uppercase text-gray-500 mb-1">
                                        {lang === 'es' ? 'Precio Estimado' : 'Estimated Price'}
                                    </p>
                                    <p className="text-3xl font-black">
                                        {product.price || '$20.00'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <ScarcityLabel productId={product.id} showProbability={1} />
                                </div>
                            </div>
                        </div>

                        <BuyButton
                            productId={product.id}
                            productName={product.name}
                            buyUrl={product.buyUrl}
                            platform="redbubble"
                            label={dict.product_detail.buy_redbubble}
                            className="w-full text-center bg-[#ff4444] text-white px-8 py-4 font-black text-xl uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border-2 border-black dark:border-white transition-all shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#fff] transform hover:-translate-y-1"
                        />

                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase">
                            <span>✓ Secure Fulfillment</span>
                            <span>✓ Global Shipping</span>
                        </div>

                        <ShareButtons
                            url={`/${lang}/product/${product.id}`}
                            title={product.name}
                            description={product.description}
                        />
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
                                <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
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
