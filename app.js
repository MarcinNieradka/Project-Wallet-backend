import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import * as url from 'url';

import expressEjsLayouts from 'express-ejs-layouts';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { transactionsRouter } from './routes/api/transactionRoutes.js';
import { usersRouter } from './routes/api/userRoutes.js';
import { viewRouter } from './routes/api/viewRoute.js';
import { backupRouter } from './routes/api/backupRoutes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swaggerDoc.js';

export const app = express();
const logger = morgan;

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressEjsLayouts);
app.use(express.static('public'));

app.use('/api-wallet', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/info', viewRouter);
app.use('/api/backup', backupRouter);

app.use(passport.initialize());

app.use((req, res) => {
  // res.status(404).json({ message: 'Not found' });
  res.status(404).render('notFound/index');
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
