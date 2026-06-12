import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.validated.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.validated.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
