import { HandModifiers } from '../types/hand-modifiers.type';

export const getHandModifiersText = (
  handModifiers: HandModifiers,
  translate: (key: string) => string,
) => {
  const modifiers: string[] = [];

  if (handModifiers.isSurrender) {
    modifiers.push(translate('modifiers.isSurrender'));
  }

  if (handModifiers.isSplit) {
    modifiers.push(translate('modifiers.isSplit'));
  }

  if (handModifiers.isBlackjack) {
    modifiers.push(translate('modifiers.isBlackjack'));
  }

  if (handModifiers.isDoubleBet) {
    modifiers.push(translate('modifiers.isDoubleBet'));
  }

  return modifiers.join(', ') || '-';
};
