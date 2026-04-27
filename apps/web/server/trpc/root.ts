import { router } from "@/server/trpc/proxy";
import { analyticsRouter } from "@/server/trpc/routers/analytics";
import { deliveryRouter } from "@/server/trpc/routers/delivery";
import { inventoryRouter } from "@/server/trpc/routers/inventory";
import { loyaltyRouter } from "@/server/trpc/routers/loyalty";
import { notificationsRouter } from "@/server/trpc/routers/notifications";
import { ordersRouter } from "@/server/trpc/routers/orders";
import { paymentsRouter } from "@/server/trpc/routers/payments";
import { servicesRouter } from "@/server/trpc/routers/services";

export const appRouter = router({
	orders: ordersRouter,
	services: servicesRouter,
	payments: paymentsRouter,
	delivery: deliveryRouter,
	loyalty: loyaltyRouter,
	analytics: analyticsRouter,
	inventory: inventoryRouter,
	notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
