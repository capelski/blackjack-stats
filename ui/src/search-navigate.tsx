import { Navigate, NavigateProps } from 'react-router-dom';
import { useSearchParamsUtils } from './search-params-utils';

type SearchNavigateProps = Omit<NavigateProps, 'to'> & {
  to: string;
};

export const SearchNavigate: React.FC<SearchNavigateProps> = props => {
  const { searchString } = useSearchParamsUtils();

  return <Navigate replace {...props} to={{ pathname: props.to, search: searchString }} />;
};
