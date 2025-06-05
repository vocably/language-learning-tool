import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'vocably-first-translation-congratulation',
  styleUrl: 'first-translation-congratulation.scss',
  shadow: true,
})
export class VocablyFirstTranslationCongratulation {
  render() {
    return (
      <Host>
        <p>You can translate words and add cards on any website.</p>
        <p>Open the mobile app to review and study your cards.</p>
        <p class="small">Scan the QR code to install the app.</p>
        <p>
          <vocably-qr-code style={{ width: '200px' }}></vocably-qr-code>
        </p>
        <div class="small">
          Or open this URL{' '}
          <a href="https://vocably.pro/app.html" target={'_blank'}>
            vocably.pro/app.html
          </a>{' '}
          <br />
          on you mobile to install the app.
        </div>
      </Host>
    );
  }
}
