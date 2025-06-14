import { Component, Element, h, Host, Method, Prop } from '@stencil/core';

const animationDuration = 200;
const pointerEventNames = ['click', 'mouseup', 'mousedown'];
const keyboardEventName = 'keydown';

let overlayStack: VocablyOverlay[] = [];

const onPointerEvent = (e: Event) => {
  e.stopImmediatePropagation();
};

const onKeyboardEvent = (event: KeyboardEvent) => {
  if (overlayStack.length === 0) {
    return;
  }

  const last = overlayStack.at(-1);

  if (!last) {
    return;
  }

  if (!last.closeKeyCode.includes(event.code)) {
    return;
  }

  last.hide();
};

@Component({
  tag: 'vocably-overlay',
  styleUrl: 'overlay.scss',
  shadow: true,
})
export class VocablyOverlay {
  @Element() el: HTMLElement;

  @Prop() closeKeyCode = ['Escape'];

  private backdrop!: HTMLElement | undefined;
  private overlay!: HTMLElement | undefined;

  constructor() {}

  @Method() async hide() {
    overlayStack = overlayStack.filter((overlay) => overlay !== this);

    if (overlayStack.length === 0) {
      pointerEventNames.forEach((pointerEvent) =>
        document.body.removeEventListener(pointerEvent, onPointerEvent)
      );
      document.body.removeEventListener(keyboardEventName, onKeyboardEvent);
    }

    if (!this.backdrop || !this.overlay) {
      throw new Error(`Can't find overlay with backdrop element`);
    }

    this.backdrop.style.opacity = '0';
    this.overlay.style.opacity = '0';
    await new Promise((resolve) => setTimeout(resolve, animationDuration));
    this.el.remove();
  }

  componentDidLoad() {
    overlayStack = [...overlayStack, this];

    if (!this.backdrop || !this.overlay) {
      throw new Error(`Can't find overlay with backdrop element`);
    }

    if (overlayStack.length === 1) {
      pointerEventNames.forEach((pointerEvent) =>
        document.body.addEventListener(pointerEvent, onPointerEvent)
      );
      document.body.addEventListener(keyboardEventName, onKeyboardEvent);
    }

    this.backdrop.addEventListener('click', () => {
      this.hide();
    });

    setTimeout(() => {
      if (!this.backdrop || !this.overlay) {
        throw new Error(`Can't find overlay with backdrop element`);
      }

      this.backdrop.style.transition = `opacity ${animationDuration}ms ease-in-out`;
      this.backdrop.style.opacity = `var(--backdropOpacity)`;

      this.overlay.style.transition = `opacity ${animationDuration}ms ease-in-out`;
      this.overlay.style.opacity = `1`;
    }, 10);
  }

  render() {
    return (
      <Host>
        <div class="backdrop" ref={(el) => (this.backdrop = el)}></div>
        <div class="overlay" ref={(el) => (this.overlay = el)}>
          <slot />
        </div>
      </Host>
    );
  }
}
