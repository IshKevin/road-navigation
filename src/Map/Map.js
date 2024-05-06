import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const Map = () => {
  const [directions, setDirections] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const mapRef = useRef(null);
  const startingPoint = { lat: -1.939826787816454, lng: 30.0445426438232 };
  const stops = [
    { lat: -1.9355377074007851, lng: 30.060163829002217 },
    { lat: -1.9358808342336546, lng: 30.08024820994666 },
    { lat: -1.9489196023037583, lng: 30.092607828989397 },
    { lat: -1.9592132952818164, lng: 30.106684061788073 },
    { lat: -1.9487480402200394, lng: 30.126596781356923 },
  ];
  const destination = { lat: -1.9365670876910166, lng: 30.13020167024439 };
  const mapContainerStyle = {
    width: '100%',
    height: '88vh',
  };

  const directionsCallback = (response) => {
    if (response !== null) {
      setDirections(response);
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const [directionsRequested, setDirectionsRequested] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStopIndex((prevStopIndex) => {
        if (prevStopIndex < stops.length - 1) {
          return prevStopIndex + 1;
        } else {
          clearInterval(interval);
          return prevStopIndex;
        }
      });
    }, 5000);

    setDirectionsRequested(true); // Request directions on component mount

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div className="route-info" style={{ position: 'absolute', top: 20, left: 20 }}>
        <div className="route-title">Nyabugogo - Kimironko</div>
        <div className="route-details">
          Next stop: {stops[currentStopIndex]?.name || 'Kimironko'} | Distance: 23 km | Time: 23 minutes
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={startingPoint}
        zoom={14}
        onLoad={onMapLoad}
      >
        {directionsRequested && (
          <DirectionsService
            options={{
              origin: startingPoint,
              destination,
              waypoints: stops.map((stop) => ({
                location: stop,
                stopover: true,
              })),
              travelMode: 'DRIVING',
              optimizeWaypoints: true,
            }}
            callback={directionsCallback}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
        <Marker position={startingPoint} />
        {stops.map((stop, index) => (
          <Marker
            key={index}
            position={stop}
            icon={index === currentStopIndex ? '/current-stop-marker.png' : '/stop-marker.png'}
          />
        ))}
        <Marker position={destination} />
      </GoogleMap>
    </div>
  );
};

export default Map;