"use client";
import { useQuoteStore } from '@/store/useQuoteStore';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLocale } from 'next-intl';

import { useState } from 'react';
import { toast } from 'sonner';

export function ProductDetailClient({ product }: { product: any }) {
  const locale = useLocale();
  const addItem = useQuoteStore(state => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Type assertions to ensure we access the correctly localized text
  const localizedName = locale === 'cn' ? product.name_cn : product.name_th;
  const shortDesc = locale === 'cn' ? (product.short_description as any)?.cn : (product.short_description as any)?.th;
  const fullDescHtml = locale === 'cn' ? (product.full_description_html as any)?.cn : (product.full_description_html as any)?.th;
  const priceDisplay = locale === 'cn' ? (product.pricing_tier?.price_display as any)?.cn : (product.pricing_tier?.price_display as any)?.th;

  const handleAdd = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error(locale === 'th' ? 'กรุณาเลือกตัวเลือกสินค้าก่อน' : '请先选择产品规格');
      return;
    }
    const cartId = selectedVariant ? `${product.id}_${selectedVariant}` : product.id;
    addItem({ 
      id: cartId, 
      name_th: product.name_th || localizedName, 
      name_cn: product.name_cn || localizedName, 
      quantity: 1,
      image: product.images[0],
      variant: selectedVariant || undefined
    });
    toast.success(locale === 'th' ? 'เพิ่มลงในรายการขอใบเสนอราคาแล้ว' : '已添加到报价单');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
      <Link href="/products" className="inline-flex items-center text-slate-500 hover:text-brand-red font-bold mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> {locale === 'cn' ? '返回产品目录' : 'กลับไปหน้ารวมสินค้า'}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          
          {/* Image Gallery */}
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="bg-brand-surface p-8 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              <img 
                src={product.images[0]} 
                alt={localizedName} 
                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm bg-white p-4"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50">
                {product.images.map((img: string, idx: number) => (
                  <button key={idx} className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden ${idx === 0 ? 'border-brand-red' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-white" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Pricing Content */}
          <div className="p-8 lg:p-12 flex flex-col bg-white">
            <Badge className="w-fit mb-4 bg-slate-100 text-brand-navy hover:bg-slate-200 uppercase tracking-wider text-[10px] font-bold border border-slate-200">
              {product.category_slug.replace('-', ' ')}
            </Badge>
            
            <h1 className="text-3xl font-extrabold text-brand-navy mb-4 leading-tight">
              {localizedName}
            </h1>
            
            <p className="text-slate-600 mb-6 font-medium">
              {shortDesc}
            </p>

            {/* Pricing Area */}
            <div className="bg-brand-surface border border-slate-200 rounded-xl p-6 mb-8">
              <div className="mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {locale === 'cn' ? '批发价 / Wholesale Price' : 'ราคาส่ง / Wholesale Price'}
                </span>
                <div className="text-3xl font-extrabold text-brand-red mt-1">
                  {priceDisplay || (locale === 'cn' ? '联系销售获取报价' : 'ติดต่อสอบถามราคา')}
                </div>
              </div>

              {product.pricing_tier?.type === 'tiered' && product.pricing_tier.tiers && (
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="font-bold text-brand-navy">{locale === 'cn' ? '数量' : 'ปริมาณสั่งซื้อ'}</TableHead>
                        <TableHead className="font-bold text-brand-navy text-right">{locale === 'cn' ? '单价' : 'ราคาต่อหน่วย'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.pricing_tier.tiers.map((tier: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium text-slate-700">{tier.min_qty}</TableCell>
                          <TableCell className="text-brand-red font-bold text-right">{tier.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="mt-4 text-xs text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-brand-yellow" />
                <p>
                  {locale === 'cn' 
                    ? '价格不含税和运费。最终批发价请联系销售人员确认。' 
                    : 'ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่มและค่าจัดส่ง โปรดยืนยันราคาส่งล่าสุดกับฝ่ายขายอีกครั้ง'}
                </p>
              </div>
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  {locale === 'cn' ? '选择规格' : 'เลือกตัวเลือกสินค้า'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: string) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-md border text-sm font-bold transition-all ${
                        selectedVariant === v 
                          ? 'border-brand-red bg-red-50 text-brand-red shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Area (Desktop) */}
            <div className="mt-auto hidden md:block space-y-3">
              <div className="flex items-center text-green-600 font-bold text-sm mb-4">
                <CheckCircle2 className="h-5 w-5 mr-2" /> 
                {locale === 'cn' ? '现货 - 泰国仓库发货' : 'สินค้าพร้อมส่ง - สต็อกไทย'}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold h-12 text-base shadow-sm">
                  <MessageCircle className="mr-2 h-5 w-5" /> Line OA
                </Button>
                <Button className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white font-bold h-12 text-base shadow-sm">
                  <MessageCircle className="mr-2 h-5 w-5" /> WeChat
                </Button>
              </div>
              <Button onClick={handleAdd} variant="outline" className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold h-12 text-base transition-colors">
                <Plus className="mr-2 h-5 w-5" /> {locale === 'cn' ? '加入报价单 (RFQ)' : 'เพิ่มลงในรายการขอใบเสนอราคา'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 w-1/3">
          <Button variant="outline" size="sm" className="h-full flex flex-col items-center justify-center border-slate-200 text-slate-600 p-1 text-[10px]">
             <MessageCircle className="h-4 w-4 mb-0.5" /> Line/WeChat
          </Button>
        </div>
        <Button onClick={handleAdd} className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold h-12 rounded-lg text-sm shadow-sm">
          <Plus className="mr-1 h-4 w-4" /> {locale === 'cn' ? '加入报价单 (RFQ)' : 'เพิ่มลงในรายการขอใบเสนอ'}
        </Button>
      </div>

      {/* Rich Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-brand-surface p-4">
          <h2 className="text-xl font-bold text-brand-navy">
             {locale === 'cn' ? '产品详情规格' : 'รายละเอียดและข้อมูลจำเพาะ'}
          </h2>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* HTML Description */}
            {fullDescHtml && (
              <div 
                className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
                dangerouslySetInnerHTML={{ __html: fullDescHtml }}
              />
            )}

            {/* Infographics */}
            {product.detail_infographic_images && product.detail_infographic_images.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-brand-navy">{locale === 'cn' ? '技术图纸 / 尺寸表' : 'รูปภาพข้อมูลเทคนิค'}</h3>
                {product.detail_infographic_images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Infographic" className="w-full rounded-lg border border-slate-200 shadow-sm" />
                ))}
              </div>
            )}
          </div>

          {/* Side Specifications Table */}
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden sticky top-24">
              <div className="bg-slate-100 p-4 border-b border-slate-200">
                <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '规格参数' : 'ข้อมูลทางเทคนิค'}</h3>
              </div>
              <Table>
                <TableBody>
                  {product.specs && Object.entries(product.specs).map(([key, value], idx) => (
                    <TableRow key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <TableCell className="font-semibold text-slate-700 py-3 w-1/3">{key}</TableCell>
                      <TableCell className="text-slate-600 py-3">{value as React.ReactNode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
