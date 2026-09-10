import { HandModifiers } from '../types/hand-modifiers.type';
import { Rules } from '../types/rules.type';
import { isDoublingEnabled } from './rules.logic';

export const areEqualModifiers = (a: HandModifiers, b: HandModifiers): boolean => {
  return (
    !!a.isBlackjack === !!b.isBlackjack &&
    !!a.isDoubleBet === !!b.isDoubleBet &&
    !!a.isSplit === !!b.isSplit &&
    !!a.isSurrender === !!b.isSurrender
  );
};

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

export const showHandModifiers = (rules: Rules): boolean => {
  return isDoublingEnabled(rules) || !!rules.splitting || !!rules.surrendering;
};
