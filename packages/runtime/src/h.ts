import { withoutNulls } from "./utils/arrays";

export enum DOM_TYPES {
  TEXT = "text",
  ELEMENT = "element",
  FRAGMENT = "fragment",
}

export type Basic_Node = {
  tag: string;
  props: Record<string, unknown>;
  children: Node[];
  type: DOM_TYPES.ELEMENT;
};

export type Text_Node = {
  value: string;
  type: DOM_TYPES.TEXT;
};

export type Fragment_Node = {
  children: Node[];
  type: DOM_TYPES.FRAGMENT;
};

export type Node = Basic_Node | Text_Node | Fragment_Node;

export function h(tag: string, props = {}, ...children: Node[]): Node {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

function mapTextNodes(children: Node[]): Node[] {
  return children.map((child) => (typeof child === "string" ? hString(child) : child));
}

export function hString(string: string): Text_Node {
  return {
    type: DOM_TYPES.TEXT,
    value: string,
  };
}

export function hFragment(vNodes: Node[]): Fragment_Node {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}
