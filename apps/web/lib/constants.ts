export const APP_NAME = "Mahira Laundry";
export const APP_TAGLINE = "Cucian Bersih, Hidup Nyaman.";

export const PRIMARY_OUTLET = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  name: "Mahira Laundry Jatiwaringin",
  slug: "jatiwaringin",
  address:
    "Jl. Raya Jatiwaringin No. 12, Pondok Gede, Kota Bekasi, Jawa Barat 17411",
  phone: "0838-0651-8859",
  whatsapp: "6283806518859",
  whatsapp_clean: "6283806518859",
  email: "hello@mahiralaundry.id",
  lat: -6.273114,
  lng: 106.924298,
  operatingHours: {
    weekday: "07:00-21:00",
    weekend: "08:00-20:00",
  },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  picked_up: "Dijemput",
  washing: "Dicuci",
  ironing: "Disetrika",
  ready: "Siap",
  delivering: "Diantar",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  picked_up: "bg-indigo-100 text-indigo-800",
  washing: "bg-cyan-100 text-cyan-800",
  ironing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  delivering: "bg-orange-100 text-orange-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export const LOYALTY_TIERS = {
  bronze: {
    name: "Bronze",
    min: 0,
    pointsPerOrder: 10,
    color: "text-amber-700",
  },
  silver: {
    name: "Silver",
    min: 500,
    pointsPerOrder: 15,
    color: "text-slate-400",
  },
  gold: {
    name: "Gold",
    min: 2000,
    pointsPerOrder: 20,
    color: "text-yellow-500",
  },
  platinum: {
    name: "Platinum",
    min: 5000,
    pointsPerOrder: 30,
    color: "text-violet-500",
  },
};

export const DELIVERY_ZONES = {
  free: ["Jatiwaringin", "Jaticempaka", "Pondok Gede"],
  paid_5000: ["Gamprit", "Curug", "Pangkalan Jati"],
  paid_10000: ["Kalimalang", "Lubang Buaya", "Jatimakmur"],
};
