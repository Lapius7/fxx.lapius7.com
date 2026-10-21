module.exports = {
  apps: [
    {
      name: "fxx-lapius7",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      env: { NODE_ENV: "production", PORT: "4001" },
      max_memory_restart: "500M",
    },
  ],
};
