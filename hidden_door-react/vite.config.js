import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:color";',
          api: "modern"
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
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@validation": path.resolve(__dirname, "./src/validation"),
        "@token": path.resolve(__dirname, "./src/token")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1")
        }
      }
    }
  };
});
