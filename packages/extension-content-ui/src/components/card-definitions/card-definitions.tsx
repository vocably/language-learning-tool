import { Component, h, Host, Prop } from '@stencil/core';
import { TranslationCard } from '@vocably/model';
import { explode } from '@vocably/sulna';

@Component({
  tag: 'vocably-card-definitions',
  styleUrl: 'card-definitions.scss',
  shadow: false,
})
export class VocablyCardDefinitions {
  @Prop() card: TranslationCard;

  render() {
    const definitions = explode(this.card.data.definition);

    if (definitions.length === 0) {
      return (
        <Host>
          <div class="vocably-italic">{this.card.data.translation}</div>
        </Host>
      );
    }

    return (
      <ul class="vocably-list">
        {this.card.data.translation && (
          <li>
            <span class="vocably-italic">{this.card.data.translation}</span>
          </li>
        )}
        {definitions.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    );
  }
}
