import * as transactionService from '../services/transaction.service.js';

export async function list(req, res, next) {
  try {
    const result = await transactionService.listTransactions(
      req.user.id,
      req.validated.query
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const transaction = await transactionService.createTransaction(
      req.user.id,
      req.validated.body
    );
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const transaction = await transactionService.updateTransaction(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await transactionService.deleteTransaction(
      req.user.id,
      req.validated.params.id
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
