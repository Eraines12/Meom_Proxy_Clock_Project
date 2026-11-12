// 18+ eligibility rules. Age and age confirmation are never sent to the model.
const MIN_AGE = 18, MAX_AGE = 120;

function checkEligibility({ ageConfirmed, age }) {
  if (ageConfirmed !== true) return { ok: false, error: 'ageConfirmRequired', field: 'age-confirm' };
  const value = typeof age === 'string' && age.trim() !== '' ? Number(age) : age;
  if (!Number.isInteger(value)) return { ok: false, error: 'ageInvalid', field: 'age' };
  if (value < MIN_AGE) return { ok: false, error: 'ageUnder18', field: 'age' };
  if (value > MAX_AGE) return { ok: false, error: 'ageInvalid', field: 'age' };
  return { ok: true, age: value };
}
