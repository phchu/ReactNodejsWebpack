module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'server',
      script: './dist/server.bundle.js',
      instances: 0,
      exec_mode: "cluster",
      watch: false,
      ignore_watch: ["[\\/\\\\]\\./", "node_modules"],
      cron_restart: "20 4 1 * *",
      //monthly restart for refreshing ssl certificate
      kill_timeout: 8000,
      listen_timeout: 8000,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        COMMON_VARIABLE: 'true',
        TZ: "Asia/Taipei"
      },
      env_production: {
        NODE_ENV: 'production',
        TZ: "Asia/Taipei"
      }
    }
  ]
};
