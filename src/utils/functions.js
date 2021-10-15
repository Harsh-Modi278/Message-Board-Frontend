export const getTimeDiff = (dt) => {
  let diffTime = new Date() - new Date(dt);
  diffTime = diffTime / 1000;

  const diffDays = Math.floor(diffTime / (3600 * 24));
  diffTime -= diffDays * (3600 * 24);

  const diffHours = Math.floor(diffTime / 3600) % 24;
  diffTime -= diffHours * 3600;

  const diffMins = Math.floor(diffTime / 60) % 60;
  diffTime -= diffMins * 60;

  let res = "";
  if (diffDays > 0) {
    res += `${diffDays}d `;
  }
  if (diffHours > 0) {
    res += `${diffHours}h `;
  }
  if ((diffDays === 0 && diffHours === 0 && diffMins === 0) || diffMins > 0) {
    res += `${diffMins}m `;
  }
  res += "ago";
  return res;
};
