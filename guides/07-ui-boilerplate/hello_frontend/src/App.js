import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import NewAccount from './components/newAccount';
import './App.css';
import Transfer from "./components/transfer";
import Faucet from "./components/faucet";
import GetAccountDetails from "./components/getAccountDetails";
import Home from "./components/home";
import GetHello from "./components/getHello";
import SendHello from "./components/sendHello";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/newAccount' element={<NewAccount />} />
        <Route path='/transfer' element={<Transfer />} />
        <Route path='/faucet' element={<Faucet />} />
        <Route path='/getAccountDetails' element={<GetAccountDetails />} />
        <Route path='/getHello' element={<GetHello />} />
        <Route path='/sendHello' element={<SendHello />} />
      </Routes>
    </Router >

  );
}

export default App;
