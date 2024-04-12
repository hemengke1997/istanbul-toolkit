module.exports = {
  apps: [
    {
      name: 'istanbul-server-middleware',
      exec_mode: 'cluster',
      script: 'index.js',
      instances: '1',
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
    },
  ],
}
