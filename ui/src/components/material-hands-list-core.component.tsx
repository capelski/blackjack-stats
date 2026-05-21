import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { scoresToLabel } from '../logic/labels.logic';
import { serializeCards } from '../logic/material-hands.logic';
import { toDecimal, toPercentage } from '../logic/numbers.logic';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { MaterialHand } from '../types/material-hand.type';
import { HandsListItem, HandsListProps } from './material-hands-list-item.component';

const pageSize = 50;

const escapeCsvValue = (value: string | number): string | number => {
  if (typeof value === 'number') {
    return value;
  }

  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
};

type DownloadCsvOptions = {
  hands: MaterialHand[];
  t: (key: string) => string;
};

const downloadCsv = ({ hands, t }: DownloadCsvOptions): void => {
  const headers = [
    t('materialHandsList.cards'),
    t('commons.score'),
    t('commons.probability'),
    t('materialHandsList.betMultiplier'),
    t('commons.action'),
  ];

  const rows = hands.map(hand => {
    const row = [
      serializeCards(hand, ', '),
      scoresToLabel(hand.scores),
      hand.probability,
      hand.betMultiplier,
      t(`actions.${hand.action}`),
    ];

    return row.map(escapeCsvValue).join(',');
  });

  const csv = `${headers.map(escapeCsvValue).join(',')}\n${rows.join('\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hands.csv';
  link.click();
  URL.revokeObjectURL(url);
};

export type MaterialHandsListCoreProps = HandsListProps & {
  hands: MaterialHand[];
  nonFinalHandsControl?: boolean;
};

export const MaterialHandsListCore: React.FC<MaterialHandsListCoreProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { computing } = useStrategyContext();

  const [cardsFilter, setCardsFilter] = useState('');
  const [showNonFinalHands, setShowNonFinalHands] = useState(false);
  const [page, setPage] = useState(1);

  const updateCardsFilter = (value: string) => {
    setCardsFilter(value);
    setPage(1);
  };

  const updateShowNonFinalHands = (value: boolean) => {
    setShowNonFinalHands(value);
    setPage(1);
  };

  const filteredHands = useMemo(() => {
    const normalizedFilter = cardsFilter
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');

    return props.hands.filter(hand => {
      if (!showNonFinalHands && !hand.isFinal) {
        return false;
      }

      if (!normalizedFilter) {
        return true;
      }

      const symbols = serializeCards(hand);
      return symbols.includes(normalizedFilter);
    });
  }, [cardsFilter, props.hands, showNonFinalHands]);

  const pages = Math.max(1, Math.ceil(filteredHands.length / pageSize));
  const currentPage = Math.min(page, pages);
  const paginatedHands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHands.slice(start, start + pageSize);
  }, [currentPage, filteredHands]);

  return (
    <div className="hands-list">
      <p>
        {t('materialHandsList.cardsFilter')}
        <input
          disabled={computing}
          type="text"
          value={cardsFilter}
          onChange={event => updateCardsFilter(event.target.value)}
          placeholder={t('materialHandsList.cardsFilterPlaceholder')}
          style={{ marginLeft: 8 }}
        />
        {props.nonFinalHandsControl && (
          <React.Fragment>
            <input
              type="checkbox"
              checked={showNonFinalHands}
              onChange={event => updateShowNonFinalHands(event.target.checked)}
              style={{ marginLeft: 16 }}
              disabled={computing}
            />
            <span>{t('materialHandsList.nonFinalHands')}</span>
          </React.Fragment>
        )}
      </p>

      <p>
        {t('materialHandsList.numberOfHands')}: {filteredHands.length}
      </p>

      <p>
        <button disabled={computing || currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          {t('materialHandsList.previous')}
        </button>

        <span style={{ margin: '0 8px' }}>
          {t('materialHandsList.page', { current: currentPage, total: pages })}
        </span>

        <button
          disabled={computing || currentPage === pages}
          onClick={() => setPage(currentPage + 1)}
        >
          {t('materialHandsList.next')}
        </button>

        <button
          disabled={computing}
          onClick={() => downloadCsv({ hands: props.hands, t: key => t(key) })}
          style={{ marginLeft: 8 }}
        >
          💾 {t('materialHandsList.download')}
        </button>
      </p>

      <table style={{ width: '100%' }}>
        <thead>
          <HandsListItem
            {...props}
            action={t('commons.action')}
            betMultiplier={t('materialHandsList.betMultiplier')}
            cards={t('materialHandsList.cards')}
            isHeader={true}
            probability={t('commons.probability')}
            score={t('commons.score')}
          />
        </thead>

        <tbody>
          {paginatedHands.map((hand, index) => (
            <HandsListItem
              {...props}
              key={`${currentPage}-${index}-${hand.label}`}
              action={hand.action}
              betMultiplier={toDecimal(hand.betMultiplier, decimals)}
              cards={serializeCards(hand, ', ')}
              probability={toPercentage(hand.probability, decimals)}
              score={scoresToLabel(hand.scores)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
