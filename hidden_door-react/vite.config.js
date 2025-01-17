import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "sass:color";', // Sass Color 모듈을 자동으로 가져오기
        api: "modern" // Vite 6.x 이상에서 현대적인 API 사용
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@atoms": path.resolve(__dirname, "./src/atoms"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@axios": path.resolve(__dirname, "./src/axios"),
      "@routes": path.resolve(__dirname, "./src/routes")
    }
  }
});
