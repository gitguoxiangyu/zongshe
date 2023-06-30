import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@pages": resolve(__dirname, "src", "pages"),
      "@components": resolve(__dirname, "src", "components"),
      "@stores": resolve(__dirname, "src", "stores"),
      "@services": resolve(__dirname, "src", "services"),
      "@utils": resolve(__dirname, "src", "utils"),
    },
  },
  server: {
    port: 3000, //端口
    // 配置代理后，请求要往本地地址和端口发送，不然代理可能失效
    proxy: {
      "/api": {
        target: "http://1.15.179.24:9520",
        // target: 'http://127.0.0.1:9007',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/api/, "");
        },
      },
      "/weixin": {
        target: "http://1.15.179.24:8001",
        // target: 'http://127.0.0.1:9007',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/weixin/, "");
        },
      },
    },
  },
  plugins: [react()],
});
