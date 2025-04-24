# 中文注释规范

## 基本原则

1. 注释必须使用中文
2. 注释必须是完整的句子，包含主谓宾
3. 中英文之间要有空格
4. 标点符号使用中文标点
5. 专有名词可以使用英文，但需要在首次出现时注明中文含义

## 文件头注释

```typescript
/**
 * @file 任务计时器组件
 * @description 实现工作任务的计时、暂停、重置等功能
 * @author 张三
 * @date 2024-03-20
 */
```

## 组件注释

```typescript
/**
 * 任务计时器组件
 * 
 * 功能：
 * 1. 计时功能：支持开始、暂停、重置
 * 2. 任务管理：可以添加、编辑、删除任务
 * 3. 数据统计：统计每日工作时长
 * 
 * @param {string} taskName - 任务名称
 * @param {number} duration - 计时时长（单位：分钟）
 * @param {(time: number) => void} onComplete - 计时完成回调函数
 */
```

## 函数注释

```typescript
/**
 * 格式化时间为可读字符串
 * 
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串，格式：HH:mm:ss
 * 
 * @example
 * formatTime(3665) // 返回 "01:01:05"
 */
function formatTime(seconds: number): string {
  // ... 实现代码
}
```

## 复杂逻辑注释

```typescript
// 使用 Web Worker 处理耗时计算
// 注意：Worker 中不能访问 DOM 和 Window 对象
const worker = new Worker('worker.js');

// 实现双向绑定
// 1. 监听输入框变化
// 2. 更新状态
// 3. 触发渲染
function implementTwoWayBinding() {
  // ... 实现代码
}
```

## 变量和常量注释

```typescript
// 最大重试次数（包含首次请求）
const MAX_RETRY_COUNT = 3;

// 用户输入的搜索关键词
const searchKeyword = ref('');

// 任务状态枚举
enum TaskStatus {
  // 未开始
  NotStarted = 0,
  // 进行中
  InProgress = 1,
  // 已完成
  Completed = 2,
  // 已取消
  Cancelled = 3,
}
```

## 类型定义注释

```typescript
/**
 * 任务配置接口
 */
interface TaskConfig {
  /** 任务唯一标识 */
  id: string;
  /** 任务名称 */
  name: string;
  /** 预计时长（单位：分钟） */
  estimatedDuration: number;
  /** 任务优先级（1-5，5 为最高） */
  priority: number;
  /** 任务标签列表 */
  tags: string[];
}
```

## 异步操作注释

```typescript
/**
 * 获取用户任务列表
 * 
 * @param {string} userId - 用户 ID
 * @returns {Promise<Task[]>} 任务列表
 * @throws {ApiError} 当 API 请求失败时抛出
 */
async function fetchUserTasks(userId: string): Promise<Task[]> {
  // 发起 API 请求
  const response = await fetch(`/api/users/${userId}/tasks`);
  
  // 检查响应状态
  if (!response.ok) {
    throw new ApiError(response.status, '获取任务列表失败');
  }
  
  // 解析并返回数据
  return response.json();
}
```

## 条件判断注释

```typescript
// 检查用户权限
if (userRole === 'admin') {
  // 管理员可以查看所有用户的任务
  await fetchAllUsersTasks();
} else {
  // 普通用户只能查看自己的任务
  await fetchUserTasks(currentUserId);
}
```

## 废弃代码注释

```typescript
/**
 * @deprecated 从 v2.0.0 开始废弃，请使用 `newFunction` 代替
 * @see {@link newFunction}
 */
function oldFunction() {
  console.warn('该函数已废弃，请使用 newFunction');
  // ... 实现代码
}
```

## 待办事项注释

```typescript
// TODO(张三): 添加任务导出功能
// TODO(李四): 优化任务搜索性能
// FIXME: 修复在 Safari 浏览器下的显示问题
```

## 注释规范检查

1. 确保所有公共接口都有完整的中文注释
2. 确保注释的语言表述清晰、准确
3. 及时更新注释，确保注释与代码的一致性
4. 删除无用或过时的注释
5. 使用工具（如 ESLint）检查注释规范 