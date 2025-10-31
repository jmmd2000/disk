import { withoutNulls } from "./utils/arrays";

/** Types of virtual DOM nodes */
export enum NODE_TYPES {
  TEXT = "text",
  ELEMENT = "element",
  FRAGMENT = "fragment",
}

export type Element_Node = {
  type: NODE_TYPES.ELEMENT;
  tag: string;
  props?: Record<string, any>;
  children: Node[];
  el?: HTMLElement;
  listeners?: Record<string, EventListener>;
};

export type Text_Node = {
  type: NODE_TYPES.TEXT;
  value: string;
  el?: Text;
  listeners?: Record<string, EventListener>;
};

export type Fragment_Node = {
  type: NODE_TYPES.FRAGMENT;
  children: Node[];
  el?: HTMLElement;
  listeners?: Record<string, EventListener>;
};

export type Node = Element_Node | Text_Node | Fragment_Node;

/**
 * Creates a virtual DOM element node
 * @param tag - The HTML tag name (e.g. div, button, span)
 * @param props - Optional props object containing attributes and event listeners
 * @param children - Variable number of child nodes
 * @returns A virtual DOM element node
 * @example
 * h('div', { id: 'app' }, h('p', {}, 'Hello'))
 * h('button', { on: { click: handleClick } }, 'Click me')
 */
export function h(tag: string, props = {}, ...children: Node[]): Node {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: NODE_TYPES.ELEMENT,
  };
}

/**
 * Converts string children to text nodes, leaves other nodes unchanged.
 * @param children - Array of child nodes (may contain strings)
 * @returns Array of nodes (strings converted to text nodes)
 */
function mapTextNodes(children: Node[]): Node[] {
  return children.map((child) => (typeof child === "string" ? hString(child) : child));
}

/**
 * Creates a virtual DOM text node.
 * @param string - The text content
 * @returns A virtual DOM text node
 */
export function hString(string: string): Text_Node {
  return {
    type: NODE_TYPES.TEXT,
    value: string,
  };
}

/**
 * Creates a virtual DOM fragment node
 * @param vNodes - Array of virtual nodes to wrap in a fragment
 * @returns A virtual DOM fragment node
 */
export function hFragment(vNodes: Node[]): Fragment_Node {
  return {
    type: NODE_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}
