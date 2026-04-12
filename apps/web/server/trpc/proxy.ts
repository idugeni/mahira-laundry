import { initTRPC, TRPCError } from "@trpc/server";
import { createClient } from "@/lib/supabase/server";

interface Context {
  userId: string | null;
  role: string | null;
}

export async function createContext(): Promise<Context> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    userId: user.id,
    role: profile?.role || "customer",
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware: require auth
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login diperlukan" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Middleware: require staff role
const isStaff = t.middleware(({ ctx, next }) => {
  if (
    !ctx.userId ||
    !["kasir", "kurir", "manager", "superadmin"].includes(ctx.role || "")
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
  }
  return next({ ctx });
});

export const staffProcedure = t.procedure.use(isStaff);

// Middleware: require manager role
const isManager = t.middleware(({ ctx, next }) => {
  if (!ctx.userId || !["manager", "superadmin"].includes(ctx.role || "")) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses manager diperlukan",
    });
  }
  return next({ ctx });
});

export const managerProcedure = t.procedure.use(isManager);

// Middleware: require superadmin role
const isSuperadmin = t.middleware(({ ctx, next }) => {
  if (!ctx.userId || ctx.role !== "superadmin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses superadmin diperlukan",
    });
  }
  return next({ ctx });
});

export const superadminProcedure = t.procedure.use(isSuperadmin);
