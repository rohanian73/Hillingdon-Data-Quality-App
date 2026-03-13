// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DataProfiler from './components/DataProfiler';
import CorrectionLog from './components/CorrectionLog'

function App() {
  return (

    <div className='container'>
      <h1 className='pageTitle'>Hillingdon Data Quality Enhancement System</h1>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataProfiler/>} />
          <Route path="/correction_log" element={<CorrectionLog/>} />
        </Routes>
      </BrowserRouter>
         
    </div>
  );
}

export default App;
