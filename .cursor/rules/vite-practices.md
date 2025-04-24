# Vite 最佳实践

## 项目配置

### 基础配置 (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1500,
  },
});
```

## 开发优化

### 热更新配置
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
      timeout: 2000,
    },
  },
});
```

### 环境变量使用
```typescript
// .env
VITE_API_URL=https://api.example.com

// .env.development
VITE_API_URL=http://localhost:3000

// 使用
const apiUrl = import.meta.env.VITE_API_URL;
```

## 构建优化

### 代码分割
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // 其他第三方库
          utils: ['./src/utils'],
        },
      },
    },
  },
});
```

### 资源优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,
    sourcemap: false, // 生产环境关闭
  },
});
```

## 插件使用

### 常用插件配置
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
});
```

## 性能优化

### 预构建优化
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash-es'],
    exclude: ['your-local-package'],
  },
});
```

### 缓存优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
```

## 开发服务器配置

### 代理配置
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### CORS 配置
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
});
```

## 测试配置

### Vitest 配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## 部署配置

### 静态资源处理
```typescript
// vite.config.ts
export default defineConfig({
  base: '/app/', // 部署在子路径
  build: {
    assetsDir: 'static',
    emptyOutDir: true,
    copyPublicDir: true,
  },
});
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 最佳实践建议

1. 使用 TypeScript 配置文件
2. 合理配置环境变量
3. 优化构建性能
4. 使用合适的插件
5. 配置合理的代码分割
6. 实施缓存策略
7. 优化开发体验
8. 规范部署流程 