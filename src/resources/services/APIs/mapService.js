const getCoordinatesByLocation = (location) => {
    const query = encodeURIComponent(location)
    return fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
      .then(response => response.json())
}
  
const mapService = {
    getCoordinatesByLocation,
}
  
export default mapService