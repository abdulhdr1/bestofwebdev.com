export function truncateIfTooBig(str: string, number = 128) {
  if (str.length > number) {
    return `${str.slice(0, number)}..`;
  }
  return str;
}
