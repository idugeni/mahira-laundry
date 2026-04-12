"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";

const services = [
  { id: "1", name: "Cuci Lipat", price: 7000, unit: "kg", icon: "🧺" },
  { id: "2", name: "Cuci Setrika", price: 10000, unit: "kg", icon: "👔" },
  { id: "3", name: "Express", price: 15000, unit: "kg", icon: "⚡" },
  { id: "4", name: "Dry Cleaning", price: 25000, unit: "item", icon: "🧥" },
  { id: "5", name: "Cuci Sepatu", price: 35000, unit: "pasang", icon: "👟" },
  { id: "6", name: "Setrika Saja", price: 6000, unit: "kg", icon: "♨️" },
];

export default function POSPage() {
  const [cart, setCart] = useState<
    Array<{
      id: string;
      name: string;
      qty: number;
      price: number;
      unit: string;
    }>
  >([]);
  const [customerSearch, setCustomerSearch] = useState("");

  const addToCart = (service: (typeof services)[0]) => {
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

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Services */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <input
            type="text"
            placeholder="🔍 Cari pelanggan (nama/HP)..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
          />
        </div>
        <h2 className="font-semibold font-[family-name:var(--font-heading)]">
          Pilih Layanan
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => addToCart(service)}
              className="p-4 rounded-xl border border-border bg-white hover:border-brand-primary hover:shadow-md transition-all text-left"
            >
              <span className="text-2xl">{service.icon}</span>
              <div className="mt-2 font-medium text-sm">{service.name}</div>
              <div className="text-brand-primary font-bold text-sm">
                {formatIDR(service.price)}/{service.unit}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="bg-white rounded-xl border border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold font-[family-name:var(--font-heading)]">
            🧾 Struk
          </h3>
          <p className="text-xs text-muted-foreground">
            Mahira Laundry Salemba
          </p>
        </div>
        <div className="flex-1 p-4 overflow-auto space-y-2">
          {cart.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Belum ada item
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
              >
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.qty} {item.unit} × {formatIDR(item.price)}
                  </div>
                </div>
                <span className="font-bold text-sm">
                  {formatIDR(item.qty * item.price)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-brand-primary">{formatIDR(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              💵 Tunai
            </button>
            <button className="py-2.5 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary/90 transition-colors">
              📱 QRIS
            </button>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition-colors">
            🖨️ Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
}
