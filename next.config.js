/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: {
    'Content-Type': 'application/json',
     Accept: 'application/json'
}
}

module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://cyan-misty-rabbit.cyclic.app/api/user/register'
  }
}

module.exports = nextConfig