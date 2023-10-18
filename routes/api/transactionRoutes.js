import express from 'express';
import { auth } from '../../middlewares/authMiddleware.js';

export const transactionsRouter = express.Router();

import {
  getAllCategories,
  filterTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  createTransaction,
} from '../../controllers/transactionControllers.js';

transactionsRouter.get('/categories/totals', auth, getAllCategories); // all categories

transactionsRouter.get('/:month/:year', auth, filterTransactions); //filter transaction

transactionsRouter.patch('/:id', auth, updateTransaction); // update transaction

transactionsRouter.delete('/:id', auth, deleteTransaction); // delete transaction

transactionsRouter.get('/', auth, getAllTransactions); //get all transactions

transactionsRouter.post('/', auth, createTransaction); //create transaction
