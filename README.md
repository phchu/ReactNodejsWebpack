# Full Stack Web Application (Modernized)

**English** | [繁體中文](./README.zh-TW.md)

This is a modern template project for full stack development. It features a complete TypeScript stack with a blazingly fast Vite frontend and an Express/Apollo backend. The development environment is containerized using a Hybrid Docker Compose approach to ensure hassle-free database setups.

## 🚀 Key Features

### Frontend (Vite + React 19)
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) (Replaced Webpack + Babel for instant HMR)
- **UI Library**: [Ant Design v6](https://ant.design/) & `@ant-design/icons`
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State/GraphQL**: [Apollo Client v3](https://www.apollographql.com/docs/react/)
- **Language**: TypeScript (`.tsx`)

### Backend (Node.js + Express)
- **Server**: Node.js & Express v5
- **GraphQL**: [Apollo Server v5](https://www.apollographql.com/docs/apollo-server/) with `@as-integrations/express5`
- **Database**: MongoDB (via [Mongoose v9](https://mongoosejs.com/))
- **Execution**: `tsx` for native TypeScript execution
- **Process Manager**: [PM2](http://pm2.keymetrics.io/) (for Production)

### Development Environment (Hybrid Mode)
- **Docker Compose**: Automatically orchestrates the MongoDB database (no local installation required).
- **Native Node.js**: Frontend and Backend run natively on the host machine via `npm-run-all` for maximum performance and flawless IDE integration.

---

## 🛠️ Quick Start

### 1. Environment Configuration
Create environment variables configuration files in the root directory:
- **`.env`** (or `.dev.env`): Configuration for the _development_ environment.

```env
NODE_ENV=development
URL=127.0.0.1

# MongoDB URL (Mapped to Docker Compose port)
MONGO_URL=mongodb://127.0.0.1:27017/graphql

# JWT Secret
TOKEN_SECRET=Strong!!@JWT::!Secret
```

### 2. Install Dependencies
This project uses Yarn Workspaces. Install packages for both frontend and backend from the root directory:
```bash
yarn install
```

### 3. Development
Ensure **Docker Desktop** is running, then simply run:
```bash
yarn dev
```
**What happens when you run `yarn dev`?**
1. `docker compose up -d` is executed to spin up the `mongo:6.0` database container in the background.
2. The Backend (`tsx watch server/app.ts`) starts on `http://localhost:8080`.
3. The Frontend Vite server starts on `http://localhost:3000` with instant Hot Module Replacement (HMR).

To stop the development environment and cleanly shut down the database container:
```bash
yarn stop
```

---

## 📦 Production

The output objects will be generated in the `client/dist` folder via Vite.

### 1. Build
```bash
yarn --cwd client build
```
### 2. Start (Node)
```bash
yarn start
```
### 3. Start (PM2)
```bash
pm2 startOrReload pm2.config.js --env production --update-env
```
