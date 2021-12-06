import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  monacoEditorPlugin()],
  rollupOptions: {
    // 请确保外部化那些你的库中不需要的依赖
    external: ['monaco-editor/esm/vs/editor/editor.api'],
  }
})
