"use client";
import { X, Trash2, Send, Copy, MessageCircle, Plus, Minus } from 'lucide-react';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

export function RFQDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, clear, updateQuantity } = useQuoteStore();
  const locale = useLocale();

  const getMessageText = () => {
    const text = items.map(i => {
      const variantText = i.variant ? ` [${i.variant}]` : '';
      return `- ${locale === 'cn' ? i.name_cn : i.name_th}${variantText} (Qty: ${i.quantity})`;
    }).join('\n');
    return `ขอใบเสนอราคา / Request for Quote:\n${text}`;
  };

  const handleSendLine = () => {
    const message = encodeURIComponent(getMessageText());
    // Use Line URI scheme
    window.open(`https://line.me/R/msg/text/?${message}`, '_blank');
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText(getMessageText());
    toast.success(locale === 'cn' ? '报价单已复制！请粘贴到微信。' : 'คัดลอกรายการขอใบเสนอราคาแล้ว! คุณสามารถนำไปวางใน WeChat ได้เลย');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-[70] flex flex-col transform transition-transform duration-300">
        <div className="p-4 border-b flex justify-between items-center bg-brand-navy text-white">
          <h2 className="font-bold text-lg">{locale === 'cn' ? '报价单列表 (RFQ)' : 'รายการขอใบเสนอราคา'}</h2>
          <button onClick={onClose} className="p-1 hover:text-brand-yellow transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-10 font-medium">
              {locale === 'cn' ? '您的报价单是空的' : 'ยังไม่มีสินค้าในรายการขอใบเสนอราคา'}
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-slate-200 flex gap-3">
                {/* Product Image */}
                {item.image && (
                  <div className="w-16 h-16 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img src={item.image} alt={item.name_th} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                )}
                
                {/* Details & Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-brand-navy text-sm line-clamp-2">
                        {locale === 'cn' ? item.name_cn : item.name_th}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-brand-red font-medium mt-0.5">{item.variant}</p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 ml-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">{locale === 'cn' ? '数量' : 'จำนวน'}:</span>
                    <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                      <button 
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 hover:text-brand-navy transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-brand-navy">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 hover:text-brand-navy transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-white space-y-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <Button onClick={handleSendLine} className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold h-12 shadow-sm">
              <MessageCircle className="mr-2 h-5 w-5" />
              {locale === 'cn' ? '发送至 LINE' : 'ส่งใบเสนอราคาผ่าน LINE'}
            </Button>
            <Button onClick={handleCopyWeChat} className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white font-bold h-12 shadow-sm">
              <Copy className="mr-2 h-5 w-5" />
              {locale === 'cn' ? '复制并发送至 WeChat' : 'คัดลอกเพื่อส่งใน WeChat'}
            </Button>
            <Button variant="outline" onClick={clear} className="w-full text-slate-500 border-slate-200 font-bold hover:text-red-500 hover:border-red-200 hover:bg-red-50 h-12">
              {locale === 'cn' ? '清空列表' : 'ล้างรายการทั้งหมด'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
