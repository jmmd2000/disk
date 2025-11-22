/**
 * A dispatcher that manages command subscriptions and execution.
 * Handles subscribing handlers to specific commands and executing them when commands are dispatched.
 * Also supports after-handlers that run after every command execution.
 */
export class Dispatcher {
  /** Map of command names to arrays of handler functions that subscribe to those commands. */
  #subs = new Map<string, ((...args: any[]) => void)[]>();
  /** Array of handler functions that are executed after every command is dispatched. */
  #afterHandlers = [] as ((...args: any[]) => void)[];

  /**
   * Subscribes a handler function to a specific command name.
   * Creates the array of subscriptions if it doesn't exist for the given command name.
   *
   * @param commandName - The name of the command to subscribe to
   * @param handler - The handler function to execute when the command is dispatched
   * @returns A function that unsubscribes the handler, or an empty function if the handler was already registered
   */
  subscribe(commandName: string, handler: (...args: any[]) => void) {
    if (!this.#subs.has(commandName)) {
      this.#subs.set(commandName, []);
    }

    const handlers = this.#subs.get(commandName);
    if (!handlers) return;

    // Checks whether the handler is already registered.
    if (handlers.includes(handler)) {
      return () => {};
    }

    // Registers the handler.
    handlers.push(handler);

    // Returns a function that unregisters the handler.
    return () => {
      const index = handlers.indexOf(handler);
      handlers.splice(index, 1);
    };
  }

  /**
   * Registers a handler function to be executed after every command is dispatched.
   *
   * @param handler - The handler function to execute after each command
   * @returns A function that unregisters the handler
   */
  afterEveryCommand(handler: (...args: any[]) => void) {
    this.#afterHandlers.push(handler);

    return () => {
      const index = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(index, 1);
    };
  }

  /**
   * Dispatches a command by executing all subscribed handlers for the command name,
   * then executes all after-handlers.
   *
   * @param commandName - The name of the command to dispatch
   * @param payload - The payload data to pass to the command handlers
   */
  dispatch(commandName: string, payload: any) {
    if (this.#subs.has(commandName)) {
      this.#subs.get(commandName)?.forEach((handler) => handler(payload));
    } else {
      console.warn(`No handlers for command: ${commandName}`);
    }

    this.#afterHandlers.forEach((handler) => handler());
  }
}
