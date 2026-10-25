/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin' },
      { source: '/wp-admin', destination: '/admin' },
      { source: '/wp-login.php', destination: '/admin' },
      { source: '/administrator', destination: '/admin' },
      { source: '/cpanel', destination: '/admin' },
      { source: '/backend', destination: '/admin' },
      { source: '/control', destination: '/admin' },
      { source: '/admin-panel', destination: '/admin' }
    ];
  },
};

export default nextConfig;
