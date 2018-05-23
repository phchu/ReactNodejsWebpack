## Full Stack Web Application using React, Node.js, Express with Webpack and Babel
This is a template project for full stack development with React and Node.js. Javascript ES6 and ES7 syntax are also supported in this project.
### Key Features
#### Frontend
- React
- [Ant Design](https://ant.design/)
- [React Font Awesome](https://github.com/andreypopp/react-fa)
#### Backend
- Node.js
- Express
- [PM2](http://pm2.keymetrics.io/)   

#### Compile
- Webpack 4
- Babel
---
### Quick Start

#### Install NPM packages    
   ```bash
   yarn (or npm install)
   ```
#### Development    
   ```bash
   yarn dev (or npm run dev)
   ```

#### Production
The output objects will be generated in **dist** folder. You could modify the path in **webpack.config(.*).js**.  
1. Build    
   ```bash
   yarn build (or npm run build)
   ```    
2. Start    
   ```bash
   yarn start (or npm start)
   ```
3. Start by PM2   
   ```bash
   pm2 startOrReload pm2.config.js --env production --update-env
   ```