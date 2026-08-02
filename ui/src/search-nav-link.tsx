import { NavLink, NavLinkProps, NavLinkRenderProps } from 'react-router-dom';
import { useSearchParamsUtils } from './search-params-utils';

const getNavLinkStyle: (props: NavLinkRenderProps) => React.CSSProperties = ({
  isActive,
}): React.CSSProperties => ({
  marginRight: 16,
  fontWeight: isActive ? 'bold' : 'normal',
});

type SearchNavLinkProps = Omit<NavLinkProps, 'style' | 'to'> & {
  to: string;
};

export const SearchNavLink: React.FC<SearchNavLinkProps> = props => {
  const { children, ...rest } = props;

  const { getSearchString } = useSearchParamsUtils();
  const search = getSearchString();

  return (
    <NavLink {...rest} style={getNavLinkStyle} to={{ pathname: props.to, search }}>
      {children}
    </NavLink>
  );
};
