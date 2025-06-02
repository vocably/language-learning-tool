export type Platform =
  | 'ios'
  | 'android'
  | 'chromeExtension'
  | 'safariExtension';
export type RateInteractionPayload = 'never' | 'later' | 'feedback' | 'review';
export type RateResponse = {
  response: RateInteractionPayload;
  isoDate: string;
};

export type OnboardingFlow = {
  allowed: boolean;
  extensionSent: boolean;
  mobileAppSent: boolean;
  language: string | null;
};

export type UsageStats = {
  lastLookupTimestamp: number;
  totalLookups: number;
};

export type UserMetadata = {
  onboardingFlow: OnboardingFlow;
  rate: Record<Platform, RateResponse | undefined>;
  usageStats: UsageStats;
};

export type PartialUserMetadata = {
  rate?: Partial<UserMetadata['rate']>;
  onboardingFlow?: Partial<UserMetadata['onboardingFlow']>;
  usageStats?: Partial<UserMetadata['usageStats']>;
};

export const defaultUserMetadata: UserMetadata = {
  onboardingFlow: {
    allowed: false,
    extensionSent: true,
    mobileAppSent: true,
    language: null,
  },
  rate: {
    ios: undefined,
    android: undefined,
    chromeExtension: undefined,
    safariExtension: undefined,
  },
  usageStats: {
    lastLookupTimestamp: 0,
    totalLookups: 0,
  },
};

export const mergeUserMetadata = (
  md1: UserMetadata,
  md2: PartialUserMetadata
): UserMetadata => {
  return {
    ...md1,
    ...md2,
    rate: {
      ...md1.rate,
      ...md2.rate,
    },
    onboardingFlow: {
      ...md1.onboardingFlow,
      ...md2.onboardingFlow,
    },
    usageStats: {
      ...md1.usageStats,
      ...md2.usageStats,
    },
  };
};

export const mapUserMetadata = (metadata: any): UserMetadata => {
  return mergeUserMetadata(defaultUserMetadata, metadata);
};
