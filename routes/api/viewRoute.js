import express from 'express';
import { getCustomers, getInfo } from '../../controllers/viewController.js';

export const viewRouter = express.Router();

viewRouter.get('/', getInfo);

viewRouter.get('/customers', getCustomers);
