import { useSearchParams } from 'react-router-dom';

export const modalParamName = 'modal-id';

export const modeParamName = 'mode';

export const cardsFilterParamName = 'cf';

export const standThresholdParamName = 't';

export const doublingParamName = 'd';
export const splittingParamName = 's';
export const doublingAfterSplitParamName = 'das';
export const hitSplitAcesParamName = 'hsa';
export const blackjackAfterSplitParamName = 'bas';
export const surrenderingParamName = 'r';

export type ToggleParameterArguments = [string, string, string];

export const useSearchParamsUtils = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const deleteParameter = (paramName: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(paramName);
    setSearchParams(nextSearchParams);
  };

  const getParameter = <T extends string>(paramName: string, allowedValues?: T[]): T | null => {
    const value = searchParams.get(paramName);
    return value && (!allowedValues || allowedValues.includes(value as T)) ? (value as T) : null;
  };

  const setParameter = (paramName: string, paramValue: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(paramName, paramValue);
    setSearchParams(nextSearchParams);
  };

  const toggleParameter = (...[paramName, paramValue, defaultValue]: ToggleParameterArguments) => {
    toggleParameters([[paramName, paramValue, defaultValue]]);
  };

  const toggleParameters = (parameters: ToggleParameterArguments[]) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    parameters.forEach(([paramName, paramValue, defaultValue]) => {
      if (paramValue === defaultValue) {
        nextSearchParams.delete(paramName);
      } else {
        nextSearchParams.set(paramName, paramValue);
      }
    });

    setSearchParams(nextSearchParams);
  };

  return {
    deleteParameter,
    getParameter,
    searchParams,
    setParameter,
    setSearchParams,
    toggleParameter,
    toggleParameters,
  };
};
