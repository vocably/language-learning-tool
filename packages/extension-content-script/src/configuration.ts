export type ContentScriptConfiguration = {
  askForRatingEnabled: boolean;
  displayMobileLookupButton: boolean;
  allowFirstTranslationCongratulation: boolean;
  webPaymentLink: string;
};

export let contentScriptConfiguration: ContentScriptConfiguration = {
  askForRatingEnabled: false,
  displayMobileLookupButton: false,
  allowFirstTranslationCongratulation: false,
  webPaymentLink: 'https://pay.rev.cat/urzlhwdgumkzxmbw/',
};

export const configureContentScript = (
  configuration: Partial<ContentScriptConfiguration>
) => {
  contentScriptConfiguration = {
    ...contentScriptConfiguration,
    ...configuration,
  };
};
