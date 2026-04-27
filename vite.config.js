import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // evalを使わないビルドターゲットに設定
    target: 'es2020',
  },
})
