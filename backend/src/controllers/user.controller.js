import * as userService from '../services/user.service.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await userService.updateUserProfile(req.user.id, req.validated.body);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}
