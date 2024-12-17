import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/routes';
import { WalletConnectionProvider } from './components/WalletConnectionProvider';



function App() {
  return (
    <WalletConnectionProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </WalletConnectionProvider>
  );
}

export default App;