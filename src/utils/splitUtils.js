export function buildSplitShareData(totalAmount, people = []) {
  const sanitizedTotal = Number(totalAmount) || 0;
  const names = (people || [])
    .map((person) => String(person || '').trim())
    .filter(Boolean);

  if (!sanitizedTotal || sanitizedTotal <= 0 || names.length === 0) {
    return {
      entries: [],
      totalAmount: sanitizedTotal,
      count: 0,
      sharePerPerson: 0,
      remainder: 0,
      isValid: false,
    };
  }

  const cents = Math.round(sanitizedTotal * 100);
  const count = names.length;
  const baseCents = Math.floor(cents / count);
  const remainderCents = cents % count;

  const entries = names.map((name, index) => {
    const shareCents = index < remainderCents ? baseCents + 1 : baseCents;
    return {
      name,
      share: Number((shareCents / 100).toFixed(2)),
      isSettled: false,
      paidAmount: 0,
    };
  });

  const roundedTotal = Number(entries.reduce((sum, entry) => sum + entry.share, 0).toFixed(2));
  const finalDifference = Number((sanitizedTotal - roundedTotal).toFixed(2));

  if (entries.length > 0) {
    entries[entries.length - 1].share = Number((entries[entries.length - 1].share + finalDifference).toFixed(2));
  }

  return {
    entries,
    totalAmount: sanitizedTotal,
    count,
    sharePerPerson: Number((sanitizedTotal / count).toFixed(2)),
    remainder: Number((sanitizedTotal - roundedTotal).toFixed(2)),
    isValid: true,
  };
}

export function summarizeSplitEntries(entries = []) {
  const normalized = Array.isArray(entries) ? entries : [];
  const totalTracked = normalized.reduce((sum, entry) => sum + (Number(entry.totalAmount) || 0), 0);
  const settledAmount = normalized.reduce((sum, entry) => {
    return sum + (entry.people || []).reduce((personSum, person) => {
      return personSum + (person.isSettled ? (Number(person.share) || 0) : 0);
    }, 0);
  }, 0);
  const pendingAmount = normalized.reduce((sum, entry) => {
    return sum + (entry.people || []).reduce((personSum, person) => {
      return personSum + (!person.isSettled ? (Number(person.share) || 0) : 0);
    }, 0);
  }, 0);

  return {
    totalTracked,
    settledAmount,
    pendingAmount,
    activeEntries: normalized.length,
    pendingPeople: normalized.reduce((count, entry) => {
      return count + (entry.people || []).filter((person) => !person.isSettled).length;
    }, 0),
  };
}
