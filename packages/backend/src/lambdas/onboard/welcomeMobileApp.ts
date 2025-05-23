import { Result } from '@vocably/model';

import { get } from 'lodash-es';
import { send } from './brevo';

const templates = {
  ru: 7,
  uk: 9,
};

const defaultTemplate = 3;

export const welcomeMobileApp = async (
  email: string,
  language: string
): Promise<Result<any>> => {
  return send({
    email,
    templateId: get(templates, language, defaultTemplate),
  });
};
