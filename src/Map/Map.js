// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
// import haversine from 'haversine';

// const Map = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });
//   const [directions, setDirections] = useState(null);
//   const [eta, setEta] = useState(null);
//   const [currentStopIndex, setCurrentStopIndex] = useState(0);

//   const stops = [
//     { lat: -1.9355377074007851, lng: 30.060163829002217 }, // Stop A
//     { lat: -1.9358808342336546, lng: 30.08024820994666 }, // Stop B
//     { lat: -1.9489196023037583, lng: 30.092607828989397 }, // Stop C
//     { lat: -1.9592132952818164, lng: 30.106684061788073 }, // Stop D
//     { lat: -1.9487480402200394, lng: 30.126596781356923 }, // Stop E
//   ];

//   const destination = { lat: -1.9365670876910166, lng: 30.13020167024439 }; // Kimironko

//  useEffect(() => {
//   if (navigator.geolocation) {
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const newLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setCurrentLocation(newLocation);

//         // Calculate distance and ETA to the next stop
//         const nextStop = stops[currentStopIndex];
//         let distanceToNextStop;
//         try {
//             distanceToNextStop = haversine(newLocation, nextStop, { unit: 'km' });
//             const averageSpeed = 30; // Assuming 30 km/h average speed
//             const etaInMinutes = (distanceToNextStop / averageSpeed) * 60;
//             setEta(etaInMinutes);
//         } catch (error) {
//             console.error('Error calculating distance:', error);
//             setEta(null); // Set ETA to null or a default value
//         }

//         // Check if the user has crossed the current stop
//         if (distanceToNextStop < 0.1) {
//             setCurrentStopIndex(currentStopIndex + 1);
//         }
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   } else {
//     console.log('Geolocation is not supported by this browser.');
//   }
// }, [currentStopIndex]);

//   const directionsCallback = (response) => {
//     if (response !== null) {
//       setDirections(response);
//     }
//   };

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyAx8IJCPxdQFspEr6QXBr1Ah-fXz9PuwCk',
//     libraries: ['places'],
//     loadingElement: <div>Loading...</div>,
//     language: 'en',
//     region: 'rw',
//   });

//   if (loadError) {
//     return <div>Error loading maps: {loadError.message}</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading maps</div>;
//   }

//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <GoogleMap center={currentLocation} zoom={14}>
//         {/* Add DirectionsService and DirectionsRenderer components */}
//         <DirectionsService
//           options={{
//             origin: currentLocation,
//             destination,
//             waypoints: stops.map((stop) => ({
//               location: stop,
//               stopover: true,
//             })),
//             travelMode: 'DRIVING',
//           }}
//           callback={directionsCallback}
//         />
//         {/* Display DirectionsRenderer if directions are available */}
//         {directions && <DirectionsRenderer directions={directions} />}
//         {/* Add Marker for currentLocation */}
//         <Marker position={currentLocation} />
//         {/* Add Marker components for the stops */}
//         {stops.map((stop, index) => (
//           <Marker
//             key={index}
//             position={stop}
//             icon={index === currentStopIndex ? '/current-stop-marker.png' : '/stop-marker.png'}
//           />
//         ))}
//       </GoogleMap>
//       {/* Display ETA for the next stop */}
//       {eta && (
//         <div style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: 'white', padding: 10 }}>
//           Next stop ETA: {Math.ceil(eta)} minutes
//         </div>
//       )}
//     </div>
//   );
// };

// export default Map;


import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import haversine from 'haversine';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });
  const mapRef = useRef(null);

  const stops = [
    { lat: -1.9355377074007851, lng: 30.060163829002217 }, // Stop A
    { lat: -1.9358808342336546, lng: 30.08024820994666 }, // Stop B
    { lat: -1.9489196023037583, lng: 30.092607828989397 }, // Stop C
    { lat: -1.9592132952818164, lng: 30.106684061788073 }, // Stop D
    { lat: -1.9487480402200394, lng: 30.126596781356923 }, // Stop E
  ];

  const destination = { lat: -1.9365670876910166, lng: 30.13020167024439 }; // Kimironko

  const mapContainerStyle = {
    width: '100vw',
    height: '88vh',
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        setMapCenter(newLocation); // Update map center

        // Calculate distance and ETA to the next stop
        const nextStop = stops[currentStopIndex];
        const distanceToNextStop = haversine(newLocation, nextStop, { unit: 'km' });
        if (!isNaN(distanceToNextStop)) {
          const averageSpeed = 30; // Assuming 30 km/h average speed
          const etaInMinutes = (distanceToNextStop / averageSpeed) * 60;
          setEta(etaInMinutes);

          // Check if the user has crossed the current stop
          if (distanceToNextStop < 0.1) {
            setCurrentStopIndex(currentStopIndex + 1);
          }
        }
      },
      (error) => {
        setError(error.message);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentStopIndex]);

  const directionsCallback = (response) => {
    if (response !== null) {
      setDirections(response);
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentLocation) {
    return <div>Loading current location...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={14}
      onLoad={onMapLoad}
    >
      <DirectionsService
        options={{
          origin: currentLocation,
          destination,
          waypoints: stops.map((stop) => ({
            location: stop,
            stopover: true,
          })),
          travelMode: 'DRIVING',
        }}
        callback={directionsCallback}
      />
      {directions && <DirectionsRenderer directions={directions} />}
      <Marker position={currentLocation} />
      {stops.map((stop, index) => (
        <Marker
          key={index}
          position={stop}
          icon={index === currentStopIndex ? '/current-stop-marker.png' : '/stop-marker.png'}
        />
      ))}
      {eta && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: 'white', padding: 10 }}>
          Next stop ETA: {Math.ceil(eta)} minutes
        </div>
      )}
    </GoogleMap>
  );
};

export default Map;