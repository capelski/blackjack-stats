import { useNavigate, useSearchParams } from 'react-router-dom';

export const modalParamName = 'modal-id';

export const matrixModeParamName = 'mm';

export const dealerCardModeParamName = 'dcm';

export const dealerSummaryModeParamName = 'dsm';

export const selectedActionParamName = 'a';

export const cardsFilterParamName = 'cf';

export const standThresholdParamName = 't';
export const softStandThresholdParamName = 'st';

export const doublingParamName = 'd';
export const splittingParamName = 's';
export const doublingAfterSplitParamName = 'das';
export const hitSplitAcesParamName = 'hsa';
export const blackjackAfterSplitParamName = 'bas';
export const surrenderingParamName = 'r';

export type ToggleParameterArguments = [string, string, string];

export const useSearchParamsUtils = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cleanSearchParams = new URLSearchParams(searchParams);
  cleanSearchParams.delete(cardsFilterParamName);
  cleanSearchParams.delete(selectedActionParamName);
  const searchString = cleanSearchParams.toString();

  const deleteParameter = (paramName: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(paramName);
    setSearchParams(nextSearchParams);
  };

  const getNumericParameter = (paramName: string): number | null => {
    const paramValue = getParameter(paramName);
    if (paramValue === null) {
      return null;
    }

    const parsedValue = Number(paramValue);
    return Number.isInteger(parsedValue) ? parsedValue : null;
  };

  const getParameter = <T extends string>(paramName: string, allowedValues?: T[]): T | null => {
    const value = searchParams.get(paramName);
    return value && (!allowedValues || allowedValues.includes(value as T)) ? (value as T) : null;
  };

  const navigateWithSearch = (pathname: string) => {
    navigate(
      {
        pathname,
        search: searchString,
      },
      { viewTransition: true },
    );
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

  const useUrlState = <T extends string>(
    paramName: string,
    defaultValue: T,
    allowedValues?: T[],
  ) => {
    const parameter = getParameter(paramName, allowedValues) ?? defaultValue;

    const setParameter = (nextValue: T) => {
      toggleParameter(paramName, nextValue, defaultValue);
    };

    return [parameter, setParameter] as const;
  };

  return {
    deleteParameter,
    getNumericParameter,
    getParameter,
    navigateWithSearch,
    searchParams,
    searchString,
    setParameter,
    setSearchParams,
    toggleParameter,
    toggleParameters,
    useUrlState,
  };
};
