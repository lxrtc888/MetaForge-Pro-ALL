# 代码规范标准文档

> **项目名称**：[项目名称]
> **技术栈**：[技术栈]
> **文档版本**：v1.0

---

## 📝 命名规范

### 文件命名
```yaml
组件文件: PascalCase.tsx (TaskList.tsx, UserProfile.tsx)
页面文件: kebab-case (task-list, user-profile)
工具文件: camelCase.ts (formatDate.ts, apiClient.ts)
样式文件: 与组件同名 (TaskList.module.css)
测试文件: *.test.ts / *.spec.ts
```

### 变量命名
```yaml
变量/函数: camelCase (userName, handleSubmit)
常量: UPPER_SNAKE_CASE (API_BASE_URL, MAX_RETRY)
组件: PascalCase (TaskList, UserProfile)
类型/接口: PascalCase with prefix (IUser, TTaskStatus)
枚举: PascalCase (TaskStatus, UserRole)
```

---

## 📁 目录结构规范

```
src/
├── app/                    # 页面路由（Next.js App Router）
│   ├── api/                # API 路由
│   ├── (auth)/             # 认证相关页面（路由组）
│   ├── (main)/             # 主应用页面（路由组）
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 可复用组件
│   ├── ui/                 # 基础 UI 组件
│   ├── forms/              # 表单组件
│   └── layouts/            # 布局组件
├── lib/                    # 工具库和配置
├── types/                  # TypeScript 类型定义
├── hooks/                  # 自定义 React Hooks
├── stores/                 # 状态管理
└── styles/                 # 全局样式
```

---

## 🔧 编码规范

### TypeScript 规范
```typescript
// 使用 interface 定义对象类型
interface User {
  id: string;
  name: string;
  email: string;
}

// 使用 type 定义联合类型
type TaskStatus = 'todo' | 'in_progress' | 'done';

// 函数参数和返回值都要有类型
function getUser(id: string): Promise<User> {
  // ...
}

// 避免使用 any，使用 unknown 代替
function parseData(data: unknown): User {
  // ...
}
```

### React 组件规范
```tsx
// 使用函数组件 + TypeScript
interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: string, data: Partial<Task>) => void;
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onTaskUpdate} />
      ))}
    </div>
  );
}
```

### API 路由规范
```typescript
// 统一的 API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 错误处理
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '服务器错误' } },
      { status: 500 }
    );
  }
}
```

---

## 🔒 安全规范

```yaml
认证:
  - 所有 API 端点必须验证认证状态
  - 使用 JWT 或 Session 进行认证
  - 敏感操作需二次确认

授权:
  - 用户只能访问自己的数据
  - 管理员权限需独立验证
  - API 权限基于角色控制

数据安全:
  - 密码使用 bcrypt 加密存储
  - 敏感信息不在前端暴露
  - 使用 HTTPS 传输数据

输入验证:
  - 所有用户输入必须验证和清理
  - 使用 Zod 进行数据验证
  - 防止 SQL 注入和 XSS 攻击
```

---

## 📊 质量标准

```yaml
代码质量:
  - ESLint 零错误零警告
  - TypeScript 严格模式
  - 测试覆盖率 > 70%

性能标准:
  - 首页加载 < 2秒
  - API 响应 < 500ms
  - Lighthouse 评分 > 90

可维护性:
  - 函数不超过 50 行
  - 文件不超过 300 行
  - 模块职责单一
```

---

*由 MetaForge Pro 框架生成 — 代码规范标准*
