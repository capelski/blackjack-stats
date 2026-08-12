import { useTranslation } from 'react-i18next';
import { Rules } from '../types/rules.type';
import { CheckboxComponent } from './checkbox.component';

export type RulesCheckboxesProps = {
  disabled?: boolean;
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const RulesCheckboxes: React.FC<RulesCheckboxesProps> = props => {
  const { t } = useTranslation();

  const doublingEnabled = !!props.rules.doubling;
  const splittingEnabled = !!props.rules.splitting;

  return (
    <>
      <CheckboxComponent
        checked={doublingEnabled}
        disabled={props.disabled}
        label={t('rules.doubling')}
        onChange={checked => props.setRules({ ...props.rules, doubling: checked })}
      />
      <CheckboxComponent
        checked={splittingEnabled}
        disabled={props.disabled}
        label={t('rules.splitting')}
        onChange={checked => props.setRules({ ...props.rules, splitting: checked })}
      />
      <CheckboxComponent
        checked={!!props.rules.surrendering}
        disabled={props.disabled}
        label={t('rules.surrendering')}
        onChange={checked => props.setRules({ ...props.rules, surrendering: checked })}
      />
      <CheckboxComponent
        checked={doublingEnabled && splittingEnabled && !!props.rules.doublingAfterSplit}
        disabled={props.disabled || !doublingEnabled || !splittingEnabled}
        label={t('rules.doublingAfterSplit')}
        onChange={checked => props.setRules({ ...props.rules, doublingAfterSplit: checked })}
      />
      <CheckboxComponent
        checked={splittingEnabled && !!props.rules.hitSplitAces}
        disabled={props.disabled || !splittingEnabled}
        label={t('rules.hitSplitAces')}
        onChange={checked => props.setRules({ ...props.rules, hitSplitAces: checked })}
      />
      <CheckboxComponent
        checked={splittingEnabled && !!props.rules.blackjackAfterSplit}
        disabled={props.disabled || !splittingEnabled}
        label={t('rules.blackjackAfterSplit')}
        onChange={checked => props.setRules({ ...props.rules, blackjackAfterSplit: checked })}
      />
    </>
  );
};
