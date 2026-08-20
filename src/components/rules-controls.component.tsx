import { useTranslation } from 'react-i18next';
import { isDoublingEnabled } from '../logic/rules.logic';
import { Doubling, doublingDisabled, sortedDoublingOptions } from '../models/doubling.model';
import { Rules } from '../types/rules.type';
import { CheckboxComponent } from './checkbox.component';

export type RulesControlsProps = {
  disabled?: boolean;
  rules: Rules;
  setRules: (rules: Rules) => void;
};

export const RulesControls: React.FC<RulesControlsProps> = props => {
  const { t } = useTranslation();

  const doublingEnabled = isDoublingEnabled(props.rules);
  const splittingEnabled = !!props.rules.splitting;

  return (
    <>
      <label>
        {t('rules.doubling')}:{' '}
        <select
          disabled={props.disabled}
          onChange={e => props.setRules({ ...props.rules, doubling: e.target.value as Doubling })}
          value={props.rules.doubling ?? doublingDisabled}
        >
          {sortedDoublingOptions.map(option => (
            <option key={option} value={option}>
              {t(`rules.doublingOptions.${option}`)}
            </option>
          ))}
        </select>
      </label>
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
