import { router } from "./proxy";
import { analyticsRouter } from "./routers/analytics";
import { deliveryRouter } from "./routers/delivery";
import { inventoryRouter } from "./routers/inventory";
import { loyaltyRouter } from "./routers/loyalty";
import { notificationsRouter } from "./routers/notifications";
import { ordersRouter } from "./routers/orders";
import { paymentsRouter } from "./routers/payments";
import { servicesRouter } from "./routers/services";

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
