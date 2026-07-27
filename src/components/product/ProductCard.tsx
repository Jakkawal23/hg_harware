"use client";
import Image from 'next/image';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

interface ProductProps {
  id: string;
  slug: string;
  name_th: string;
  name_cn: string;
  image: string;
  specs: Record<string, any>;
}

export function ProductCard({ id, slug, name_th, name_cn, image, specs }: ProductProps) {
  const addItem = useQuoteStore(state => state.addItem);
  const locale = useLocale();
  const name = locale === 'cn' ? name_cn : name_th;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name_th, name_cn, quantity: 1, image });
    toast.success(locale === 'cn' ? '已添加到报价单' : 'เพิ่มลงในรายการขอใบเสนอราคาแล้ว');
  };

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full flex flex-col overflow-hidden hover:border-amber-400">
        <div className="relative aspect-square w-full bg-white overflow-hidden p-2 flex items-center justify-center border-b border-slate-100">
          {/* using standard img for mock prototype to avoid next/image hostname config issues */}
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
            {name}
          </h3>
          
          <div className="flex flex-wrap gap-1 mb-4 mt-auto">
            {Object.entries(specs).slice(0, 2).map(([key, value]) => (
              <Badge variant="secondary" key={key} className="text-[10px] bg-slate-100 text-slate-600 hover:bg-slate-200 font-normal">
                {value}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={handleAdd}
            variant="outline" 
            className="w-full border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-colors mt-auto font-medium"
          >
            <Plus className="h-4 w-4 mr-1" /> Add to Quote
          </Button>
        </div>
      </div>
    </Link>
  );
}
