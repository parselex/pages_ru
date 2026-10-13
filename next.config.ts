import type { NextConfig } from "next";

/**
 * Два режима сборки:
 *  - обычная (output: "standalone") — серверный деплой (node-ru / VPS);
 *  - статический экспорт (STATIC_EXPORT=1) — GitHub Pages, проектный URL
 *    https://parselex.github.io/pages_ru/ → нужен basePath "/pages_ru".
 *
 * В статическом режиме API-роуты (src/app/api) исключаются из сборки
 * (удаляются на этапе CI), клиентские компоненты деградируют через
 * NEXT_PUBLIC_STATIC_EXPORT=1.
 */
const IS_STATIC = process.env.STATIC_EXPORT === "1";
const PAGES_BASE_PATH = "/pages_ru";

const nextConfig: NextConfig = {
  ...(IS_STATIC
    ? {
        output: "export" as const,
        basePath: PAGES_BASE_PATH,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
