export const calculateRating = (likes, dislikes) => {
  const total = likes + dislikes;
  if (total === 0) return 0;
  return ((likes / total) * 5).toFixed(1);
};