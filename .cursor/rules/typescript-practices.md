# TypeScript 最佳实践

## 类型定义规范

### 基本类型
```typescript
// ✅ 推荐
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const numbers: number[] = [1, 2, 3];
const tuple: [string, number] = ['hello', 42];

// ❌ 避免
const name: any = 'John';
const numbers = new Array<number>();
```

### 接口定义
```typescript
// ✅ 推荐
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// ❌ 避免
interface User {
  [key: string]: any; // 避免使用索引签名
}
```

### 类型别名
```typescript
// ✅ 推荐
type ID = string | number;
type Handler<T> = (value: T) => void;
type Theme = 'light' | 'dark';

// ❌ 避免
type Obj = object;
type Func = Function;
```

## 泛型使用

### 泛型约束
```typescript
// ✅ 推荐
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

// ❌ 避免
function logLength<T>(arg: T): number {
  return (arg as any).length;
}
```

### 泛型默认值
```typescript
// ✅ 推荐
interface Container<T = string> {
  value: T;
}

// 使用
const strContainer: Container = { value: 'hello' };
const numContainer: Container<number> = { value: 42 };
```

## 类型断言

### 类型断言最佳实践
```typescript
// ✅ 推荐
const element = document.getElementById('root') as HTMLElement;
const value = <string>someValue;

// ❌ 避免
const element = document.getElementById('root')!;
const value = someValue as any;
```

## 工具类型使用

### 内置工具类型
```typescript
// Partial - 使所有属性可选
type PartialUser = Partial<User>;

// Required - 使所有属性必需
type RequiredUser = Required<User>;

// Pick - 选择特定属性
type UserBasicInfo = Pick<User, 'id' | 'name'>;

// Omit - 排除特定属性
type UserWithoutEmail = Omit<User, 'email'>;

// Record - 创建键值对类型
type UserRoles = Record<string, string[]>;
```

### 自定义工具类型
```typescript
// 深度 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 非空属性
type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
```

## 类型守卫

### 用户定义的类型守卫
```typescript
// ✅ 推荐
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return (
    value != null &&
    typeof value === 'object' &&
    'id' in value &&
    'name' in value
  );
}

// 使用
if (isString(value)) {
  console.log(value.toUpperCase());
}
```

## 异步操作类型

### Promise 类型
```typescript
// ✅ 推荐
async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');
  return response.json();
}

// ❌ 避免
async function fetchUser(): Promise<any> {
  const response = await fetch('/api/user');
  return response.json();
}
```

## 错误处理

### 自定义错误类型
```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 使用
try {
  throw new ApiError(404, 'Not Found');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode);
  }
}
```

## 配置建议

### tsconfig.json 推荐配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 性能考虑

1. 避免过度使用泛型
2. 合理使用类型推断
3. 避免不必要的类型断言
4. 使用 const assertions 优化字面量类型
5. 优化类型导入/导出 