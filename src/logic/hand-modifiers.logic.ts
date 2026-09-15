import { HandModifiers } from '../types/hand-modifiers.type';
import { Rules } from '../types/rules.type';
import { isDoublingEnabled, isSplittingEnabled } from './rules.logic';

export const areEqualModifiers = (a: HandModifiers, b: HandModifiers): boolean => {
  return (
    !!a.isBlackjack === !!b.isBlackjack &&
    !!a.isDoubleBet === !!b.isDoubleBet &&
    (a.splitCount ?? 0) === (b.splitCount ?? 0) &&
    !!a.isSurrender === !!b.isSurrender
  );
};

export const getHandModifiersOrder = (modifiers: HandModifiers): number => {
  const isRegularHand = !modifiers.isDoubleBet && !modifiers.isBlackjack && !modifiers.isSurrender;

  // Every split count gets its own band, as hands split a different number of times have a
  // different bet and must not be merged together
  const splitOrder = (modifiers.splitCount ?? 0) * 4;
  const otherCount = isRegularHand
    ? 1
    : modifiers.isBlackjack
      ? 2
      : modifiers.isDoubleBet
        ? 3
        : modifiers.isSurrender
          ? 4
          : 0;

  return splitOrder + otherCount;
};

/** Re-split hands tell how many splits they went through (e.g. "Split hand (x2)") */
const getSplitModifierText = (splitCount: number, translate: (key: string) => string): string => {
  const text = translate('modifiers.isSplit');

  return splitCount > 1 ? `${text} (x${splitCount})` : text;
};

export const getHandModifiersText = (
  handModifiers: HandModifiers,
  translate: (key: string) => string,
) => {
  const modifiers: string[] = [];

  if (handModifiers.isSurrender) {
    modifiers.push(translate('modifiers.isSurrender'));
  }

  if (handModifiers.splitCount) {
    modifiers.push(getSplitModifierText(handModifiers.splitCount, translate));
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
  return isDoublingEnabled(rules) || isSplittingEnabled(rules) || !!rules.surrendering;
};
