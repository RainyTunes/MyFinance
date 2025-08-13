# Netlify 部署指南

## 项目概述
这是一个基于 React + Vite + TypeScript + Ant Design 的前端单页应用项目。

## 部署方式

### 方式一：通过 Git 自动部署（推荐）

1. **连接 Git 仓库**
   - 登录 Netlify Dashboard
   - 点击 "New site from Git"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权并选择此项目仓库

2. **构建设置**
   ```
   Build command: cd frontend && npm ci && npm run build
   Publish directory: frontend/dist
   ```

3. **环境变量设置**（如需要）
   ```
   NODE_VERSION=18
   NPM_USE_YARN=false
   ```

### 方式二：手动部署

1. **本地构建**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **上传构建文件**
   - 将 `frontend/dist` 目录拖拽到 Netlify Deploy 页面
   - 或使用 Netlify CLI：`netlify deploy --prod --dir=frontend/dist`

## 详细配置说明

### netlify.toml 配置文件

项目根目录已包含 `netlify.toml` 配置文件，包含以下设置：

#### 构建配置
- **构建命令**: `cd frontend && npm ci && npm run build`
- **发布目录**: `frontend/dist`
- **Node.js 版本**: 18

#### SPA 路由支持
- 配置了 `/*` 到 `/index.html` 的重定向
- 状态码 200，支持客户端路由

#### 安全头部
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

#### 缓存策略
- 静态资源（/assets/*）：1年缓存
- HTML文件：不缓存，必须重新验证

### Netlify Dashboard 设置

#### Site Settings
1. **Site information**
   - Site name: 自定义站点名称
   - Domain settings: 配置自定义域名（可选）

2. **Build & deploy**
   - Branch to deploy: `main`（或你的主分支）
   - Build command: `cd frontend && npm ci && npm run build`
   - Publish directory: `frontend/dist`

#### Environment variables（如需要）
可在 Site settings > Build & deploy > Environment variables 中添加：
```
NODE_VERSION=18
VITE_API_URL=your_api_url（如果有后端API）
```

#### Deploy contexts
- **Production branch**: main
- **Deploy previews**: 开启（用于 PR 预览）
- **Branch deploys**: 根据需要配置

### 部署优化

#### 1. 构建性能优化
```toml
[build.environment]
NODE_OPTIONS = "--max_old_space_size=4096"
```

#### 2. 依赖缓存
Netlify 会自动缓存 `node_modules`，使用 `npm ci` 确保依赖一致性。

#### 3. 构建时间优化
- 使用 `npm ci` 而不是 `npm install`
- 考虑使用 pnpm 或 yarn 如果项目较大

### 常见问题解决

#### 1. 路由 404 问题
确保 `netlify.toml` 中包含重定向规则：
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 构建失败
- 检查 Node.js 版本兼容性
- 确保 `package.json` 中的依赖完整
- 查看构建日志中的错误信息

#### 3. 环境变量
如果使用环境变量，确保：
- 以 `VITE_` 前缀命名
- 在 Netlify Dashboard 中正确配置

### 性能监控

1. **Lighthouse CI**（可选）
   - 可集成 Lighthouse 进行性能监控
   - 在每次部署时自动运行性能测试

2. **Bundle Analyzer**
   ```bash
   cd frontend
   npm install --save-dev rollup-plugin-visualizer
   npm run build -- --analyze
   ```

### 自定义域名配置

1. **添加域名**
   - Site settings > Domain management
   - Add custom domain

2. **SSL 证书**
   - Netlify 自动提供 Let's Encrypt SSL 证书
   - 强制 HTTPS 重定向

### CLI 部署命令

安装 Netlify CLI：
```bash
npm install -g netlify-cli
```

部署命令：
```bash
# 登录
netlify login

# 链接站点
netlify link

# 预览部署
netlify deploy --dir=frontend/dist

# 生产部署
netlify deploy --prod --dir=frontend/dist
```

## 部署检查清单

- [ ] `netlify.toml` 配置文件已创建
- [ ] 构建命令和发布目录正确设置
- [ ] 环境变量已配置（如需要）
- [ ] SPA 路由重定向已设置
- [ ] 自定义域名已配置（如需要）
- [ ] SSL 证书已启用
- [ ] 部署预览已测试
- [ ] 性能优化已应用

部署完成后，你的应用将在 `https://your-site-name.netlify.app` 或自定义域名上可用。