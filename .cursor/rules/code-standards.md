# 代码规范

## 命名规范

### 文件命名
- 组件文件使用 PascalCase：`Button.tsx`, `UserProfile.tsx`
- 工具函数文件使用 camelCase：`formatDate.ts`, `useTimer.ts`
- 样式文件与组件同名：`Button.css`, `UserProfile.module.css`
- 测试文件以 `.test.ts` 或 `.spec.ts` 结尾

### 变量命名
- 使用有意义的变量名，避免单字母（除非是循环计数器）
- 布尔值变量使用 is/has/should 前缀：`isLoading`, `hasError`
- 常量使用大写下划线：`MAX_RETRY_COUNT`
- 私有属性使用下划线前缀：`_privateMethod`

## 代码格式化

### ESLint 规则
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

### 格式规范
- 使用 2 个空格进行缩进
- 语句末尾使用分号
- 使用单引号作为字符串引号
- 对象和数组的最后一项后不加逗号
- 运算符前后要有空格
- 函数名和括号之间不加空格
- 对象的冒号后面要有一个空格
- 注释需要和代码之间保留一个空格

## React 组件规范

### 组件结构
```typescript
import React from 'react';
import styles from './Component.module.css';

interface Props {
  // 属性定义
}

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // hooks 声明
  
  // 辅助函数
  
  // 渲染函数或组件
  
  return (
    // JSX
  );
};
```

### 最佳实践
1. 使用函数组件和 Hooks
2. 组件职责单一
3. 提取可复用逻辑到自定义 Hooks
4. 使用 TypeScript 类型标注
5. 避免内联样式，使用 CSS Modules
6. 组件文件不超过 300 行

## 注释规范

### 文件头注释
```typescript
/**
 * @file 组件描述
 * @author 作者名
 * @date 创建日期
 */
```

### 函数注释
```typescript
/**
 * 函数描述
 * @param {string} param1 - 参数1描述
 * @param {number} param2 - 参数2描述
 * @returns {boolean} 返回值描述
 */
```

### 代码注释
- 使用 `//` 进行单行注释
- 复杂逻辑需要添加注释说明
- 临时代码使用 `// TODO:` 标记
- 问题代码使用 `// FIXME:` 标记

## Git 工作流

### 分支命名
- 主分支：`main`
- 功能分支：`feature/功能名称`
- 修复分支：`fix/问题描述`
- 发布分支：`release/版本号`

### 提交信息
```
<type>(<scope>): <subject>

<body>

<footer>
```

- type: feat, fix, docs, style, refactor, test, chore
- scope: 影响范围
- subject: 简短描述
- body: 详细描述
- footer: 关闭 issue 等

## 性能优化准则

1. 合理使用 React.memo 和 useMemo
2. 避免不必要的重渲染
3. 使用适当的键值进行列表渲染
4. 延迟加载非关键组件
5. 优化图片和资源加载
6. 使用性能分析工具监控性能 