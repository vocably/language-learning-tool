import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

const pluralize = (word: string, n: number): string => {
  return word + (n !== 1 ? 's' : '');
};

@Component({
  tag: 'vocably-subscription-timer',
  styleUrl: 'subscription-timer.scss',
  shadow: true,
})
export class VocablySubscriptionTimer {
  @Prop() seconds: number = 60;
  @Event() elapsed: EventEmitter;

  @State() secondsLeft = this.seconds;

  private intervalId: ReturnType<typeof setInterval>;

  connectedCallback() {
    this.intervalId = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft -= 1;
      } else {
        this.elapsed.emit();
      }
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  render() {
    const unitsLeft =
      this.secondsLeft > 180
        ? Math.round(this.secondsLeft / 60)
        : this.secondsLeft;
    const unitsName = this.secondsLeft > 180 ? 'minute' : 'second';

    return (
      <Host>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '96px', lineHeight: 'normal' }}>
            {unitsLeft}
          </div>
          <div>
            {pluralize(unitsName, unitsLeft)} left before next translation.
          </div>
          <div style={{ marginBottom: '12px' }}>
            Upgrade to Vocably Premium for unlimited translations.
          </div>
          <div class="button-container">
            <a href="vocably-pro://upgrade" class={'button'}>
              Upgrade to Vocably Premium
            </a>
          </div>
        </div>
      </Host>
    );
  }
}
