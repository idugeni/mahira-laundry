"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/orders";
import { searchCustomers } from "@/lib/actions/customers";
import { formatIDR } from "@/lib/utils";
import { Service, Profile } from "@/lib/types";

interface POSClientProps {
  initialServices: Service[];
  outletId: string;
}

export function POSClient({ initialServices, outletId }: POSClientProps) {
  const [cart, setCart] = useState<{
    id: string;
    name: string;
    qty: number;
    price: number;
    unit: string;
  }[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (customerSearch.length >= 3) {
        setIsSearching(true);
        const result = await searchCustomers(customerSearch);
        if (result.data) {
          setSearchResults(result.data);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customerSearch]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === service.id);
      if (existing)
        return prev.map((i) =>
          i.id === service.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [
        ...prev,
        {
          id: service.id,
          name: service.name,
          qty: 1,
          price: service.price,
          unit: service.unit,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("outlet_id", outletId);
      formData.append("pickup_address", "In-Store POS (Direct)");
      formData.append("delivery_address", "In-Store POS (Direct)");
      formData.append("delivery_type", "pickup");
      formData.append("notes", `POS Checkout — Method: ${paymentMethod}`);
      
      if (selectedCustomer) {
        formData.append("customer_id", selectedCustomer.id);
      }

      const orderItems = cart.map((item) => ({
        service_id: item.id,
        service_name: item.name,
        quantity: item.qty,
        unit: item.unit,
        unit_price: item.price,
        is_express: item.name.toLowerCase().includes("express"),
      }));

      formData.append("items", JSON.stringify(orderItems));

      const result = await createOrder(formData);

      if (result.success && result.data) {
        toast.success(`Berhasil! Order ID: ${result.data.id.split("-")[0]}`);
        setCart([]);
        setSelectedCustomer(null);
        setCustomerSearch("");
      } else {
        toast.error(result.error || "Gagal membuat order");
      }
    } catch (_error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Services */}
      <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="🔍 Cari pelanggan (Minimal 3 karakter)..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  if (selectedCustomer) setSelectedCustomer(null);
                }}
                className={`w-full px-4 py-3 rounded-xl border border-border text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all ${selectedCustomer ? 'bg-emerald-50 border-emerald-200 pr-10' : 'bg-white'}`}
              />
              {selectedCustomer && (
                <button 
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {isSearching && (
              <div className="w-5 h-5 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {!selectedCustomer && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-60 overflow-auto py-2">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setCustomerSearch(c.full_name);
                    setSearchResults([]);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{c.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.phone}</p>
                  </div>
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">Pilih</span>
                </button>
              ))}
            </div>
          )}
          
          {selectedCustomer && (
            <div className="mt-2 p-2 px-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
              <span className="text-emerald-600">👤</span>
              <p className="text-xs font-bold text-emerald-900">
                Customer terpilih: <span className="underline">{selectedCustomer.full_name}</span> ({selectedCustomer.phone})
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg font-[family-name:var(--font-heading)] text-slate-900">
            Layanan Tersedia
          </h2>
          <span className="text-xs font-medium text-slate-400">{initialServices.length} jenis layanan</span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-auto pb-4 custom-scrollbar">
          {initialServices.map((service) => (
            <button
              key={service.id}
              onClick={() => addToCart(service)}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-primary hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl mb-3 group-hover:bg-brand-primary/5 transition-colors">
                {service.icon || "🧺"}
              </div>
              <div className="font-bold text-slate-900 text-sm">{service.name}</div>
              <div className="text-brand-primary font-black text-sm mt-1">
                {formatIDR(service.price)}<span className="text-[10px] text-slate-400 font-bold ml-1">/{service.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">
                {service.description || "Tanpa deskripsi"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="bg-white rounded-3xl border border-slate-200 flex flex-col shadow-sm overflow-hidden border-t-4 border-t-brand-primary">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <span>🧾</span> Rangkuman Order
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-wider uppercase">CABANG: {outletId}</p>
        </div>
        
        <div className="flex-1 p-6 overflow-auto space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
              <span className="text-4xl mb-2">🧺</span>
              <p className="text-xs font-bold text-slate-500">Keranjang Kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group transition-all"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {item.qty}{item.unit} × {formatIDR(item.price)}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-black text-xs text-brand-primary">
                    {formatIDR(item.qty * item.price)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-6 h-6 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pembayaran</span>
            <span className="text-2xl font-black text-brand-primary">{formatIDR(total)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCheckout("tunai")}
              disabled={loading || cart.length === 0}
              className="py-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all disabled:opacity-50 flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-base">💵</span> Tunai
            </button>
            <button
              onClick={() => handleCheckout("qris")}
              disabled={loading || cart.length === 0}
              className="py-3.5 rounded-2xl bg-brand-primary text-white text-xs font-black hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex flex-col items-center gap-1 shadow-lg shadow-brand-primary/20"
            >
              <span className="text-base">📱</span> QRIS
            </button>
          </div>
          
          <div className="pt-2">
            {!selectedCustomer && (
              <div className="mb-2 p-2 bg-amber-50 rounded-lg border border-amber-100/50 text-center">
                <p className="text-[10px] font-bold text-amber-700 italic">⚠️ Memproses sebagai "Walk-in Guest"</p>
              </div>
            )}
            <button
              disabled={cart.length === 0}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-500/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all disabled:opacity-50"
            >
              🖨️ Cetak Struk Fisik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
