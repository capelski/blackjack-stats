import { HandCategory } from '../models/hand-category.model';

export type HandBase = {
  category: HandCategory;
  effectiveScore: number;
  label: string;
  scores: number[];
};
