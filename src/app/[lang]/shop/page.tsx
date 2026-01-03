import { getDictionary } from '@/get-dictionary';
import { getProducts } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';
import Header from '@/components/Header';
import MobileTopNav from '@/components/mobile/MobileTopNav';

export default async function ShopPage({
    params
}: {
    params: Promise<{ lang: 'en' | 'es' }>
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const products = getProducts(lang);

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-24 dark:bg-[#111111] dark:text-[#f4f4f0]">
            <Header lang={lang} dict={dict} />
            <MobileTopNav lang={lang} dict={dict} />

            <div className="max-w-[90rem] mx-auto px-6 py-8">
                <h1 className="text-4xl font-black uppercase mb-8">
                    {lang === 'es' ? 'Catálogo Completo' : 'Full Catalog'}
                </h1>

                <ProductGrid
                    lang={lang}
                    dict={dict}
                    products={products}
                />
            </div>
        </main>
    );
}
