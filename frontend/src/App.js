import React from 'react';
import GourmetMap from './components/GourmetMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>新潟グルメマップ</h1>
      </header>
      <main>
        <GourmetMap />
      </main>
    </div>
  );
}

export default App;
