import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'vocably-icon-plus',
  styleUrl: 'icon-plus.scss',
  shadow: true,
})
export class VocablyIconPlus {
  render() {
    return (
      <Host>
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>plus</title>
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </Host>
    );
  }
}
