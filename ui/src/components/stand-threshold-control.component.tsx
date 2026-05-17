import React from 'react';
import { useTranslation } from 'react-i18next';

type StandThresholdSliderProps = {
  disabled?: boolean;
  onChange: (value: number) => void;
  value: number;
};

const minValue = 4;
const maxValue = 20;

export const StandThresholdControl: React.FC<StandThresholdSliderProps> = ({
  disabled,
  onChange,
  value,
}: StandThresholdSliderProps) => {
  const { t } = useTranslation();
  const buttonStyle: React.CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    margin: '0 5px',
  };

  const updateValue = (newValue: number) => {
    if (newValue >= minValue && newValue <= maxValue) {
      onChange(newValue);
    }
  };

  return (
    <React.Fragment>
      <label>{t('standThresholdControl.label')}:</label>
      <button
        disabled={disabled || value <= minValue}
        onClick={() => updateValue(value - 1)}
        style={buttonStyle}
      >
        -
      </button>
      <span>{value}</span>
      <button
        disabled={disabled || value >= maxValue}
        onClick={() => updateValue(value + 1)}
        style={buttonStyle}
      >
        +
      </button>
    </React.Fragment>
  );
};
