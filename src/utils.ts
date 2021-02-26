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
