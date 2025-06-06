import { Component, h, Host, Prop } from '@stencil/core';
import { TranslationCard } from '@vocably/model';

@Component({
  tag: 'vocably-first-translation-congratulation',
  styleUrl: 'first-translation-congratulation.scss',
  shadow: true,
})
export class VocablyFirstTranslationCongratulation {
  @Prop() card: TranslationCard;
  render() {
    return (
      <Host>
        <p>
          <strong style={{ fontWeight: 'bold' }}>
            {this.card.data.source}
          </strong>{' '}
          is added to your collection.
        </p>
        <p>Open the mobile app to study your cards.</p>
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
