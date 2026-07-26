import { DecisionOverridesMap } from '../types/decision-overrides.type';
import { HandResolver } from '../types/hand-resolution.type';

export const getOverridesResolver = (
  baseResolver: HandResolver,
  decisionOverrides: DecisionOverridesMap,
): HandResolver => {
  return function overridesResolver(hand) {
    const overriddenDecision = decisionOverrides[hand.labelAsInitial];

    // The overridden decision might not be available for the current hand. For example,
    // the player might choose to double "9" hands, but "9 (3+)" hands cannot be doubled.
    // In that case, we ignore the override and use the base resolver
    if (overriddenDecision && hand.consequences[overriddenDecision]) {
      return overriddenDecision;
    }

    return baseResolver(hand);
  };
};
