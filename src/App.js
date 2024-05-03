import Map from './Map/Map'
import Header from './Component/Header/Header'; 
import Footer from './Component/Footer/Footer';

function App() {
  return (
    <div  style={{ width: '100vw', height: '100vh' }}>
      <Header/>
      <Map/>
      <Footer/>
    </div>
  );
}

export default App;
