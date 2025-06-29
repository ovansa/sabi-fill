// ==================== utils/dom-utils.ts ====================

export class DOMUtils {
  static getElementIdentifier(element: HTMLElement): string {
    const parts = [
      element.id?.toLowerCase() || '',
      (element as any).name?.toLowerCase() || '',
      (element as HTMLInputElement).placeholder?.toLowerCase() || '',
      element.className?.toLowerCase() || '',
      element.getAttribute('data-testid')?.toLowerCase() || '',
    ].filter(Boolean);

    return parts.join(' ');
  }

  static triggerEvents(element: HTMLElement): void {
    const events = ['input', 'change', 'blur', 'focus'] as const;
    events.forEach((eventType) => {
      element.dispatchEvent(
        new Event(eventType, {
          bubbles: true,
          cancelable: true,
        })
      );
    });
  }

  static setInputValueWithReactSupport(
    input: HTMLInputElement,
    value: string
  ): void {
    if (input.type === 'file') return;

    input.value = value;

    // Trigger events for framework detection
    this.triggerEvents(input);

    // React-specific handling
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  static generateRandomDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }
}
