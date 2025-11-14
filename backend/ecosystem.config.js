module.exports = {
  apps: [{
    name: 'learning-lab-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 10000
    },
    // Zero downtime deployment
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    // Health check
    health_check_grace_period: 3000
  }]
};