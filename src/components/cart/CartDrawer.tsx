'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Send, 
  Check, 
  Copy, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    totalPrice, 
    totalCount 
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const shopZalo = process.env.NEXT_PUBLIC_SHOP_ZALO || '0900000000';
  const shopMessenger = process.env.NEXT_PUBLIC_SHOP_MESSENGER || 'dynieperfume';

  // Định dạng tin nhắn tóm tắt đơn hàng chuẩn đẹp
  const generateOrderSummary = () => {
    const itemsList = cart
      .map(
        (item) =>
          `- ${item.name} (${item.sizeLabel}) x${item.quantity} - ${(item.price * item.quantity).toLocaleString('vi-VN')}đ`
      )
      .join('\n');

    return `Chào Dynie Perfume, mình muốn đặt đơn:
${itemsList}
Tổng: ${totalPrice.toLocaleString('vi-VN')}đ
Người nhận: ${fullName.trim() || '(Chưa điền tên)'} - ${phone.trim() || '(Chưa điền SĐT)'}
Địa chỉ: ${address.trim() || '(Chưa điền địa chỉ)'}
Ghi chú: ${notes.trim() || 'Không có'}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleCheckoutZalo = async () => {
    if (cart.length === 0) return;
    if (!fullName.trim() || !phone.trim()) {
      showToast('Vui lòng điền Họ tên và Số điện thoại trước khi gửi nhé!');
      return;
    }

    const orderText = generateOrderSummary();
    try {
      await navigator.clipboard.writeText(orderText);
      showToast('Đã sao chép đơn! Hãy dán vào Zalo để shop chốt đơn ngay nhé ✨');
    } catch {
      showToast('Đang mở Zalo để gửi đơn...');
    }

    setTimeout(() => {
      window.open(`https://zalo.me/${shopZalo}`, '_blank');
    }, 400);
  };

  const handleCheckoutMessenger = async () => {
    if (cart.length === 0) return;
    if (!fullName.trim() || !phone.trim()) {
      showToast('Vui lòng điền Họ tên và Số điện thoại trước khi gửi nhé!');
      return;
    }

    const orderText = generateOrderSummary();
    try {
      await navigator.clipboard.writeText(orderText);
      showToast('Đã sao chép đơn! Hãy dán vào Messenger để shop chốt đơn ngay nhé ✨');
    } catch {
      showToast('Đang mở Messenger để gửi đơn...');
    }

    setTimeout(() => {
      window.open(`https://m.me/${shopMessenger}`, '_blank');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0B13] border-l border-white/10 shadow-2xl flex flex-col justify-between text-zinc-100">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-rose-300" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-wide text-white">Giỏ Hàng Dynie</h3>
                <p className="text-xs text-zinc-400 font-sans">{totalCount} món mùi hương tinh tuyển</p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/90 to-purple-950/90 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="leading-relaxed font-medium">{toastMessage}</div>
            </div>
          )}

          {/* Drawer Body (Items List & Customer Form) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">Giỏ hàng của bạn đang trống</p>
                  <p className="text-xs text-zinc-500">Hãy dạo quanh các bộ sưu tập và chọn những nốt hương yêu thích.</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
                >
                  Khám phá mùi hương ngay
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                    <span>Sản phẩm ({totalCount})</span>
                    <button
                      onClick={clearCart}
                      className="text-zinc-500 hover:text-rose-400 transition-colors text-[11px]"
                    >
                      Xóa tất cả
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3 items-center group hover:border-white/20 transition-colors"
                    >
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10">
                        {item.thumb_url && (
                          <Image
                            src={item.thumb_url}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold truncate">
                          {item.brand}
                        </div>
                        <h4 className="text-sm font-serif font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <div className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/25">
                          {item.sizeLabel}
                        </div>
                        <div className="text-xs font-semibold text-rose-400 font-mono">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end justify-between h-20 py-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 border border-white/10 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-zinc-400 hover:text-white p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-zinc-400 hover:text-white p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Information Form */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <span>Thông tin nhận hàng</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Họ và tên của bạn *"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Số điện thoại nhận hàng *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Địa chỉ giao hàng (Số nhà, đường, phường, quận...)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Ghi chú mùi hương / thời gian nhận..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout Buttons */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/60 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-zinc-400">Tổng thanh toán:</span>
                <span className="text-xl font-bold font-serif text-white">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="space-y-2">
                {/* Zalo Checkout Button */}
                <button
                  onClick={handleCheckoutZalo}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#164D1A] text-white shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Gửi Đơn Qua Zalo (Chốt nhanh)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>

                {/* Messenger Checkout Button */}
                <button
                  onClick={handleCheckoutMessenger}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#172D6B] text-white shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-sky-200" />
                  <span>Gửi Đơn Qua Messenger</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <p className="text-[11px] text-stone-300 text-center leading-relaxed">
                Đơn hàng sẽ được tự động sao chép vào bộ nhớ tạm để bạn chỉ cần dán vào khung chat là shop chốt ngay!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
