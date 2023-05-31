import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		dts({
			outputDir: "dist",
			staticImport: true,
			insertTypesEntry: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "aegis-event-tracking",
			fileName: (format) => `aegis-event-tracking.${format}.js`,
		},
		rollupOptions: {
			// 把不想打包进你的包的包排除掉
			external: ["vue"],
			output: {
				// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
