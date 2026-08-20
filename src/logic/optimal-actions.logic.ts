import { Action } from '../models/action.model';

export type OptimalActionsRow = {
  /** Chosen action for each dealer card, in the same order as the dealer card columns */
  actions: Action[];
  labels: string[];
};

const haveSameActions = (row: OptimalActionsRow, otherRow: OptimalActionsRow): boolean => {
  return (
    row.actions.length === otherRow.actions.length &&
    row.actions.every((action, index) => action === otherRow.actions[index])
  );
};

/** Merges each run of consecutive rows that lead to the same actions for every dealer card.
 * Only consecutive rows are merged, so the display order of the hands is preserved */
export const compactRows = (rows: OptimalActionsRow[]): OptimalActionsRow[] => {
  return rows.reduce<OptimalActionsRow[]>((condensedRows, row) => {
    const previousRow = condensedRows[condensedRows.length - 1];

    if (previousRow && haveSameActions(previousRow, row)) {
      previousRow.labels.push(...row.labels);
      return condensedRows;
    }

    return [...condensedRows, { ...row, labels: [...row.labels] }];
  }, []);
};

/** Merged rows are labelled as the range of hands they represent. E.g. ['14', '15', '16'] => '14 - 16' */
export const getRowLabel = ({ labels }: OptimalActionsRow): string => {
  return labels.length > 1 ? `${labels[0]} - ${labels[labels.length - 1]}` : labels[0];
};
