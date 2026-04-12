export const GOOGLE_MAPS_CONFIG = {
  center: {
    lat: Number(process.env.NEXT_PUBLIC_MAP_CENTER_LAT) || -6.2115,
    lng: Number(process.env.NEXT_PUBLIC_MAP_CENTER_LNG) || 106.8559,
  },
  zoom: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM) || 14,
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
};

export function getGoogleMapsEmbedUrl(lat: number, lng: number, zoom = 15) {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_CONFIG.apiKey}&q=${lat},${lng}&zoom=${zoom}`;
}

export function getDirectionsUrl(destLat: number, destLng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
