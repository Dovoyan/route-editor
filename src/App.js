import logo from './logo.svg';
import './App.css';
import { MapComponent } from './components/MapComponent';
import { YMaps, Map } from 'react-yandex-maps';


function App() {

  return (
    <YMaps
    >
      <MapComponent />
    </YMaps>
  );
}

export default App;
