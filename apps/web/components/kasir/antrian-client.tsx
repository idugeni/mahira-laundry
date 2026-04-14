"use client";

import { useOptimistic } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatIDR } from "@/lib/utils";
import { Order, OrderStatus } from "@/lib/types";

interface AntrianClientProps {
  initialOrders: Order[];
}

const columns = [
  { id: "pending", label: "Pending", color: "bg-yellow-500" },
  { id: "confirmed", label: "Konfirmasi", color: "bg-orange-500" },
  { id: "received", label: "Diterima", color: "bg-blue-500" },
  { id: "washing", label: "Cuci", color: "bg-cyan-500" },
  { id: "ironing", label: "Setrika", color: "bg-purple-500" },
  { id: "ready", label: "Siap", color: "bg-green-500" },
  { id: "completed", label: "Selesai", color: "bg-emerald-500" },
];

export function AntrianClient({ initialOrders }: AntrianClientProps) {
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    initialOrders,
    (state, { id, status }: { id: string; status: OrderStatus }) =>
      state.map((o) => (o.id === id ? { ...o, status } : o)),
  );

  const handleStatusChange = async (id: string, status: string) => {
    const newStatus = status as OrderStatus;
    addOptimisticOrder({ id, status: newStatus });
    const result = await updateOrderStatus(id, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status diperbarui");
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar">
      {columns.map((col) => {
        const orders = optimisticOrders.filter((o) => o.status === col.id);
        return (
          <div key={col.id} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <span className="font-black text-xs uppercase tracking-widest text-slate-600">
                  {col.label}
                </span>
              </div>
              <span className="text-xs font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                {orders.length}
              </span>
            </div>
            <div className="space-y-3 min-h-[500px] bg-slate-50/50 rounded-3xl p-3 border-2 border-dashed border-slate-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-black text-xs text-brand-primary uppercase tracking-wider">
                      #{order.id.split("-")[0]}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="text-[10px] bg-slate-50 border-none rounded-lg px-2 py-1 font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      {columns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm font-bold text-slate-800 line-clamp-2">
                    {order.order_items?.[0]?.service_name || "Layanan Unknown"}
                    {(order.order_items?.length ?? 0) > 1 &&
                      ` (+${(order.order_items?.length ?? 0) - 1})`}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    Pelanggan: {order.profiles?.full_name || "Guest"}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(order.total_amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(order.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center text-xs text-slate-300 font-bold py-20 uppercase tracking-widest">
                  Tidak ada antrian
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
