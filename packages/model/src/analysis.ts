import { GoogleLanguage } from './language';

export type Translation = {
  source: string;
  sourceLanguage: GoogleLanguage;
  target: string;
  targetLanguage: GoogleLanguage;
  partOfSpeech?: string;
  comesFromExplanation?: boolean;
  transcript?: string;
};

export type DirectAnalyzePayload = {
  source: string;
  target?: string;
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
  partOfSpeech?: string;
  transcript?: string;
  context?: string;
};

export type ReverseAnalyzePayload = {
  target: string;
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
};

export type AnalyzePayload = DirectAnalyzePayload | ReverseAnalyzePayload;

export const isDirectAnalyzePayload = (o: any): o is DirectAnalyzePayload => {
  return !(!o || !o.source || !o.targetLanguage);
};

export const isReverseAnalyzePayload = (o: any): o is DirectAnalyzePayload => {
  return !(!o || !o.target || !o.sourceLanguage || !o.targetLanguage);
};

export type AnalysisItem = {
  source: string;
  ipa?: string;
  definitions: string[];
  examples?: string[];
  translation: string;
  partOfSpeech?: string;
  g?: string;
};

export type ValidAnalysisItems = [AnalysisItem, ...AnalysisItem[]];

export type DirectAnalysis = {
  source: string;
  sourceLanguage: GoogleLanguage;
  targetLanguage: GoogleLanguage;
  explanation?: string;
  // ToDo: Remove
  translation: Translation;
  items: ValidAnalysisItems;
};

export type ReverseAnalysis = DirectAnalysis & {
  target: string;
  reverseTranslations: Translation[];
};

export type Analysis = DirectAnalysis | ReverseAnalysis;

export const isReverseAnalysis = (o: any): o is ReverseAnalysis => {
  return !(!o || !o.target || !o.reverseTranslations);
};
