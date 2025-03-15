// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "crypto": path.resolve(__dirname, 'node_modules/crypto-browserify'),
      "stream": path.resolve(__dirname, 'node_modules/stream-browserify'),
      "http": path.resolve(__dirname, 'node_modules/stream-http'),
      "https": path.resolve(__dirname, 'node_modules/https-browserify'),
      "os": path.resolve(__dirname, 'node_modules/os-browserify/browser')
    }
    return config
  },
  
}

export default nextConfig