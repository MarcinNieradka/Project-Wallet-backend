import Transaction from '../service/schemas/transactions.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import validCategories from '../utils/validCategories.js';
import categories from '../utils/balanceCategories.js';
import convertDateToDDMMYYYY from '../utils/correctDate.js';

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.status(200).json({
      status: 'Success',
      code: 200,
      message: 'List of User transactions',
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTransaction = async (req, res) => {
  const { isIncome, date, comment, category, amount } = req.body;

  if (!date || isIncome === undefined)
    return res.status(400).json({ error: 'Please enter all required information' });

  if (isIncome) delete req.body.category;

  const correctDate = convertDateToDDMMYYYY(date);
  if (correctDate === 'Invalid date') return res.status(400).json({ error: 'Invalid date format' });

  const ultimateCategory = isIncome ? 'Income' : category;

  if (!validCategories.includes(ultimateCategory)) {
    return res
      .status(400)
      .json({ error: 'Invalid category provided. Please enter the correct category.' });
  }

  if (amount <= 0) return res.status(400).json({ error: 'The amount must be greather than zero' });

  try {
    const newTransaction = await Transaction.create({
      user: req.user._id,
      isIncome,
      date: correctDate,
      comment,
      category: ultimateCategory,
      amount,
    });

    res.status(201).json({
      status: 'Created',
      code: 201,
      message: 'Added new transaction!',
      newTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid transaction id' });
  }

  try {
    const transactionToRemove = await Transaction.findById(id);

    if (!transactionToRemove) {
      return res.status(404).json({ error: 'Transaction was not found or already deleted' });
    }

    if (
      transactionToRemove.user &&
      transactionToRemove.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await Transaction.deleteOne({ _id: id });

    res.status(200).json({
      status: 'Success',
      code: 200,
      message: `Transaction with id ${id} removed successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    let result = await Transaction.findById(id);

    if (req.body.date) {
      req.body.date = convertDateToDDMMYYYY(req.body.date);
      if (req.body.date === 'Invalid date') {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    if (req.body.category && !validCategories.includes(req.body.category)) {
      return res
        .status(400)
        .json({ error: 'Invalid category provided. Please enter the correct category.' });
    }

    if (!result.user.equals(req.user._id)) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    result = await Transaction.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });

    res.status(200).json({
      status: 'Success',
      code: 200,
      message: `Updated transaction with id ${id}`,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export const filterTransactions = async (req, res) => {
  const { month, year } = req.params;

  if (!month || !year) {
    return res.status(400).json({ error: 'Please enter /month(MM) and /year(YYYY)' });
  }

  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  const matchStage = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        $expr: {
          $and: [
            {
              $eq: [
                { $year: { $dateFromString: { dateString: '$date', format: '%d-%m-%Y' } } },
                parseInt(year),
              ],
            },
            {
              $eq: [
                { $month: { $dateFromString: { dateString: '$date', format: '%d-%m-%Y' } } },
                parseInt(month),
              ],
            },
          ],
        },
      },
    },
  ];

  try {
    const transactions = await Transaction.aggregate(matchStage);
    res.status(200).json({
      status: 'Success',
      code: 200,
      message: 'List of User transactions from the selected period (MM/YYYY)',
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const totalIncomePipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          category: 'Income',
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ];
    const totalIncomeResult = await Transaction.aggregate(totalIncomePipeline);

    const totalIncome = totalIncomeResult.length ? totalIncomeResult[0].totalIncome : 0;

    const totalExpensesPipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          category: { $ne: 'Income' },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalExpenses: 1,
        },
      },
    ];

    const totalExpensesResult = await Transaction.aggregate(totalExpensesPipeline);

    const totalExpenses = totalExpensesResult.length ? totalExpensesResult[0].totalExpenses : 0;

    const balance = totalIncome - totalExpenses;

    const expensesByCategoriesPipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
    ];

    const results = await Transaction.aggregate(expensesByCategoriesPipeline);

    const totalExpensesByCategories = categories.map(category => {
      const categoryTotal = results.find(aggr => aggr.category === category.name)?.total;

      return {
        category: category.name,
        amount: Math.abs(categoryTotal || 0),
      };
    });

    const outcome = {
      totalIncome: Math.abs(totalIncome),
      totalExpenses: Math.abs(totalExpenses),
      balance,
      totalExpensesByCategories,
    };

    res.status(200).json({
      status: 'Success',
      code: 200,
      message: 'Sum of User income, expenses (also by category) and balance',
      outcome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
