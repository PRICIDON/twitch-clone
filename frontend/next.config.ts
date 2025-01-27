import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";


const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'a78849ec-4ece-41ea-96e8-f46c3b613b8c.selstorage.ru'
			}
		]
	}
};

export default withNextIntl(nextConfig);
