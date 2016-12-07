var MapWrapper = function(container, center, zoom){
  this.map = new google.maps.Map(
    container, 
    {
      center: center,
      zoom: zoom
    });
}

