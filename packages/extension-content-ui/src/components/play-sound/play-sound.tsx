import { Component, h, Host, Method, Prop, State } from '@stencil/core';
import {
  AudioPronunciationPayload,
  GoogleTTSLanguage,
  Result,
} from '@vocably/model';

@Component({
  tag: 'vocably-play-sound',
  styleUrl: 'play-sound.scss',
  shadow: true,
})
export class VocablyPlaySound {
  @Prop() text: string;
  @Prop() language: GoogleTTSLanguage;

  @Prop() playAudioPronunciation: (
    payload: AudioPronunciationPayload
  ) => Promise<Result<true>>;

  @State() isLoading: boolean = false;
  @State() isPlaying: boolean = false;
  @State() isPlayError: boolean = false;

  @Method()
  async play() {
    this.isLoading = true;
    const result = await this.playAudioPronunciation({
      text: this.text,
      language: this.language,
    });

    if (result.success === false) {
      this.isPlayError = true;
    }

    this.isLoading = false;
  }

  render() {
    return (
      <Host>
        <button
          class="vocably-play-sound-button"
          onClick={() => this.play()}
          disabled={this.isPlaying || this.isLoading || this.isPlayError}
          title={
            this.isPlayError
              ? `Unfortunately, Vocably is unable to play the audio pronunciation on this website due to its security policies`
              : undefined
          }
        >
          {!this.isPlayError && !this.isLoading && !this.isPlaying && (
            <vocably-icon-play-circle />
          )}
          {!this.isPlayError && (this.isLoading || this.isPlaying) && (
            <vocably-icon-volume-medium />
          )}
          {this.isPlayError && <vocably-icon-error />}
        </button>
      </Host>
    );
  }
}
