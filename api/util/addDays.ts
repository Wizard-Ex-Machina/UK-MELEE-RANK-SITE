export function addDays(date: Date, days: number): Date {
  let result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}
