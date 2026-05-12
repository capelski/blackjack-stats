export const CheckboxComponent: React.FC<{
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}> = ({ checked, disabled, label, onChange }) => {
  return (
    <label>
      <input
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
};
