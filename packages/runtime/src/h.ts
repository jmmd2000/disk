import { DOMEventHandler } from "./events";
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
  props?: Record<string, unknown>;
  children: Node[];
  el?: HTMLElement;
  listeners?: Record<string, DOMEventHandler>;
};

export type Text_Node = {
  type: NODE_TYPES.TEXT;
  value: string;
  el?: Text;
  listeners?: Record<string, DOMEventHandler>;
};

export type Fragment_Node = {
  type: NODE_TYPES.FRAGMENT;
  children: Node[];
  el?: HTMLElement;
  listeners?: Record<string, DOMEventHandler>;
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
export function h(tag: string, props: Record<string, unknown> = {}, ...children: Child[]): Node {
  return {
    tag,
    props,
    children: normalizeChildren(children),
    type: NODE_TYPES.ELEMENT,
  };
}

/**
 * Converts string children to text nodes, leaves other nodes unchanged.
 * Flattens nested arrays and drops nullish values so callers can pass
 * either variadic children or a single array of children.
 * @param children - Array of child nodes (may contain strings or nested arrays)
 * @returns Array of nodes (strings converted to text nodes)
 */
function normalizeChildren(children: Child[]): Node[] {
  const normalized: Node[] = [];

  children.forEach((child) => {
    if (child == null) return;
    if (Array.isArray(child)) {
      normalized.push(...normalizeChildren(child));
    } else if (typeof child === "string") {
      normalized.push(hString(child));
    } else {
      normalized.push(child);
    }
  });

  return withoutNulls(normalized);
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
    children: normalizeChildren(vNodes),
  };
}

type Child = Node | string | null | undefined | Child[];
