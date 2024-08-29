import { MutableRefObject } from "react";

type Transportation = {
  [key: string]: {
    selected: boolean;
    radius: number;
  };
};

export const createCircles = (
  mapInstance: React.MutableRefObject<google.maps.Map | null>,
  circlesRef: React.MutableRefObject<google.maps.Circle[]>,
  markersRef: React.MutableRefObject<
    google.maps.marker.AdvancedMarkerElement[]
  >,
  geocodeLocation: google.maps.LatLng | null,
  transportation: Transportation
) => {
  if (mapInstance.current) {
    circlesRef.current.forEach((circle) => {
      circle.setMap(null);
    });

    circlesRef.current = [];

    markersRef.current.forEach((marker) => {
      const method = marker.content?.textContent;
      if (method && !transportation[method]?.selected) {
        marker.map = null;
      }
    });

    markersRef.current = markersRef.current.filter(
      (marker) => marker.map !== null
    );

    Object.entries(transportation).forEach(([method, { selected, radius }]) => {
      if (selected && geocodeLocation) {
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
          if (marker.content?.textContent === method) {
            marker.map = null;
          }
        });

        const center = circle.getCenter();
        if (center) {
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
        } else {
          console.error("Circle center is undefined.");
        }
      }
    });
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
