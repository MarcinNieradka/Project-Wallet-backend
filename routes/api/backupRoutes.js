import express from 'express';
import { getDatabaseBackup } from '../../controllers/backupController.js';
import { auth } from '../../middlewares/authMiddleware.js';

export const backupRouter = express.Router();

backupRouter.get('/', auth, getDatabaseBackup);
