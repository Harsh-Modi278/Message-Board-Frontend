// TO-DO: Add documentation
export const getTimeDiff = (dt: string): string => {
  const currentTime: Date = new Date();
  const postTime: Date = new Date(dt);

  const diffTime: number = currentTime.getTime() - postTime.getTime();
  const diffSeconds: number = Math.floor(diffTime / 1000);
  const diffMinutes: number = Math.floor(diffSeconds / 60);
  const diffHours: number = Math.floor(diffMinutes / 60);
  const diffDays: number = Math.floor(diffHours / 24);
  const diffMonths: number = Math.floor(diffDays / 30);
  const diffYears: number = Math.floor(diffMonths / 12);

  let res: string = "";
  if (diffYears > 0) {
    res += `${diffYears}y `;
  }
  if (diffMonths > 0) {
    res += `${diffMonths % 12}mo `;
  }
  if (diffDays > 0) {
    res += `${diffDays % 30}d `;
  }
  if (diffHours > 0) {
    res += `${diffHours % 24}h `;
  }
  if (diffMinutes > 0) {
    res += `${diffMinutes % 60}m `;
  }
  res += "ago";
  return res.trim();
};
