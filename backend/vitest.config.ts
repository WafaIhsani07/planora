import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/testdb",
      JWT_SECRET: "test-secret",
      JWT_REFRESH_SECRET: "test-refresh-secret",
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      NODE_ENV: "test"
    },
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      include: ["src/modules/**/*.service.ts", "src/modules/**/*.validation.ts"],
    },
    // Setiap test file mendapat timeout 10 detik
    testTimeout: 10000,
    // Jalankan test secara sequential untuk menghindari race condition pada mock
    sequence: {
      concurrent: false,
    },
  },
})
