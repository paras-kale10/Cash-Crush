import * as vaultService from '../services/vault.service.js';

export async function get(req, res, next) {
  try {
    const vault = await vaultService.getVault(req.user.id);
    res.json({ success: true, data: vault });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const vault = await vaultService.updateVault(req.user.id, req.validated.body);
    res.json({ success: true, data: vault });
  } catch (err) {
    next(err);
  }
}
