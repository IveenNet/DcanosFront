import App from './App';
import './App.css';
import { AppRouter } from './AppRouter';
import { GlobalProvider } from './context/global.provider';
import ErrorBoundary from './ErrorBoundary';

function AppHookContainer() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <App>
          <AppRouter />
        </App>
      </GlobalProvider>
    </ErrorBoundary>
  );
}

export default AppHookContainer;
