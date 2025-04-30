import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { mockOrders } from '../mockData';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Navigation, Compass, ArrowRight } from 'lucide-react';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const createDeliveryIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike" style="background-color: none; border-radius: 50%; padding: 8px;">
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  `;

  const iconUrl = 'data:image/svg+xml;base64,' + btoa(svg);

  return L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

L.Marker.prototype.options.icon = DefaultIcon;

function MapBoundsSetter({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;
    
    try {
      const bounds = new L.LatLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
      console.error('Error setting map bounds:', error);
    }
  }, [points, map]);

  return null;
}

function RoutingMachine({ 
  currentLocation, 
  destination,
  onNextDirectionUpdate 
}: { 
  currentLocation: [number, number];
  destination: [number, number];
  onNextDirectionUpdate: (nextDirection: string) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createRoutingControl = () => {
    if (!map || !currentLocation || !destination) return;

    try {
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current);
      }
      

      const control = L.Routing.control({
        waypoints: [
          L.latLng(currentLocation[0], currentLocation[1]),
          L.latLng(destination[0], destination[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: '#6366f1', weight: 6 }]
        },
        createMarker: () => null,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          timeout: 10000
        })
      });

      control.on('routingerror', (e) => {
        console.error('Routing error:', e.error);
        
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }

        retryTimeoutRef.current = setTimeout(() => {
          console.log('Retrying route calculation...');
          control.route();
        }, 5000);
      });

      control.on('routesfound', (e) => {
        try {
          const instructions = e.routes[0]?.instructions;
          if (instructions?.length > 0) {
            const nextInstruction = instructions[0].text;
            onNextDirectionUpdate(nextInstruction);
          }
        } catch (error) {
          console.error('Error processing route instructions:', error);
        }
      });

      control.addTo(map);
      routingControlRef.current = control;
    } catch (error) {
      console.error('Error creating routing control:', error);
    }
  };

  useEffect(() => {
    if (!map) return;

    const timeoutId = setTimeout(() => {
      createRoutingControl();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (routingControlRef.current && map) {
        try {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        } catch (error) {
          console.error('Error removing routing control:', error);
        }
      }
      
    };
  }, [map, currentLocation, destination]);

  return null;
}

function StreetLevelView({ center, bearing }: { center: [number, number]; bearing: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    try {
      map.setView(center, 18);
      // if (typeof map.setBearing === 'function') {
      //   map.setBearing(bearing);
      // }
    } catch (error) {
      console.error('Error updating street level view:', error);
    }
  }, [center, bearing, map]);
  
  return null;
}

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<'pending' | 'picked' | 'delivered'>('pending');
  const [bearing, setBearing] = useState(0);
  const [nextDirection, setNextDirection] = useState<string>('');
  const [showOverview, setShowOverview] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<[number, number] | null>(null);
  
  const order = mockOrders.find(o => o.id === orderId);

  useEffect(() => {
    const defaultLocation: [number, number] = [12.9716, 77.5946];
    setCurrentLocation(defaultLocation);

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocationError(null);
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          
          if (lastPositionRef.current) {
            try {
              const [prevLat, prevLng] = lastPositionRef.current;
              const [newLat, newLng] = newLocation;
              
              const dLng = newLng - prevLng;
              const y = Math.sin(dLng) * Math.cos(newLat);
              const x = Math.cos(prevLat) * Math.sin(newLat) -
                       Math.sin(prevLat) * Math.cos(newLat) * Math.cos(dLng);
              const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
              setBearing(bearing);
            } catch (error) {
              console.error('Error calculating bearing:', error);
            }
          }
          
          lastPositionRef.current = newLocation;
          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(
            error.code === 1 ? 'Location access denied. Please enable location services.' :
            error.code === 2 ? 'Location unavailable. Please try again.' :
            'Unable to get your location. Using default location.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );

      return () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      };
    } else {
      setLocationError('Geolocation is not supported by your browser. Using default location.');
    }
  }, []);

  if (!order || !currentLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Navigation className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (deliveryStatus === 'pending') {
      setDeliveryStatus('picked');
      setShowOverview(true);
    } else if (deliveryStatus === 'picked') {
      navigate('/delivery-completion');
    }
  };

  const destination = deliveryStatus === 'pending' 
    ? order.restaurantLocation 
    : order.ngoLocation;

  const visiblePoints = [
    currentLocation,
    order.restaurantLocation,
    order.ngoLocation
  ];

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <div className="bg-white shadow pl-[114px] pr-[114px] py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {deliveryStatus === 'pending' ? 'Heading to Restaurant' : 'Delivering to NGO'}
              </h2>
              <p className="text-sm text-gray-500">
                {deliveryStatus === 'pending' 
                  ? `Pickup from: ${order.restaurantName}`
                  : `Delivery to: ${order.ngoName}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverview(!showOverview)}
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
              >
                <Compass className="h-4 w-4" />
                {showOverview ? 'Street View' : 'Overview'}
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {deliveryStatus === 'pending' ? 'Mark as Picked Up' : 'Mark as Delivered'}
              </button>
            </div>
          </div>
        </div>

        {locationError && (
          <div className="absolute top-20 left-4 z-50 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{locationError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          <MapContainer
            center={currentLocation}
            zoom={showOverview ? 13 : 18}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker 
              position={currentLocation}
              icon={createDeliveryIcon()}
              // rotationAngle={bearing}
              // rotationOrigin="center"
            >
              <Popup>
                <div className="font-semibold">Your current location</div>
                <div className="text-sm text-gray-600">Live tracking enabled</div>
              </Popup>
            </Marker>
            
            <Marker 
              position={order.restaurantLocation}
              icon={new L.Icon({
                ...DefaultIcon.options,
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
              })}
            >
              <Popup>
                <div className="font-semibold">{order.restaurantName}</div>
                <div className="text-sm text-gray-600">{order.restaurantAddress}</div>
              </Popup>
            </Marker>
            
            <Marker 
              position={order.ngoLocation}
              icon={new L.Icon({
                ...DefaultIcon.options,
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
              })}
            >
              <Popup>
                <div className="font-semibold">{order.ngoName}</div>
                <div className="text-sm text-gray-600">{order.ngoAddress}</div>
              </Popup>
            </Marker>

            {showOverview ? (
              <MapBoundsSetter points={visiblePoints} />
            ) : (
              <StreetLevelView center={currentLocation} bearing={bearing} />
            )}

            <RoutingMachine
              currentLocation={currentLocation}
              destination={destination}
              onNextDirectionUpdate={setNextDirection}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;