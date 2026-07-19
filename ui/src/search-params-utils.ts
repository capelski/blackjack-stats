import { useSearchParams } from 'react-router-dom';

export const modalQueryParamName = 'modal-id';

export const standThresholdParam = 't';

export const doublingParam = 'd';
export const splittingParam = 's';
export const doublingAfterSplitParam = 'das';
export const hitSplitAcesParam = 'hsa';
export const blackjackAfterSplitParam = 'bas';

export type ToggleParameterArguments = [string, string, string];

export const useSearchParamsUtils = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const deleteParameter = (paramName: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(paramName);
    setSearchParams(nextSearchParams);
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
    searchParams,
    setParameter,
    setSearchParams,
    toggleParameter,
    toggleParameters,
  };
};
