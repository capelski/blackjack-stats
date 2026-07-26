import { HandCategory } from '../models/hand-category.model';

export type HandBase = {
  category: HandCategory;
  effectiveScore: number;
  label: string;
  /** When overriding actions users can only specify actions for initial/splittable pairs.
   * The labelAsInitial contains the label the hand would have it was an initial/splittable pair,
   * so the corresponding override can be applied to them
   */
  labelAsInitial: string;
  scores: number[];
};
