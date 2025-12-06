const truncateMiddle = (text: string, maxLength: number, lastLength?: number) => {
  const endLength = lastLength ? lastLength : 2;
  const ellipsis = "...";

  if (text.length <= maxLength) return text;

  const startLength = maxLength - endLength - ellipsis.length;

  if (startLength <= 0) return `${ellipsis}${text.slice(-endLength)}`;

  return `${text.slice(0, startLength)}${ellipsis}${text.slice(-endLength)}`;
};

export default truncateMiddle;
