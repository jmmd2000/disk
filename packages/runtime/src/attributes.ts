type StyleRecord = Record<string, string | number | null | undefined>;

/**
 * Sets multiple attributes, classes, and styles on a DOM element.
 * @param element - The DOM element to set attributes on
 * @param attrs - An object containing attributes, class, style, and event listeners
 */
export function setAttributes(element: HTMLElement, attrs: Record<string, unknown>) {
  const { class: className, style, ...rest } = attrs;

  if (className) setClass(element, className);

  if (style && typeof style === "object") {
    Object.entries(style as StyleRecord).forEach(([prop, value]) => {
      if (value == null) removeStyle(element, prop);
      else setStyle(element, prop, value);
    });
  }

  for (const [name, value] of Object.entries(rest)) {
    setAttribute(element, name, value);
  }
}

/**
 * Sets the class name(s) on an element (string or array of strings)
 * @param element - The DOM element to set the class on
 * @param className - A string class name or array of class names
 */
function setClass(element: HTMLElement, className: unknown) {
  element.className = "";

  if (typeof className === "string") {
    element.className = className;
    return;
  }

  if (Array.isArray(className)) {
    const tokens = className.filter((value): value is string => typeof value === "string");
    if (tokens.length) element.classList.add(...tokens);
  }
}

/**
 * Sets a single CSS style property on an element.
 * @param element - The DOM element to set the style on
 * @param name - The CSS property name (e.g. color, fontSize)
 * @param value - The CSS property value (e.g. red, 12px)
 */
function setStyle(element: HTMLElement, name: string, value: string | number) {
  element.style.setProperty(name, String(value));
}

/**
 * Removes a CSS style property from an element.
 * @param element - The DOM element to remove the style from
 * @param name - The CSS property name to remove
 */
function removeStyle(element: HTMLElement, name: string) {
  element.style.removeProperty(name);
}

/**
 * Sets a single attribute on a DOM element.
 * @param element - The DOM element to set the attribute on
 * @param name - The attribute name
 * @param value - The attribute value (null/undefined removes the attribute)
 */
export function setAttribute(element: HTMLElement, name: string, value: unknown) {
  if (value == null) {
    removeAttribute(element, name);
  } else if (typeof value === "boolean") {
    if (value) element.setAttribute(name, "");
    else removeAttribute(element, name);
  } else if (name.startsWith("data-")) {
    element.setAttribute(name, String(value));
  } else {
    (element as HTMLElement & Record<string, unknown>)[name] = value;
  }
}

/**
 * Removes an attribute from a DOM element.
 * @param element - The DOM element to remove the attribute from
 * @param name - The name of the attribute to remove
 */
export function removeAttribute(element: HTMLElement, name: string) {
  (element as HTMLElement & Record<string, unknown>)[name] = null;
  element.removeAttribute(name);
}
