import { removeEventListeners } from "./events";
import { Element_Node, Fragment_Node, NODE_TYPES, Node, Text_Node } from "./h";

/**
 * Recursively destroys a virtual DOM node and its children
 *
 * This function handles three types of nodes:
 * - Text nodes: Removes the DOM element from the DOM tree
 * - Element nodes: Removes the DOM element, recursively destroys all children, and removes any attached event listeners
 * - Fragment nodes: Recursively destroys all children (fragments have no direct DOM element)
 *
 * After destruction, the 'el' property is deleted from the virtual DOM node.
 *
 * @param vdom - The virtual DOM node to destroy. Can be a Text_Node, Element_Node, or Fragment_Node.
 * @throws {Error} If the node type is not recognized.
 */
export function destroyDOM(vdom: Node) {
  const { type } = vdom;

  switch (type) {
    case NODE_TYPES.TEXT: {
      removeTextNode(vdom);
      break;
    }

    case NODE_TYPES.ELEMENT: {
      removeElementNode(vdom);
      break;
    }

    case NODE_TYPES.FRAGMENT: {
      removeFragmentNode(vdom);
      break;
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${(vdom as Node).type}`);
    }
  }

  delete vdom.el;
}

/**
 * Removes a text node from the DOM tree.
 *
 * @param vdom - The text node to remove. If the node has an associated DOM element it will be removed from the DOM tree.
 */
function removeTextNode(vdom: Text_Node) {
  const { el } = vdom;
  if (el) el.remove();
}

/**
 * Removes an element node from the DOM and performs cleanup operations.
 *
 * This function:
 * - Removes the DOM element from the DOM tree if it exists
 * - Recursively destroys all child nodes by calling destroyDOM() on each child
 * - Removes all attached event listeners if they exist
 * - Deletes the listeners property from the virtual DOM node
 *
 * @param vdom - The element node to remove.
 */
function removeElementNode(vdom: Element_Node) {
  const { el, children, listeners } = vdom;
  if (el) el.remove();
  children.forEach((child) => destroyDOM(child));
  if (listeners && el) {
    removeEventListeners(listeners, el);
    delete vdom.listeners;
  }
}

/**
 * Removes a fragment node by recursively destroying all its children.
 *
 * @param vdom - The fragment node to process. Must have a 'children' array.
 */
function removeFragmentNode(vdom: Fragment_Node) {
  const { children } = vdom;
  children.forEach((child) => destroyDOM(child));
}
