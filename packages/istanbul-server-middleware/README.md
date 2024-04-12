# istanbul-server-middleware

> 基于nyc的istanbul-server-middleware，用于解析和持久化 istanbul coverage

## 安装

```bash
npm install istanbul-server-middleware
```

## 使用

### 一键式服务

可以直接启动一个node服务

```ts
import { startServer } from 'istanbul-server-middleware'

startServer() // ===> 启动istanbul node服务
```

### express 中间件

作为中间件使用，您可以扩展你的服务

```ts
import { Coverage, createHandler } from 'istanbul-server-middleware'

const app = express()

app.use('/:ns/coverage', createHandler({ resetOnGet: true }))

Coverage.init()

app.listen(3000, () => {
  console.log(`Running at http://localhost:3000`)
})
```
