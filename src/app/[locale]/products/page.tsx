import { setRequestLocale } from 'next-intl/server';
import { ProductsCatalogClient } from './ProductsCatalogClient';
import { getAllProducts } from '@/lib/products';
import categoriesData from '@/data/categories.json';

export default async function ProductsCatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = getAllProducts();

  return <ProductsCatalogClient products={products} categories={categoriesData} />;
}
