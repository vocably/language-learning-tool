import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'vocably-icon-bookmark-check',
  styleUrl: 'icon-bookmark-check.scss',
  shadow: true,
})
export class VocablyIconBookmarkCheck {
  render() {
    return (
      <Host>
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>bookmark-check</title>
          <path d="M17,3A2,2 0 0,1 19,5V21L12,18L5,21V5C5,3.89 5.9,3 7,3H17M11,14L17.25,7.76L15.84,6.34L11,11.18L8.41,8.59L7,10L11,14Z" />
        </svg>
      </Host>
    );
  }
}
