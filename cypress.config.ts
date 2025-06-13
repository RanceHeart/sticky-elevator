import { defineConfig } from 'cypress'

export default defineConfig({
  // ↓ 端到端测试配置
  e2e: {
    // dev 服务器地址（vite 默认 5173）
    baseUrl: 'http://localhost:5173',
    // 支持文件（全局 hooks / 自定义命令）
    supportFile: 'cypress/support/e2e.ts',
  },
})
