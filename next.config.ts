import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // 1. Cache Images (Existing)
        urlPattern: /^https:\/\/.*supabase\.co\/storage\/v1\/object\/public\/.*$/,
        handler: "CacheFirst",
        options: {
          cacheName: "menu-images",
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        // 2. NEW: Cache Database Responses (Menu Text)
        urlPattern: /^https:\/\/.*supabase\.co\/rest\/v1\/.*$/,
        handler: "NetworkFirst", // Try internet first, fall back to cache if offline
        options: {
          cacheName: "supabase-data-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 Days
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // 3. Cache Fonts (Existing)
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withPWA(nextConfig);