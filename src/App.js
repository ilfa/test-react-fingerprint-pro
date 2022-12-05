import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import {useRef, useState} from "react";

const publicApiKey = process.env.REACT_APP_FP_PUBLIC_KEY;
const behaviorPath = process.env.REACT_APP_FP_BEHAVIOR_PATH;
const downloadPath = process.env.REACT_APP_FP_DOWNLOAD_PATH;
const resultPath = process.env.REACT_APP_FP_RESULT_PATH;
const useCloudfront = process.env.REACT_APP_FP_USE_CLOUDFRONT;

console.log(useCloudfront, !!useCloudfront)

const loadOptions = useCloudfront ? {
    apiKey: publicApiKey,
    scriptUrlPattern: `/${behaviorPath}/${downloadPath}?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>`,
    endpoint: `/${behaviorPath}/${resultPath}`,
} : {
    apiKey: publicApiKey,
};

const wait = (time) => {
 return new Promise((resolve) => {
     setTimeout(resolve, time)
 });
}

function App() {
  const [data, updateData] = useState();
  const stat = useRef({});

  const doIdentification = async (fp, attempt) => {
      performance.mark(`identification${attempt}`)
      const result = await fp.get({extendedResult: true})
      performance.mark(`identification${attempt}-done`)
      const identificationDuration = performance.measure('identification', `identification${attempt}`, `identification${attempt}-done`)
      stat.current[`identification ${attempt} duration:`] = identificationDuration.duration;
      console.log(`identification ${attempt} duration:`, identificationDuration.duration)
      updateData(result);
  }

  const loadData = async () => {
      performance.mark('initiate-load')
      const fpPromise = FingerprintJS.load(loadOptions)
      const fp = await fpPromise
      performance.mark('agent-loaded')
      const loadingDuration = performance.measure('agent-loading', 'initiate-load', 'agent-loaded')
      stat.current['agent-loading'] = loadingDuration.duration
      console.log('agent loading duration:', loadingDuration.duration)
      await doIdentification(fp, 1);
      await wait(10000)
      await doIdentification(fp, 2);
      await wait(20000)
      await doIdentification(fp, 3);
      console.table(stat.current);
  }
  return (
    <div className="App">
      <button className="App-identifyButton" onClick={loadData}>Identify</button>
      <pre className="App-userData">{JSON.stringify(stat, null, ' ')}</pre>
      <pre className="App-userData">{JSON.stringify(data, null, ' ')}</pre>
    </div>
  );
}

export default App;
