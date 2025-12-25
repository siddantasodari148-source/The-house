import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  // 1. Critical for offline: Use standard caching strategies
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  
  // 2. Workbox Configuration
  workboxOptions: {
    disableDevLogs: true,
    // This tells the plugin to bundle standard Next.js assets automatically.
    // We only add "runtimeCaching" for EXTERNAL things (Supabase, Fonts).
    runtimeCaching: [
      {
        // Cache Supabase Images (StaleWhileRevalidate is safer for images than CacheFirst)
        urlPattern: /^https:\/\/.*supabase\.co\/storage\/v1\/object\/public\/.*$/,
        handler: "StaleWhileRevalidate", 
        options: {
          cacheName: "menu-images",
          expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 Days
        },
      },
      {
        // Cache Menu Data (Supabase API)
        urlPattern: /^https:\/\/.*supabase\.co\/rest\/v1\/.*$/,
        handler: "NetworkFirst", // Try internet, fail to cache
        options: {
          cacheName: "supabase-data-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 }, // 7 Days
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        // Cache Offline Map
        urlPattern: /\/map-offline\.png$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 },
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