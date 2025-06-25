export const formattedDate = (createdAt: Date) => {
  const date = new Date(createdAt);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы от 0
  const year = date.getFullYear();
  const formatted = `${day}-${month}-${year}`;
  return formatted;
};
