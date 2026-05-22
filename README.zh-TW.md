# 全端網頁應用程式 (現代化升級版)

[English](./README.md) | **繁體中文**

這是一個現代化的全端開發專案範本。它採用了完整的 TypeScript 技術棧，結合了極速的 Vite 前端框架與 Express/Apollo 後端架構。開發環境使用了「混合式 Docker Compose (Hybrid Mode)」進行容器化，確保資料庫等依賴服務能夠一鍵無痛啟動。

## 🚀 核心特色

### 前端 (Vite + React 19)
- **核心框架**: [React 19](https://react.dev/)
- **建置工具**: [Vite 8](https://vitejs.dev/) (取代 Webpack + Babel，提供極速的熱更新 HMR)
- **UI 元件庫**: [Ant Design v6](https://ant.design/) 與 `@ant-design/icons`
- **路由管理**: [React Router v7](https://reactrouter.com/)
- **狀態與 GraphQL**: [Apollo Client v3](https://www.apollographql.com/docs/react/)
- **開發語言**: TypeScript (`.tsx`)

### 後端 (Node.js + Express)
- **伺服器**: Node.js & Express v5
- **GraphQL**: [Apollo Server v5](https://www.apollographql.com/docs/apollo-server/) 搭配 `@as-integrations/express5`
- **資料庫**: MongoDB (透過 [Mongoose v9](https://mongoosejs.com/))
- **執行環境**: `tsx` (直接執行原生 TypeScript 檔案)
- **程序管理**: [PM2](http://pm2.keymetrics.io/) (用於生產環境)

### 開發環境 (混合模式 Hybrid Mode)
- **Docker Compose**: 自動在背景部署與運行 MongoDB 資料庫（本機無需額外安裝 MongoDB）。
- **Native Node.js**: 前端與後端維持在本機直接運行（透過 `npm-run-all`），保留最高效能與完美的編輯器 (IDE) 開發體驗，避免跨作業系統的編譯衝突。

---

## 🛠️ 快速開始

### 1. 環境變數設定
請在專案根目錄下建立環境變數設定檔：
- **`.env`** (或 `.dev.env`): 用於 _開發環境 (development)_

```env
NODE_ENV=development
URL=127.0.0.1

# MongoDB 連線字串 (對應 Docker Compose 映射的 Port)
MONGO_URL=mongodb://127.0.0.1:27017/graphql

# JWT 加密密鑰
TOKEN_SECRET=Strong!!@JWT::!Secret
```

### 2. 安裝依賴套件
本專案採用 Yarn Workspaces。請直接在根目錄執行以下指令，即可一次為前後端安裝所有套件：
```bash
yarn install
```

### 3. 本機開發
請確保您的電腦已開啟 **Docker Desktop** 並在背景運行，接著只需輸入：
```bash
yarn dev
```
**當您執行 `yarn dev` 時會發生什麼事？**
1. 系統會執行 `docker compose up -d`，在背景將 `mongo:6.0` 資料庫容器拉起。
2. 後端伺服器 (`tsx watch server/app.ts`) 會自動啟動於 `http://localhost:8080`。
3. 前端 Vite 伺服器會自動啟動於 `http://localhost:3000`，並支援即時熱更新 (HMR)。

當您結束開發，想要乾淨地關閉資料庫容器與釋放資源時：
```bash
yarn stop
```

---

## 📦 生產環境部署

前端的打包產物將由 Vite 生成於 `client/dist` 資料夾中。

### 1. 建置 (Build)
```bash
yarn --cwd client build
```
### 2. 啟動 Node 伺服器
```bash
yarn start
```
### 3. 透過 PM2 啟動
```bash
pm2 startOrReload pm2.config.js --env production --update-env
```
