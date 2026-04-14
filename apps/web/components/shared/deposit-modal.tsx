"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { topUpBalance } from "@/lib/actions/finance";
import { toast } from "sonner";
import { 
  HiOutlineCreditCard, 
  HiOutlineBanknotes, 
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineUser
} from "react-icons/hi2";
import { formatIDR } from "@/lib/utils";

interface DepositModalProps {
  customerId: string;
  customerName: string;
  currentBalance: number;
}

export function DepositModal({ customerId, customerName, currentBalance }: DepositModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Nominal harus lebih dari 0");
      return;
    }

    setIsLoading(true);
    const result = await topUpBalance(customerId, amount);

    if (result.success) {
      toast.success(`Saldo ${customerName} berhasil ditambah ${formatIDR(amount)}`);
      setIsOpen(false);
      setAmount(0);
    } else {
      toast.error(result.error || "Gagal top up saldo");
    }
    setIsLoading(false);
  }

  const quickAmounts = [50000, 100000, 250000, 500000];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100"
      >
        <HiOutlinePlusCircle size={14} />
        <span>Top Up Saldo</span>
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => !isLoading && setIsOpen(false)} 
          />
          
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in border border-white/20">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500">
                    <HiOutlineBanknotes size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Top Up <span className="text-emerald-600">Saldo</span></h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Laundry Card / Deposit</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <HiOutlineXMark size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <HiOutlineUser size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{customerName}</p>
                      <p className="text-xs font-bold text-slate-700">Saldo Saat Ini</p>
                   </div>
                </div>
                <p className="text-lg font-black text-slate-900">{formatIDR(currentBalance)}</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal Top Up</label>
                <div className="relative group/input">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">Rp</span>
                  <input 
                    type="number" 
                    value={amount || ""} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black outline-none ring-0 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="py-3 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                  >
                    + {formatIDR(val)}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || amount <= 0}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineCreditCard size={20} />
                    <span>Konfirmasi Top Up</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
