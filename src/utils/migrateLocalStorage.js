import { migrateApi } from '../api/services.js';

const LEGACY_STORAGE_KEY = 'cashcrush_data';
const MIGRATION_FLAG_KEY = 'cashcrush_migration_attempted';

/**
 * Reads legacy localStorage data and uploads it to PostgreSQL via API.
 * Runs after login and on session restore when local data may not have synced yet.
 */
export async function migrateLegacyDataIfNeeded() {
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

  const alreadyAttempted = localStorage.getItem(MIGRATION_FLAG_KEY);
  // Allow retry when onboarding was completed locally but never synced to the server
  if (alreadyAttempted && !localData.isOnboarded) {
    return { migrated: false, reason: 'already_attempted' };
  }

  const result = await migrateApi.fromLocalStorage(localData);
  localStorage.setItem(MIGRATION_FLAG_KEY, '1');

  return result;
}
