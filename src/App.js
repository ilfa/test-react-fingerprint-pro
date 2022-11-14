import './App.css';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';

function App() {
  const {
    getData,
    data,
  } = useVisitorData({extendedResult: true}, { immediate: false });

  const updateData = () => {
      getData({ignoreCache: true})
  }
  return (
    <div className="App">
      <button className="App-identifyButton" onClick={updateData}>Identify</button>
      <pre className="App-userData">{JSON.stringify(data, null, ' ')}</pre>
    </div>
  );
}

export default App;
