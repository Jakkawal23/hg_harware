"use client";
import React, { useState, useRef } from 'react';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

interface ProductProps {
  id: string;
  slug: string;
  name_th: string;
  name_cn: string;
  images?: string[];
  image?: string; // For backward compatibility
  specs: Record<string, any>;
  price_display?: { th: string; cn: string };
}

export function ProductCard({ id, slug, name_th, name_cn, images, image, specs, price_display }: ProductProps) {
  const addItem = useQuoteStore(state => state.addItem);
  const locale = useLocale();
  const name = locale === 'cn' ? name_cn : name_th;
  const price = price_display ? (locale === 'cn' ? price_display.cn : price_display.th) : null;
  
  // Use images array if available, otherwise fallback to single image
  const displayImages = images && images.length > 0 ? images : (image ? [image] : ['https://picsum.photos/seed/placeholder/800/800']);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (!scrollRef.current) return;
    const newIndex = Math.min(activeIndex + 1, displayImages.length - 1);
    scrollRef.current.scrollTo({
      left: newIndex * scrollRef.current.offsetWidth,
      behavior: 'smooth'
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (!scrollRef.current) return;
    const newIndex = Math.max(activeIndex - 1, 0);
    scrollRef.current.scrollTo({
      left: newIndex * scrollRef.current.offsetWidth,
      behavior: 'smooth'
    });
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name_th, name_cn, quantity: 1, image: displayImages[0] });
    toast.success(locale === 'cn' ? '已添加到报价单' : 'เพิ่มลงในรายการขอใบเสนอราคาแล้ว');
  };

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full flex flex-col overflow-hidden hover:border-brand-red">
        
        {/* Single Image */}
        <div className="relative aspect-square w-full bg-white overflow-hidden p-2 flex items-center justify-center border-b border-slate-100">
          <img 
            src={displayImages[0]} 
            alt={name} 
            className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 leading-tight mb-1 group-hover:text-brand-red transition-colors">
            {name}
          </h3>
          
          {price && (
            <p className="text-brand-red font-semibold text-sm md:text-base mb-2">
              {price}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3 mt-auto">
            {specs && Object.entries(specs).slice(0, 2).map(([key, value]) => (
              <Badge variant="secondary" key={key} className="text-[10px] bg-slate-100 text-slate-600 font-normal">
                {value}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={handleAdd}
            variant="outline" 
            size="sm"
            className="w-full border-slate-200 text-slate-700 hover:border-brand-red hover:text-brand-red hover:bg-red-50 transition-colors mt-auto font-medium"
          >
            <Plus className="h-4 w-4 mr-1" /> Add to Quote
          </Button>
        </div>
      </div>
    </Link>
  );
}
