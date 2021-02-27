export const getAllChildren = (
  element: Element,
  currentChildren: Element[][] = []
): Element[] => {
  const children = Array.from(element.children);
  if (!children.length) return currentChildren.flat();
  currentChildren.push(children);

  children.forEach((child) => {
    getAllChildren(child, currentChildren);
  });

  return currentChildren.flat();
};

// UNIX time to a string indicating how long ago
export const getTimeAgoString = (timestamp: number) => {
  if (typeof timestamp !== 'number') return timestamp;

  // constants
  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const YEAR = DAY * 365;

  // timeAgo === seconds since given date
  const timeAgo = Date.now() / 1000 - timestamp;

  // return timeAgo string
  if (timeAgo < MINUTE) return `less than a minute ago`;
  if (timeAgo < MINUTE * 2) return `A minute ago`;
  if (timeAgo < HOUR) return `${Math.floor(timeAgo / MINUTE)} minutes ago`;
  if (timeAgo < HOUR * 2) return `An hour ago`;
  if (timeAgo < DAY) return `${Math.floor(timeAgo / HOUR)} hours ago`;
  if (timeAgo < DAY * 2) return `A day ago`;
  if (timeAgo < YEAR) return `${Math.floor(timeAgo / DAY)} days ago`;
  if (timeAgo < YEAR * 2) return `A year ago`;
  return `${Math.floor(timeAgo / YEAR)} years ago`;
};
