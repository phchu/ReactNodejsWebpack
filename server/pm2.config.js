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
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['[\\/\\\\]\\./', 'node_modules'],
      kill_timeout: 8000,
      listen_timeout: 8000,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
