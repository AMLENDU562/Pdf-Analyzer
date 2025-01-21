import './App.css';
import Prompt from './Components/Prompt';
const {BrowserRouter,Route,Routes}=require('react-router-dom')
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Prompt />}>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
