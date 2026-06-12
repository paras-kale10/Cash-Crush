import * as goalService from '../services/goal.service.js';

export async function list(req, res, next) {
  try {
    const goals = await goalService.listGoals(req.user.id);
    res.json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const goal = await goalService.createGoal(req.user.id, req.validated.body);
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const goal = await goalService.updateGoal(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    );
    res.json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await goalService.deleteGoal(
      req.user.id,
      req.validated.params.id
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
