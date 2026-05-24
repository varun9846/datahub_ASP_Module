import { cfg } from "./config.js";
import app from "./app.js";
import logger from "./logger.js";

app.listen(cfg.PORT, () => {
  logger.info(`Datahub API running on port ${cfg.PORT}`);
}).on('error', (err) => {
  logger.error('Failed to start server', err);
});
