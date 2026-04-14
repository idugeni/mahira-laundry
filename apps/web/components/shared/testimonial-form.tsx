"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineChatBubbleLeftRight, HiStar } from "react-icons/hi2";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "@/lib/actions/testimonial";

const formSchema = z.object({
  content: z.string().min(10, {
    message: "Testimoni terlalu singkat, minimal 10 karakter ya Sultan.",
  }),
  rating: z.number().min(1).max(5),
});

export function TestimonialForm() {
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const formData = new FormData();
    formData.append("content", values.content);
    formData.append("rating", values.rating.toString());

    try {
      const result = await submitTestimonial(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          "Testimoni berhasil dikirim! Akan muncul setelah disetujui admin.",
        );
        form.reset();
      }
    } catch (_err) {
      toast.error("Gagal mengirim testimoni.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xl">
          <HiOutlineChatBubbleLeftRight />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">
            Berikan Testimoni
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            Bagikan pengalaman Anda menggunakan jasa Mahira.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Rating Anda
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-3xl transition-all hover:scale-125 pointer-events-auto"
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <span
                          className={
                            star <= (hover || field.value)
                              ? "text-amber-400"
                              : "text-slate-100"
                          }
                        >
                          <HiStar size={32} />
                        </span>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-400">
                  Komentar / Ulasan
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tuliskan pengalaman Anda di sini..."
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50/50 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/5 font-bold text-slate-900 transition-all resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-bold px-2 !mt-2" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-brand-primary transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Testimoni"}
          </button>
        </form>
      </Form>
    </div>
  );
}
