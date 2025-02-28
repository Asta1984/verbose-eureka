import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/routes';
import { WalletConnectionProvider } from './components/WalletConnectionProvider';
import { ThemeProvider } from './components/ui/theme-provider';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  return (
    <ThemeProvider>
      <WalletConnectionProvider> 
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </WalletConnectionProvider>
  </ThemeProvider>
  );
}

export default App;