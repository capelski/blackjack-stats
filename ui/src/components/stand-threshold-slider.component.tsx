type StandThresholdSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export const StandThresholdSlider: React.FC<StandThresholdSliderProps> = ({
  value,
  onChange,
}: StandThresholdSliderProps) => {
  return (
    <>
      <label>Stand threshold: {value}</label>
      <input
        type="range"
        min={4}
        max={20}
        step={1}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
      />
    </>
  );
};
