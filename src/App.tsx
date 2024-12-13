import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import './App.css';
import { theme } from './theme/theme';

interface Props {
  children: ReactNode;
}

function App({ children }: Props) {
  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
}

export default App;
