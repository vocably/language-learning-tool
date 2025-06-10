import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'vocably-rate',
  styleUrl: 'rate.scss',
  shadow: false,
})
export class VocablyRate {
  @Event() userSelected: EventEmitter<
    'review' | 'later' | 'never' | 'feedback'
  >;

  @Prop() platform: { name: string; url: string };

  render() {
    return (
      <Host>
        <div>
          <strong>
            It will take less than a minute, but will mean a lot for Vocably.
          </strong>
        </div>
        <div class="vocably-mt-12">
          Do you find Vocably useful? Your rating on the {this.platform.name}
          <br />
          will make a big difference for this project.
        </div>
        <div class="vocably-mt-12">
          <a
            href={this.platform.url}
            target="_blank"
            class="vocably-button"
            onClick={() => this.userSelected.emit('review')}
          >
            OK, rate Vocably
          </a>
          <button
            style={{ marginLeft: '8px' }}
            class="vocably-link-button"
            onClick={() => this.userSelected.emit('later')}
          >
            Ask me later.
          </button>
        </div>
        <div class="vocably-mt-12">
          Don't you like anything about Vocably? Then please{' '}
          <a
            href="https://app.vocably.pro/feedback"
            target="_blank"
            class="vocably-link-button"
            onClick={() => this.userSelected.emit('feedback')}
          >
            contact the author
          </a>
          .<br /> I take every feedback seriously. We can improve this project
          together.
        </div>
        <div class="vocably-mt-12">
          You will see this message again after 10 translations.
          <button
            class="vocably-link-button vocably-text-link vocably-small"
            onClick={() => this.userSelected.emit('never')}
          >
            Never show this message again.
          </button>
        </div>
      </Host>
    );
  }
}
