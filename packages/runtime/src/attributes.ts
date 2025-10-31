export function setAttributes(element: HTMLElement, attrs: Record<string, any>) {
  const { class: className, style, ...rest } = attrs;

  if (className) setClass(element, className);

  if (style) {
    Object.entries(style as Record<string, any>).forEach(([prop, value]) => {
      setStyle(element, prop, value);
    });
  }

  for (const [name, value] of Object.entries(rest)) {
    setAttribute(element, name, value);
  }
}

function setClass(element: HTMLElement, className: string) {
  element.className = "";

  if (typeof className === "string") element.className = className;

  if (Array.isArray(className)) element.classList.add(...className);
}

function setStyle(element: HTMLElement, name: string, value: string) {
  element.style.setProperty(name, value);
}

function removeStyle(element: HTMLElement, name: string) {
  element.style.removeProperty(name);
}

export function setAttribute(element: HTMLElement, name: string, value: string) {
  if (value == null) removeAttribute(element, name);
  else if (name.startsWith("data-")) element.setAttribute(name, value);
  // Cast to any because HTMLElement has no index signature for dynamic property names
  else (element as any)[name] = value;
}

export function removeAttribute(element: HTMLElement, name: string) {
  // same as above
  (element as any)[name] = null;
  element.removeAttribute(name);
}
