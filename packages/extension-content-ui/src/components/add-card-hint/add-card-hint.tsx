import { Component, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'vocably-add-card-hint',
  styleUrl: 'add-card-hint.scss',
  shadow: true,
})
export class VocablyAddCardHint {
  @Event() confirm: EventEmitter;

  render() {
    return (
      <Host>
        <span class="hint">Click here</span>
        <svg
          class="arrow"
          width="28"
          height="15"
          viewBox="0 0 28 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1.54141 8.9238C0.771414 9.258 0.348426 9.2814 0.116426 9.0031C-0.359574 8.4302 0.686425 6.7104 2.11842 5.7119C3.70942 4.603 8.26342 3.24358 11.1134 3.0276C13.8054 2.82348 17.0554 3.12503 18.7054 3.7319C19.3264 3.9603 19.8494 4.1204 19.8674 4.0877C19.8864 4.0548 19.6814 3.24682 19.4124 2.2919C18.7594 -0.0292306 19.0194 -0.450971 20.5684 0.417849C21.8334 1.12699 25.6214 4.8715 26.6884 6.4669C27.9774 8.3944 27.4164 10.3477 25.2704 11.4034C18.7674 14.6016 17.5424 15.0267 17.1044 14.2367C16.7764 13.6445 18.1604 11.7495 19.8034 10.5412L21.4284 9.3465L20.3144 8.9062C17.5394 7.8088 14.7854 7.0159 13.2414 6.8692C9.73143 6.536 5.22341 7.3279 1.54141 8.9238Z" />
        </svg>
      </Host>
    );
  }
}
