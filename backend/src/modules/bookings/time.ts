const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;

export const normalizeTime = (value: string) => {
  const match = value.match(TIME_PATTERN);
  if (!match) {
    throw new Error(`Invalid time value: ${value}`);
  }
  return `${match[1]}:${match[2]}:00`;
};

export const toMinutes = (value: string) => {
  const [hours, minutes] = normalizeTime(value)
    .split(":")
    .map((part) => Number.parseInt(part, 10));
  return hours * 60 + minutes;
};

export const fromMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${remainder}:00`;
};

export const addMinutes = (value: string, minutes: number) => fromMinutes(toMinutes(value) + minutes);

export const overlaps = (startA: string, endA: string, startB: string, endB: string) =>
  toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
