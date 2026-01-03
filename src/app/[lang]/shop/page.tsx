import { getDictionary } from '@/get-dictionary';
import { getProducts } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';
import Header from '@/components/Header';
import MobileTopNav from '@/components/mobile/MobileTopNav';

export default async function ShopPage({
    params,
    searchParams
}: {
    params: Promise<{ lang: 'en' | 'es' }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { lang } = await params;
    const resolvedSearchParams = await searchParams;
    const dict = await getDictionary(lang);
    let products = getProducts(lang);

    // Filter Logic
    const search = resolvedSearchParams.search as string | undefined;
    const category = resolvedSearchParams.category as string | undefined;

    if (search) {
        const query = search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.tags?.some(tag => tag.toLowerCase().includes(query)) ||
            p.description.toLowerCase().includes(query)
        );
    } else if (category) {
        products = products.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-24 dark:bg-[#111111] dark:text-[#f4f4f0]">
            <Header lang={lang} dict={dict} />
            <MobileTopNav lang={lang} dict={dict} />

            <div className="max-w-[90rem] mx-auto px-6 py-8">
                <h1 className="text-4xl font-black uppercase mb-8">
                    {search
                        ? (lang === 'es' ? `Resultados: ${search}` : `Results: ${search}`)
                        : (lang === 'es' ? 'Catálogo Completo' : 'Full Catalog')
                    }
                </h1>

                {products.length > 0 ? (
                    <ProductGrid
                        lang={lang}
                        dict={dict}
                        products={products}
                    />
                ) : (
                    <div className="text-center py-20 opacity-50 font-mono">
                        {lang === 'es' ? 'No se encontraron items.' : 'No items found.'}
                    </div>
                )}
            </div>
        </main>
    );
}
