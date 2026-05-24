module.exports = {
  apps: [
    {
      name: "datahub_api",

      script: "npm",
      args: "run start",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",

      error_file: "/var/log/datahub_api/pm2/err.log",
      out_file: "/var/log/datahub_api/pm2/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};