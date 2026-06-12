import { migrateApi } from '../api/services.js';

const LEGACY_STORAGE_KEY = 'cashcrush_data';
const MIGRATION_FLAG_KEY = 'cashcrush_migration_attempted';

/**
 * Reads legacy localStorage data and uploads it to PostgreSQL via API.
 * Runs once per browser after first API login.
 */
export async function migrateLegacyDataIfNeeded() {
  const alreadyAttempted = localStorage.getItem(MIGRATION_FLAG_KEY);
  if (alreadyAttempted) return { migrated: false, reason: 'already_attempted' };

  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATION_FLAG_KEY, '1');
    return { migrated: false, reason: 'no_local_data' };
  }

  let localData;
  try {
    localData = JSON.parse(raw);
  } catch {
    localStorage.setItem(MIGRATION_FLAG_KEY, '1');
    return { migrated: false, reason: 'invalid_json' };
  }

  // Only migrate if there is meaningful data beyond defaults
  const hasData =
    (localData.expenses?.length > 0) ||
    (localData.bills?.length > 0) ||
    (localData.goals?.length > 0) ||
    (localData.vault?.currentSavings > 0) ||
    localData.isOnboarded;

  if (!hasData) {
    localStorage.setItem(MIGRATION_FLAG_KEY, '1');
    return { migrated: false, reason: 'empty_data' };
  }

  const result = await migrateApi.fromLocalStorage(localData);
  localStorage.setItem(MIGRATION_FLAG_KEY, '1');

  // Keep legacy key as backup until user confirms data in cloud
  return result;
}
