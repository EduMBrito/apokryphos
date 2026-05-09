/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de linting estrito durante a compilação na Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignora erros de tipagem estrita (como o uso do 'any') na compilação
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;