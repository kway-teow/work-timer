# Work Timer 项目说明

## 项目简介

Work Timer 是一个基于 React + TypeScript + Vite 构建的工作计时器应用，旨在帮助用户更好地管理和追踪工作时间。支持多语言国际化、主题切换、数据持久化等功能。

## 项目结构

```
work-timer/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源文件
│   ├── components/        # React 组件
│   ├── locales/          # 国际化语言文件
│   ├── store/            # 状态管理
│   ├── styles/           # 样式文件
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 应用根组件
│   ├── main.tsx          # 应用入口
│   ├── i18n.ts          # 国际化配置
│   └── vite-env.d.ts     # Vite 环境类型声明
├── public/               # 公共静态资源
├── .cursor/              # Cursor IDE 配置和规范文档
│   └── rules/           # 项目规范文档
├── .github/             # GitHub 配置文件
├── .vscode/             # VSCode 配置文件
├── dist/                # 构建输出目录
├── index.html           # HTML 入口文件
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置
├── tsconfig.app.json    # 应用 TypeScript 配置
├── tsconfig.node.json   # Node 环境 TypeScript 配置
├── vite.config.ts       # Vite 配置
└── eslint.config.js     # ESLint 配置
```

## 技术栈

- React 18
- TypeScript 5
- Vite 5
- TailwindCSS
- i18next（国际化）
- Zustand（状态管理）
- ESLint（代码规范）
- Vitest（单元测试）

## 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐使用 pnpm 作为包管理器）

## 本地开发

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 构建生产版本：
```bash
pnpm build
```

4. 运行测试：
```bash
pnpm test
```

## 项目特性

- ⏱️ 工作计时：支持多任务计时、暂停、继续
- 🌍 国际化：支持中英文切换
- 🎨 主题：支持亮色/暗色模式
- 📊 数据统计：工作时长统计和可视化
- 💾 数据持久化：自动保存任务和设置
- 📱 响应式设计：支持移动端和桌面端
- 🔔 提醒功能：任务完成提醒

## 开发规范

详细规范请参考 `.cursor/rules` 目录下的文档：

1. `code-standards.md` - 代码规范
2. `typescript-practices.md` - TypeScript 最佳实践
3. `vite-practices.md` - Vite 最佳实践
4. `chinese-comment-standards.md` - 中文注释规范

## 贡献指南

1. Fork 项目并克隆到本地
2. 创建新的功能分支：`feature/xxx` 或修复分支：`fix/xxx`
3. 提交代码，遵循 Conventional Commits 规范
4. 提交 Pull Request

## 版本发布

使用语义化版本号（Semantic Versioning）:

- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正 