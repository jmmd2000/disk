import { withoutNulls } from "./utils/arrays";

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

export function h(tag: string, props = {}, ...children: Node[]): Node {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: NODE_TYPES.ELEMENT,
  };
}

function mapTextNodes(children: Node[]): Node[] {
  return children.map((child) => (typeof child === "string" ? hString(child) : child));
}

export function hString(string: string): Text_Node {
  return {
    type: NODE_TYPES.TEXT,
    value: string,
  };
}

export function hFragment(vNodes: Node[]): Fragment_Node {
  return {
    type: NODE_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}
