import { defineConfig, loadEnv } from 'vite'
import { createInquiryHandler } from './server/inquiries.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'CREATOR_')
  const configure = server => {
    server.middlewares.use('/api/inquiries', createInquiryHandler({
      webhook: env.CREATOR_INQUIRY_WEBHOOK, demo: true,
    }))
  }

  return {
    base: './',
    publicDir: false,
    esbuild: { jsx: 'automatic' },
    plugins: [{ name: 'creator-inquiries', configureServer: configure, configurePreviewServer: configure }],
  }
})
