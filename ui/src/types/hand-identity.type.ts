import { Consequence, ConsequencesMap } from './consequence.type';
import { HandBase } from './hand.type';

export type HandIdentity = HandBase & {
  isActionable: boolean;
};

export type HandIdentitySeed = Pick<HandBase, 'label' | 'scores'> & {
  isNonActionable?: boolean;
  splitLabel?: string;
};

export type HandIdentityWithConsequences = HandIdentity & {
  consequences: ConsequencesMap;
  selectedConsequence: Consequence;
};

export type HandIdentitiesMap = {
  [label: string]: HandIdentityWithConsequences;
};
