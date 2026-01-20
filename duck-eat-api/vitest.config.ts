import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    reporters: ['html', "default"],
    coverage: {
      enabled: true
    }
  },
})
