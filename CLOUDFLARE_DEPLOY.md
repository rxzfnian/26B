# Cloudflare Pages 部署说明

## 部署步骤

### 1. 登录Cloudflare Dashboard
访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录你的账户。

### 2. 创建Pages项目
1. 在左侧菜单中点击 "Pages"
2. 点击 "Create a project"
3. 选择 "Connect to Git"

### 3. 连接GitHub仓库
1. 选择你的GitHub账户
2. 选择 `rxzfnian/KPL` 仓库
3. 选择 `main` 分支

### 4. 配置构建设置
```
Project name: kpl-anime-guessr
Production branch: main
Framework preset: None
Build command: cd client && npm run build
Build output directory: client/build
Root directory: client
```

### 5. 环境变量配置
在 "Environment variables" 部分添加：
```
REACT_APP_API_URL = https://your-koyeb-app-name.koyeb.app/api
```

### 6. 部署
点击 "Save and Deploy" 开始部署。

## 部署后的访问地址
部署完成后，你的应用将在以下地址可用：
`https://kpl-anime-guessr.pages.dev`

## 注意事项
- 确保GitHub仓库中的代码是最新的
- 后端API地址已配置为你的Koyeb服务器
- 前端会自动连接到Koyeb后端获取数据
