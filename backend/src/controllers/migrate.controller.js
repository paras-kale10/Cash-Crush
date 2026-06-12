import * as migrateService from '../services/migrate.service.js';

export async function migrateFromLocal(req, res, next) {
  try {
    const result = await migrateService.migrateLocalStorageData(
      req.user.id,
      req.validated.body.localData
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
