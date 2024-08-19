import { MutableRefObject } from "react";

export type TransportationMethod =
  | "walking"
  | "driving"
  | "biking"
  | "train"
  | "bus";

export const createCircles = (
  mapInstance: React.MutableRefObject<google.maps.Map | null>,
  circlesRef: React.MutableRefObject<google.maps.Circle[]>,
  markersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerElement[]
  >,
  geocodeLocation: google.maps.LatLng | null,
  transportation: Record<
    TransportationMethod,
    { selected: boolean; radius: number; color: string }
  >
) => {
  if (mapInstance.current) {
    circlesRef.current.forEach((circle) => {
      circle.setMap(null);
    });

    circlesRef.current = [];

    markersRef.current.forEach((marker) => {
      const method = marker.content?.textContent as TransportationMethod;
      if (!transportation[method]?.selected) {
        marker.map = null;
      }
    });

    markersRef.current = markersRef.current.filter(
      (marker) => marker.map !== null
    );

    Object.entries(transportation).forEach(
      ([method, { selected, radius, color }]) => {
        const transportationMethod = method as TransportationMethod;
        if (selected) {
          const circle = new google.maps.Circle({
            map: mapInstance.current,
            center: geocodeLocation,
            radius: Number(radius) * 1609.34,
            strokeColor: "#265728",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#4caf50",
            fillOpacity: 0.1,
          });

          circlesRef.current.push(circle);

          const labelElement = document.createElement("div");
          labelElement.textContent = method;
          labelElement.style.color = "#000821";
          labelElement.style.fontSize = "14px";
          labelElement.style.fontWeight = "bold";

          markersRef.current.forEach((marker) => {
            if (marker.content?.textContent === transportationMethod) {
              marker.map = null;
            }
          });

          const center = circle.getCenter() as google.maps.LatLng;
          const earthRadiusMeters = 6371000;
          const labelLat =
            center.lat() +
            ((radius * 1609.34) / earthRadiusMeters) * (180 / Math.PI);

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: labelLat, lng: center.lng() },
            content: labelElement,
            map: mapInstance.current,
          });

          if (!marker.map) {
            labelElement.remove();
          } else {
            markersRef.current.push(marker);
          }
        }
      }
    );
  }
};

export const goToAddress = (
  homeAddress: string,
  setGeocodeLocation: (location: google.maps.LatLng) => void,
  mapInstance: MutableRefObject<google.maps.Map | null>
) => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: homeAddress }, (results, status) => {
    if (status === "OK" && results) {
      const location = results[0].geometry.location;
      setGeocodeLocation(location);
      mapInstance.current?.setCenter(location);

      new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance.current,
        position: location,
        title: "Home Address",
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};
