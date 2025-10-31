import { addEventListeners } from "./events";
import { Element_Node, Fragment_Node, NODE_TYPES, Node, Text_Node } from "./h";

/**
 * Mounts a virtual DOM node onto a real DOM element.
 * @param vdom - The virtual DOM node to mount (Element, Text, or Fragment)
 * @param parentElement - The parent DOM element to mount onto
 */
export function mountDOM(vdom: Node, parentElement: HTMLElement) {
  switch (vdom.type) {
    case NODE_TYPES.TEXT: {
      createTextNode(vdom, parentElement);
      break;
    }

    case NODE_TYPES.ELEMENT: {
      createElementNode(vdom, parentElement);
      break;
    }

    case NODE_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentElement);
      break;
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${(vdom as Node).type}`);
    }
  }
}

/**
 * Creates and mounts a text node from a virtual text node.
 * @param vdom - The virtual text node
 * @param parentElement - The parent DOM element to mount onto
 */
function createTextNode(vdom: Text_Node, parentElement: HTMLElement) {
  const { value } = vdom;

  const textNode = document.createTextNode(value);
  vdom.el = textNode;

  parentElement.appendChild(textNode);
}

/**
 * Creates and mounts a fragment node from a virtual fragment node.
 * @param vdom - The virtual fragment node
 * @param parentElement - The parent DOM element to mount onto
 */
function createFragmentNode(vdom: Fragment_Node, parentElement: HTMLElement) {
  const { children } = vdom;
  vdom.el = parentElement;

  children.forEach((child) => {
    mountDOM(child, parentElement);
  });
}

/**
 * Creates and mounts an element node from a virtual element node.
 * @param vdom - The virtual element node
 * @param parentElement - The parent DOM element to mount onto
 */
function createElementNode(vdom: Element_Node, parentElement: HTMLElement) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  if (props) addProps(element, props, vdom);

  vdom.el = element;

  children.forEach((child) => {
    mountDOM(child, element);
  });

  parentElement.appendChild(element);
}

/**
 * Adds props (attributes and event listeners) to a DOM element.
 * @param element - The DOM element to add props to
 * @param props - An object containing attributes and event listeners
 * @param vdom - The virtual DOM node to store props on
 */
function addProps(element: HTMLElement, props: Record<string, any>, vdom: Node) {
  const { on: events, ...attrs } = props;

  if (events) vdom.listeners = addEventListeners(events, element);
  //   setAttributes(element, attrs);
}
