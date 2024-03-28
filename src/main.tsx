import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { getLocalStorage } from './utils/storage/localStorageUtils.ts';
import { isTokenActive } from './utils/storage/isTokenActive.ts';
import { store } from './store/index.ts';
import { autoLogin } from './store/accounts/accounts.slice.ts';
import { Provider } from 'react-redux';

const token = getLocalStorage('authToken');
if (typeof token === 'string') {
  if (isTokenActive(token)) {
    store.dispatch(autoLogin(token));
  }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);