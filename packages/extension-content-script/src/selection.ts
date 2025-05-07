import { MAX_SYMBOLS_TO_BE_TRANSLATED } from '@vocably/model';
import { isHtmlElement } from './isHtmlElement';

export const getSelection = (): Selection | null => {
  const globalSelection = window.getSelection();

  if (!globalSelection || globalSelection.toString() === '') {
    return null;
  }

  if (
    globalSelection.focusNode &&
    globalSelection.focusNode.nodeName === 'VOCABLY-POPUP' &&
    isHtmlElement(globalSelection.focusNode)
  ) {
    const translation = globalSelection.focusNode.querySelector(
      'vocably-translation'
    );
    if (!translation) {
      return null;
    }

    if (translation.shadowRoot && translation.shadowRoot['getSelection']) {
      return translation.shadowRoot['getSelection']();
    }

    return null;
  }

  return globalSelection;
};

export const isValidSelection = (
  selection: Selection | null
): selection is Selection => {
  if (selection === null) {
    return false;
  }

  if (selection.rangeCount === 0) {
    return false;
  }

  const clientRect = selection.getRangeAt(0).getBoundingClientRect();
  if (clientRect.height === 0 || clientRect.width === 0) {
    return false;
  }

  const text = selection.toString().trim();

  if (text === '') {
    return false;
  }

  if (text.length > MAX_SYMBOLS_TO_BE_TRANSLATED) {
    return false;
  }

  return true;
};
