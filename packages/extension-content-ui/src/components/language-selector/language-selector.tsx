import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
} from '@stencil/core';

@Component({
  tag: 'vocably-language-selector',
  styleUrl: 'language-selector.scss',
  shadow: true,
})
export class VocablyLanguageSelector {
  @Element() el: HTMLElement;

  @Prop() languages: Array<[code: string, name: string]>;
  @Prop() value: string;
  @Prop() hint: string;
  @Prop() disabled = false;

  @Event() choose: EventEmitter<string>;

  private hintElement: HTMLElement;
  private hintMutationObserver: MutationObserver;

  componentDidLoad() {
    this.observeMutations();
    this.updateHintWidth();
  }

  disconnectedCallback() {
    this.hintMutationObserver?.disconnect();
  }

  private observeMutations() {
    this.hintMutationObserver = new MutationObserver(() => {
      this.updateHintWidth();
    });

    this.hintMutationObserver.observe(this.hintElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private updateHintWidth() {
    if (this.hintElement) {
      console.log(this.el);
      this.el.style.setProperty(
        '--hint-width',
        `${this.hintElement.offsetWidth}px`
      );
    }
  }

  render() {
    return (
      <div class={'wrapper'}>
        <select
          class="vocably-input-select"
          disabled={this.disabled}
          onChange={(event) =>
            this.choose.emit((event.target as HTMLSelectElement).value)
          }
        >
          {this.languages.map(([code, name]) => (
            <option selected={this.value === code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <span class={'hint'} ref={(el) => (this.hintElement = el)}>
          {this.hint}
        </span>
      </div>
    );
  }
}
