import { CSSProperties, PropsWithChildren } from 'react';

const overlayStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 100,
};

export type LoadingOverlayProps = PropsWithChildren<{
  loading: boolean;
}>;

export const LoadingOverlay: React.FC<LoadingOverlayProps> = props => {
  return (
    <div style={{ position: 'relative' }}>
      {props.loading && (
        <div style={overlayStyle}>
          <h1>🔄</h1>
        </div>
      )}

      {props.children}
    </div>
  );
};
