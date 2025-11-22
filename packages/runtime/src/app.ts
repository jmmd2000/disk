import { Dispatcher } from "./dispatcher";
import { destroyDOM } from "./destroy_dom";
import { Node } from "./h";
import { mountDOM } from "./mount_dom";

interface CreateAppParams<State> {
  /** The initial application state */
  state: State;
  /** A function that renders the view based on the current state and provides an emit function */
  view: (state: State, emit: EmitFn) => Node;
  /** An object mapping action names to reducer functions that update the state */
  reducers: ReducersMap<State>;
}

/**
 * Creates a new application instance with state management, view rendering, and event dispatching.
 *
 * @param state - The initial application state
 * @param view - A function that renders the view based on the current state and provides an emit function
 * @param reducers - An object mapping action names to reducer functions that update the state
 * @returns An object with mount and unmount methods to control the application lifecycle
 */
export function createApp<State>({ state, view, reducers }: CreateAppParams<State>) {
  let parentElement: HTMLElement | null = null;
  let vdom: Node | null = null;

  const dispatcher = new Dispatcher();
  // Rerender the app after every command.
  const subscriptions: Array<() => void> = [dispatcher.afterEveryCommand(renderApp)];

  /**
   * Emits an event by dispatching it through the dispatcher.
   *
   * @param eventName - The name of the event/command to dispatch
   * @param payload - The payload data to pass with the event
   */
  function emit(eventName: string, payload: unknown) {
    dispatcher.dispatch(eventName, payload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(actionName, (payload) => {
      // Update the state calling the reducer function.
      state = reducer(state, payload);
    });
    // If the subscription is exists, add it to the subscriptions array.
    if (subs) subscriptions.push(subs);
  }
  /**
   * Renders the application by destroying the previous view (if it exists),
   * creating a new virtual DOM from the current state, and mounting it to the DOM.
   */
  function renderApp() {
    // Destroy the previous view.
    if (vdom) destroyDOM(vdom);

    vdom = view(state, emit);
    // Mount the new view to the DOM.
    if (parentElement) mountDOM(vdom, parentElement);
  }

  return {
    /**
     * Mounts the application to a DOM element and renders the initial view.
     *
     * @param parentElement - The DOM element to mount the application to
     */
    mount(_parentElement: HTMLElement) {
      parentElement = _parentElement;
      renderApp();
    },

    /**
     * Unmounts the application from the DOM, destroys the current view,
     * and unsubscribes from all event handlers.
     */
    unmount() {
      if (vdom) destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}

type EmitFn = (eventName: string, payload: unknown) => void;
type ReducersMap<State> = Record<string, (state: State, payload: unknown) => State>;
