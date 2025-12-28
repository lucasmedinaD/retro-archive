import { getProducts, Product } from '@/data/products';
import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import FavoritesClient from './FavoritesClient';

interface FavoritesPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const allProducts = getProducts(lang);

    return <FavoritesClient lang={lang} dict={dict} allProducts={allProducts} />;
}
