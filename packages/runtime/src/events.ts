/**
 * Adds a single event listener to an element.
 * @param eventName - The name of the event to listen for (e.g., 'click', 'input')
 * @param handler - The event handler function to call when the event fires
 * @param element - The DOM element to attach the listener to
 * @returns The handler function that was added
 */
export function addEventListener(eventName: string, handler: EventListener, element: HTMLElement) {
  element.addEventListener(eventName, handler);
  return handler;
}

/**
 * Adds multiple event listeners to an element.
 * @param listeners - An object mapping event names to their handler functions
 * @param element - The DOM element to attach the listeners to
 * @returns An object mapping event names to the added handler functions
 */
export function addEventListeners(listeners: Record<string, EventListener> = {}, element: HTMLElement) {
  const addedListeners = {};

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, element);
    (addedListeners as Record<string, EventListener>)[eventName] = listener;
  });

  return addedListeners as Record<string, EventListener>;
}
