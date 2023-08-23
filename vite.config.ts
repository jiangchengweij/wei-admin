import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"
import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '/@': pathResolve('./src'),
      assets: pathResolve('./src/assets'),
    }
  },
  plugins: [uni()],
});
