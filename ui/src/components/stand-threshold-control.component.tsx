import React from 'react';

type StandThresholdSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export const StandThresholdControl: React.FC<StandThresholdSliderProps> = ({
  value,
  onChange,
}: StandThresholdSliderProps) => {
  const buttonStyle: React.CSSProperties = {
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
      <button onClick={() => updateValue(value - 1)} style={buttonStyle}>
        -
      </button>
      <span>{value}</span>
      <button onClick={() => updateValue(value + 1)} style={buttonStyle}>
        +
      </button>
    </React.Fragment>
  );
};
