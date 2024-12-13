export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};
