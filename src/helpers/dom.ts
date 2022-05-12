/**
 * Returns empty string if either the element is missing or the color property
 */
export function getElementColor(cssSelector: string): string {
    const element = document.querySelector(cssSelector);
    return element ? document.defaultView?.getComputedStyle(element).color || "" : ""

}