"use client";
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'all';
  const defaultSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const locale = useLocale();

  // Filter logic
  const filteredProducts = productsData.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category_slug === activeCategory;
    const matchesSearch = 
      product.name_th.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.name_cn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-4 md:space-y-8">
        <div>
          <h3 className="font-bold text-slate-900 mb-2 md:mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" /> {locale === 'cn' ? '分类' : 'หมวดหมู่สินค้า'}
          </h3>
          <ul className="flex flex-row overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0 hide-scrollbar snap-x">
            <li className="snap-start flex-shrink-0">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:px-3 rounded-full md:rounded-md transition-colors text-sm font-medium border ${activeCategory === 'all' ? 'bg-brand-red text-white border-brand-red shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-brand-navy'}`}
              >
                {locale === 'cn' ? '全部商品' : 'ทั้งหมด'}
              </button>
            </li>
            {categoriesData.map(cat => {
              const catName = locale === 'cn' ? cat.name_cn : cat.name_th;
              return (
                <li key={cat.id} className="snap-start flex-shrink-0">
                  <button 
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`whitespace-nowrap md:w-full text-left px-4 py-2 md:px-3 rounded-full md:rounded-md transition-colors text-sm font-medium border ${activeCategory === cat.slug ? 'bg-brand-red text-white border-brand-red shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-brand-navy'}`}
                  >
                    {catName}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {activeCategory === 'all' ? 'All Products' : categoriesData.find(c => c.slug === activeCategory)?.name_th}
            <Badge variant="secondary" className="ml-3 bg-slate-200 text-slate-700">{filteredProducts.length} items</Badge>
          </h1>
          
          <div className="relative w-full sm:w-72">
            <Input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-300 focus-visible:ring-amber-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-lg">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name_th={product.name_th}
                name_cn={product.name_cn}
                image={product.images[0]}
                specs={product.specs}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
