// eslint-disable-next-line
export function debounce<This, Args extends any[]>(
  func: (...args: Args) => void,
  delay: number
) {
  // eslint-disable-next-line
  let timer: any = 0;

  return function (this: This, ...args: Args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.call(this, ...args), delay);
  };
}
