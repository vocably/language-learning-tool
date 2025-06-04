import { Webhook } from '@puzzmo/revenue-cat-webhook-types';
import { UserStaticMetadata } from '@vocably/model';

export const getPartialStaticMetadata = (
  action: Webhook
): Partial<UserStaticMetadata> => {
  let metadata: Partial<UserStaticMetadata> = {};

  if (
    action.event.type === 'INITIAL_PURCHASE' ||
    action.event.type == 'NON_RENEWING_PURCHASE'
  ) {
    metadata.premium = true;
  }

  if (action.event.type === 'EXPIRATION') {
    metadata.premium = false;
  }

  metadata.premium_status = action.event.type;
  metadata.premium_expiration_at_ms = action.event.expiration_at_ms;

  return metadata;
};
