import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core';
import { isItem } from '@vocably/crud';
import {
  AddCardPayload,
  AttachTagPayload,
  AudioPronunciationPayload,
  CardItem,
  DeleteTagPayload,
  DetachTagPayload,
  GoogleLanguage,
  isCardItem,
  isDetachedCardItem,
  isGoogleTTSLanguage,
  languageList,
  RateInteractionPayload,
  RemoveCardPayload,
  Result,
  TagCandidate,
  TagItem,
  TranslationCard,
  TranslationCards,
  UpdateTagPayload,
} from '@vocably/model';
import { getSelectedTagIds } from './getSelectedTagIds';
import { isDirectNecessary } from './isDirectNecessary';
import { sortLanguages } from './sortLanguages';

@Component({
  tag: 'vocably-translation',
  styleUrl: 'translation.scss',
  shadow: true,
})
export class VocablyTranslation {
  @Prop() phrase: string;
  @Prop() result: Result<TranslationCards> | null = null;
  @Prop() loading: boolean = false;
  @Prop() existingSourceLanguages: GoogleLanguage[] = [];
  @Prop() existingTargetLanguages: GoogleLanguage[] = [];
  @Prop() isFeedbackEnabled: boolean = true;
  @Prop() askForRating: boolean = false;
  @Prop() sourceLanguage: string = '';
  @Prop() targetLanguage: string = '';
  @Prop() isUpdating: TranslationCard | null = null;
  @Prop() showSaveHint: boolean = true;
  @Prop() canCongratulate: boolean = false;
  @Prop() playAudioPronunciation: (
    payload: AudioPronunciationPayload
  ) => Promise<Result<true>>;
  @Prop() extensionPlatform: { name: string; url: string };
  @Prop() attachTag: (
    data: AttachTagPayload
  ) => Promise<Result<TranslationCards>>;
  @Prop() detachTag: (
    data: DetachTagPayload
  ) => Promise<Result<TranslationCards>>;
  @Prop() updateTag: (
    data: UpdateTagPayload
  ) => Promise<Result<TranslationCards>>;
  @Prop() deleteTag: (
    data: DeleteTagPayload
  ) => Promise<Result<TranslationCards>>;
  @Prop({ mutable: true }) disabled = false;

  @Event() ratingInteraction: EventEmitter<RateInteractionPayload>;

  @Event() changeSourceLanguage: EventEmitter<string>;
  @Event() changeTargetLanguage: EventEmitter<string>;
  @Event() removeCard: EventEmitter<RemoveCardPayload>;
  @Event() addCard: EventEmitter<AddCardPayload>;

  @State() saveCardClicked = false;
  @State() addedItemIndex = -1;
  @State() removing: {
    card: CardItem;
    tag: TagItem;
  } | null = null;

  @Element() el: HTMLElement;

  @Method()
  async play() {
    const playSoundElement =
      this.el.shadowRoot.querySelector('vocably-play-sound');

    if (!playSoundElement) {
      return;
    }

    playSoundElement.play();
  }

  private overlay: HTMLElement | null = null;
  private tagsMenu: HTMLElement | null = null;

  private showTagMenu(caller: HTMLElement, cardId: string) {
    if (this.result === null || !this.result.success) {
      return;
    }

    if (this.overlay) {
      this.overlay.remove();
    }

    if (this.tagsMenu) {
      this.tagsMenu.remove();
    }

    const tagsMenu = document.createElement('vocably-tags-menu');
    tagsMenu.existingItems = this.result.value.tags;
    tagsMenu.selectedItems = getSelectedTagIds(this.result.value, cardId);

    const callerPosition = caller.getBoundingClientRect();
    tagsMenu.style.position = 'absolute';
    tagsMenu.style.left = `${window.scrollX + callerPosition.right}px`;
    tagsMenu.style.transform = `translate(-100%, 0)`;

    tagsMenu.saveTag = async (tag: TagCandidate): Promise<Result<any>> => {
      if (!this.result || !this.result.success) {
        return {
          success: false,
          errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
          reason:
            'Unable to save tag because the result is empty or erroneous.',
        };
      }

      this.disabled = true;

      const result = await (isItem(tag)
        ? this.updateTag({
            tag,
            translationCards: this.result.value,
          })
        : this.attachTag({
            cardId,
            tag,
            translationCards: this.result.value,
          }));

      this.disabled = false;

      if (result.success) {
        this.result = result;
        tagsMenu.existingItems = result.value.tags;
        tagsMenu.selectedItems = getSelectedTagIds(result.value, cardId);
      }

      return result;
    };

    tagsMenu.deleteTag = async (tag: TagItem): Promise<Result<unknown>> => {
      if (!this.result || !this.result.success) {
        return {
          success: false,
          errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
          reason:
            'Unable to delete tag because the result is empty or erroneous.',
        };
      }

      this.disabled = true;

      const result = await this.deleteTag({
        tag,
        translationCards: this.result.value,
      });

      this.disabled = false;

      if (result.success) {
        this.result = result;
        tagsMenu.existingItems = result.value.tags;
        tagsMenu.selectedItems = getSelectedTagIds(result.value, cardId);
      }

      return result;
    };

    tagsMenu.attachTag = async (tag: TagItem): Promise<Result<unknown>> => {
      if (!this.result || !this.result.success) {
        return {
          success: false,
          errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
          reason:
            'Unable to attach tag because the result is empty or erroneous.',
        };
      }

      this.disabled = true;

      const result = await this.attachTag({
        translationCards: this.result.value,
        tag,
        cardId,
      });

      this.disabled = false;

      if (result.success) {
        this.result = result;
        tagsMenu.existingItems = result.value.tags;
        tagsMenu.selectedItems = getSelectedTagIds(result.value, cardId);
      }

      return result;
    };

    tagsMenu.detachTag = async (tag: TagItem): Promise<Result<unknown>> => {
      if (!this.result || !this.result.success) {
        return {
          success: false,
          errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
          reason:
            'Unable to detach tag because the result is empty or erroneous.',
        };
      }

      this.disabled = true;

      const result = await this.detachTag({
        translationCards: this.result.value,
        tag,
        cardId,
      });

      this.disabled = false;

      if (result.success) {
        this.result = result;
        tagsMenu.existingItems = result.value.tags;
        tagsMenu.selectedItems = getSelectedTagIds(result.value, cardId);
      }

      return result;
    };

    if (callerPosition.top * 2 > window.innerHeight) {
      tagsMenu.style.bottom = `${
        window.innerHeight - window.scrollY - callerPosition.bottom
      }px`;
    } else {
      tagsMenu.style.top = `${window.scrollY + callerPosition.top}px`;
    }

    const overlay = document.createElement('vocably-overlay');
    overlay.style.setProperty('--backdropOpacity', '0');
    overlay.appendChild(tagsMenu);
    window.document.body.appendChild(overlay);

    this.overlay = overlay;
    this.tagsMenu = tagsMenu;
  }

  private detachTagClick = (card: CardItem, tag: TagItem) => async () => {
    if (!this.result || !this.result.success) {
      return false;
    }

    if (!this.deleteTag) {
      return false;
    }

    if (this.disabled) {
      return false;
    }

    this.disabled = true;
    this.removing = {
      card,
      tag,
    };

    const result = await this.detachTag({
      translationCards: this.result.value,
      cardId: card.id,
      tag: tag,
    });

    this.disabled = false;
    this.removing = null;

    if (result.success) {
      this.result = result;
    }
  };

  private askForRatingContainer: HTMLDivElement;

  render() {
    const sourceLanguageSelector = this.result && this.result.success && (
      <select
        class="vocably-input-select"
        disabled={this.loading || this.disabled}
        onChange={(event) =>
          this.changeSourceLanguage.emit(
            (event.target as HTMLSelectElement).value
          )
        }
      >
        {Object.entries(languageList)
          .sort(sortLanguages(this.existingSourceLanguages))
          .map(([code, name]) => (
            <option selected={this.sourceLanguage === code} value={code}>
              {name}
            </option>
          ))}
      </select>
    );

    const targetLanguageSelector = this.result && this.result.success && (
      <select
        class="vocably-input-select"
        disabled={this.loading || this.disabled}
        onChange={(event) =>
          this.changeTargetLanguage.emit(
            (event.target as HTMLSelectElement).value
          )
        }
      >
        {Object.entries(languageList)
          .sort(sortLanguages(this.existingTargetLanguages))
          .map(([code, name]) => (
            <option selected={this.targetLanguage === code} value={code}>
              {name}
            </option>
          ))}
      </select>
    );

    const showDirect =
      this.result &&
      this.result.success &&
      isDirectNecessary(this.result.value);

    return (
      <Host data-test="translation-container">
        <div class="vocably-loading-container">
          {this.result === null && <vocably-spinner></vocably-spinner>}
          {this.result && this.result.success === false && (
            <div class="vocably-error">An error has occurred.</div>
          )}
          {this.result && this.result.success === true && (
            <Fragment>
              <div class="vocably-translation" data-test="translation">
                <div class="vocably-translation-section">
                  <div class="vocably-mb-12 vocably-language-selector">
                    <div class="vocably-language-wrapper">
                      {sourceLanguageSelector}
                    </div>
                    <vocably-icon-arrow-right class="vocably-from-to"></vocably-icon-arrow-right>
                    <div class="vocably-language-wrapper">
                      {targetLanguageSelector}
                    </div>
                  </div>
                  {showDirect && (
                    <div class="vocably-mb-12">
                      <div class="vocably-small vocably-muted vocably-mb-4">
                        ChatGPT thinks that{' '}
                      </div>
                      <span class="vocably-emphasized">
                        {isGoogleTTSLanguage(
                          this.result.value.translation.sourceLanguage
                        ) && (
                          <vocably-play-sound
                            text={this.phrase}
                            language={
                              this.result.value.translation.sourceLanguage
                            }
                            playAudioPronunciation={this.playAudioPronunciation}
                          />
                        )}
                        {this.phrase}
                      </span>{' '}
                      means <i>{this.result.value.translation.target}</i>
                    </div>
                  )}
                  <div
                    class="vocably-cards-container"
                    style={{ position: 'relative' }}
                  >
                    {this.showSaveHint && (
                      <vocably-add-card-hint
                        class={{
                          'vocably-cards-save-hint': true,
                          'vocably-cards-save-hint-hidden':
                            this.saveCardClicked,
                        }}
                      ></vocably-add-card-hint>
                    )}

                    <div class="vocably-cards" data-test="cards">
                      {this.result.value.cards.map((card, itemIndex) => (
                        <div data-test="card" class="vocably-card">
                          <div class="vocably-card-action">
                            {isCardItem(card) && (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                }}
                              >
                                <button
                                  class="vocably-card-action-button"
                                  title="Remove card"
                                  disabled={this.isUpdating !== null}
                                  onClick={() => {
                                    if (this.disabled) {
                                      return false;
                                    }

                                    this.saveCardClicked = true;
                                    if (this.addedItemIndex === itemIndex) {
                                      this.addedItemIndex = -1;
                                    }
                                    this.result.success === true &&
                                      this.removeCard.emit({
                                        translationCards: this.result.value,
                                        card,
                                      });
                                  }}
                                >
                                  {this.isUpdating === card && (
                                    <vocably-icon-spin></vocably-icon-spin>
                                  )}
                                  {this.isUpdating !== card && (
                                    <vocably-icon-remove></vocably-icon-remove>
                                  )}
                                </button>

                                <button
                                  class="vocably-card-action-button"
                                  title="Edit tags"
                                  disabled={this.isUpdating !== null}
                                  onClick={(e) => {
                                    if (this.disabled) {
                                      return;
                                    }

                                    e.target &&
                                      this.showTagMenu(
                                        e.target as HTMLElement,
                                        card.id
                                      );
                                  }}
                                >
                                  {this.isUpdating !== card && (
                                    <vocably-icon-tag></vocably-icon-tag>
                                  )}
                                </button>
                              </div>
                            )}
                            {isDetachedCardItem(card) && (
                              <button
                                class="vocably-card-action-button"
                                title="Add card"
                                disabled={this.isUpdating !== null}
                                onClick={() => {
                                  if (this.disabled) {
                                    return false;
                                  }

                                  this.saveCardClicked = true;
                                  if (this.addedItemIndex === -1) {
                                    this.addedItemIndex = itemIndex;
                                  }
                                  this.result.success === true &&
                                    this.addCard.emit({
                                      translationCards: this.result.value,
                                      card,
                                    });
                                }}
                              >
                                {this.isUpdating === card && (
                                  <vocably-icon-spin></vocably-icon-spin>
                                )}
                                {this.isUpdating !== card && (
                                  <vocably-icon-add></vocably-icon-add>
                                )}
                              </button>
                            )}
                          </div>
                          <div
                            class={{
                              'vocably-safe-action-area': true,
                              'vocably-card-hint-displayed':
                                itemIndex === 0 && this.showSaveHint,
                            }}
                          >
                            <vocably-card-source
                              card={card}
                              playAudioPronunciation={
                                this.playAudioPronunciation
                              }
                              class="vocably-mb-6"
                            ></vocably-card-source>
                            <vocably-card-definitions
                              class="vocably-mb-6"
                              card={card}
                            ></vocably-card-definitions>
                            {card.data.example && (
                              <div>
                                <div class="vocably-small vocably-mb-6">
                                  Example:
                                </div>
                                <vocably-card-examples
                                  example={card.data.example}
                                ></vocably-card-examples>
                              </div>
                            )}
                            {isItem(card) && card.data.tags.length > 0 && (
                              <div
                                class="vocably-mt-12"
                                style={{
                                  display: 'flex',
                                  gap: '6px',
                                  flexWrap: 'wrap',
                                }}
                              >
                                {card.data.tags.map((tagItem) => (
                                  <div class="vocably-tag">
                                    {tagItem.data.title}

                                    <button
                                      type="button"
                                      class="vocably-tag-remove-button"
                                      aria-label="Remove this tag from the card"
                                      title="Remove this tag from the card"
                                      onClick={this.detachTagClick(
                                        card,
                                        tagItem
                                      )}
                                    >
                                      {this.removing &&
                                        this.removing.card === card &&
                                        this.removing.tag === tagItem && (
                                          <vocably-icon-spin></vocably-icon-spin>
                                        )}
                                      {(!this.removing ||
                                        this.removing.card !== card ||
                                        this.removing.tag !== tagItem) && (
                                        <vocably-icon-remove class="vocably-tag-remove-button-icon"></vocably-icon-remove>
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {this.canCongratulate && (
                            <div
                              class={
                                'vocably-added-congratulation' +
                                (this.addedItemIndex === itemIndex
                                  ? ' vocably-added-congratulation-visible'
                                  : '')
                              }
                            >
                              <div class="vocably-added-congratulation-content">
                                <div class="vocably-added-congratulation-content-1">
                                  <vocably-first-translation-congratulation></vocably-first-translation-congratulation>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {this.askForRating && (
                    <div
                      class="vocably-rate-container"
                      ref={(el) => (this.askForRatingContainer = el)}
                    >
                      <div class="vocably-cards vocably-rate-padding vocably-mt-12">
                        <vocably-rate
                          platform={this.extensionPlatform}
                          onUserSelected={(choiceEvent) => {
                            switch (choiceEvent.detail) {
                              case 'review':
                              case 'feedback':
                                break;
                              case 'later':
                                this.askForRatingContainer.classList.add(
                                  'vocably-rate-container-hidden'
                                );
                                break;
                              case 'never':
                                this.askForRatingContainer.classList.add(
                                  'vocably-rate-container-hidden'
                                );
                                break;
                            }

                            this.ratingInteraction.emit(choiceEvent.detail);
                          }}
                        ></vocably-rate>
                      </div>
                    </div>
                  )}
                  {this.isFeedbackEnabled && !this.askForRating && (
                    <div class="vocably-mt-12 vocably-text-right vocably-small">
                      <a
                        href="https://app.vocably.pro/feedback"
                        target="_blank"
                        class="vocably-text-link"
                      >
                        Are you missing anything? Feel free to let me know.
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {this.loading && (
                <div class="vocably-reload" data-test="reload">
                  <vocably-spinner></vocably-spinner>
                </div>
              )}
            </Fragment>
          )}
        </div>
      </Host>
    );
  }
}
