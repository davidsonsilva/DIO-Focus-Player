export class DioPageObserver {
  constructor({ root = document, windowObject = window, delay = 120 }) {
    this.root = root;
    this.windowObject = windowObject;
    this.delay = delay;
  }

  subscribe(listener) {
    let timer;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(listener, this.delay);
    };
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(this.root.body, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(this.root.documentElement);
    this.windowObject.addEventListener('popstate', schedule);

    return () => {
      clearTimeout(timer);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      this.windowObject.removeEventListener('popstate', schedule);
    };
  }
}
