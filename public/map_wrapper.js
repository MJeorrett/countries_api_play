var MapWrapper = function(container, center, zoom){
  this.map = new google.maps.Map(
    container, 
    {
      center: center,
      zoom: zoom
    });
  this.markers = [];
};

MapWrapper.prototype = {

  addMarker: function( latLng ){
    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });
    this.markers.push(marker);

    var bounds = new google.maps.LatLngBounds();
    this.markers.forEach(function(marker){
      bounds.extend(marker.getPosition());
    });
    bounds.extend(this.map.getCenter());
    this.map.fitBounds(bounds);
  },

  clearMarkers: function() {
    this.markers.forEach(function(marker){
      marker.setMap(null);
    })
    this.markers = [];
  }

};
