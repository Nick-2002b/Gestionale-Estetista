export const calculateEndTime = (start: string, durationInMinutes: number): string => {
  if (!start || durationInMinutes <= 0) {
    return "";
  }

  const [hoursPart, minutesPart] = start.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return "";
  }

  const date = new Date();
  date.setHours(hours, minutes + durationInMinutes, 0, 0);

  const endHours = String(date.getHours()).padStart(2, "0");
  const endMinutes = String(date.getMinutes()).padStart(2, "0");

  return `${endHours}:${endMinutes}`;
};
