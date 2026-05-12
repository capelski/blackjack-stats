import React from 'react';

type StandThresholdSliderProps = {
  disabled?: boolean;
  onChange: (value: number) => void;
  value: number;
};

export const StandThresholdControl: React.FC<StandThresholdSliderProps> = ({
  disabled,
  onChange,
  value,
}: StandThresholdSliderProps) => {
  const buttonStyle: React.CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    margin: '0 5px',
  };

  const updateValue = (newValue: number) => {
    if (newValue >= 4 && newValue <= 20) {
      onChange(newValue);
    }
  };

  return (
    <React.Fragment>
      <label>Stand threshold:</label>
      <button disabled={disabled} onClick={() => updateValue(value - 1)} style={buttonStyle}>
        -
      </button>
      <span>{value}</span>
      <button disabled={disabled} onClick={() => updateValue(value + 1)} style={buttonStyle}>
        +
      </button>
    </React.Fragment>
  );
};
