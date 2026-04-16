import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { app } = require('../server/index');

export default app;
