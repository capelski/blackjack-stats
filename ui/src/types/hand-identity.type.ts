import { HandBase } from './hand.type';

export type HandIdentity = HandBase & {
  isNonActionable?: boolean;
};

export type HandIdentitySeed = Pick<HandIdentity, 'isNonActionable' | 'label' | 'scores'> & {
  splitLabel?: string;
};

export type HandIdentitiesMap = {
  [label: string]: HandIdentity;
};
