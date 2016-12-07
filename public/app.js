(function(){

  var countries = null;
  var mapWrapper = null;

  window.onload = function(){
    var mapContainer = document.querySelector('#map-container');
    var center = { lat: 46.81, lng: 8.22 };
    mapWrapper = new MapWrapper(mapContainer, center, 6);

    var url = 'https://restcountries.eu/rest/v1/all';

    makeRequest(url, function(){
      countries = JSON.parse(this.responseText)
      populateCountriesSelect();
      populateBorderingCountries();
      var lastCountry = localStorage.lastCountry;
      if(lastCountry) {
        setSelectedCountry(lastCountry);
        setCountryInfo(lastCountry);
        var borderingCountries = getBorderingCountries(lastCountry);
        populateBorderingCountries(borderingCountries);
        moveMapToCountry( lastCountry );
      }
    });
  }

  var makeRequest = function(url, callBack){
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callBack;
    request.send();
  };

  var populateCountriesSelect = function(){
    var selectCountries = document.getElementById('countries-select');
    selectCountries.innerHTML = "<option value='' disabled selected>Select a country</option>";
    selectCountries.onchange = handleCountrySelected;

    var countryNames = countries.map( function( country ) {
      return country.name;
    });

    populateSelect( selectCountries, countryNames );
  };

  var populateBorderingCountries = function(countries){
    var selectBorderingCountries = document.querySelector('#bordering-countries-select');
    selectBorderingCountries.innerHTML = "<option value='' disabled selected>Select a bordering country</option>";
    selectBorderingCountries.onchange = handleBorderingCountrySelected;

    if(countries && countries.length > 0){
      selectBorderingCountries.disabled = false;
      var countryNames = countries.map(function(country){
        return country.name;
      });
      populateSelect(selectBorderingCountries, countryNames);
    }
    else {
      selectBorderingCountries.innerHTML = "<option value='' disabled selected>There are no bordering countries</option>";
      selectBorderingCountries.disabled = true;
    }

  };

  var populateSelect = function( select, stringList ) {
    stringList.forEach(function(string){
      var option = document.createElement('option');
      option.innerText = string;
      select.appendChild(option);
    });
  }

  var setCountryInfo = function( countryName) {
    var infoDiv = document.querySelector( '#country-info-holder' );
    populateCountryInfoDiv( infoDiv, countryName );

    localStorage.lastCountry = countryName;
  };

  var setBorderingCountryInfo = function( countryName ) {
    var infoDiv = document.querySelector( '#bordering-country-info-holder' );

    if (countryName ) {
      populateCountryInfoDiv( infoDiv, countryName );
    }
    else {
      infoDiv.innerHTML = "";
    }
  }

  var populateCountryInfoDiv = function( infoDiv, countryName ) {
    infoDiv.innerText = "";

    var country = getCountryByName( countryName );
    var ul = document.createElement( 'ul' );
    var dataDisplay = [ 'name', 'capital', 'population' ];

    dataDisplay.forEach( function( dataKey ) {
      var li = document.createElement( 'li' );
      var dataValue = country[dataKey];
      li.innerText = dataKey + ": " + dataValue;
      ul.appendChild( li );
    });

    infoDiv.appendChild( ul );
  };

  var setSelectedCountry = function(countryName){
    var selectCountries = document.querySelector('#countries-select');
    selectCountries.value = countryName;
  };

  var handleCountrySelected = function( ev ) {
    var countryName = ev.target.value;
    var borderingCountries = getBorderingCountries(countryName);
    setCountryInfo(countryName);

    populateBorderingCountries(borderingCountries);
    setBorderingCountryInfo( null );
    moveMapToCountry( countryName );
    mapWrapper.clearMarkers();
    mapWrapper.map.setZoom(6);
  }

  var handleBorderingCountrySelected = function( ev ) {
    var countryName = ev.target.value;
    setBorderingCountryInfo( countryName );
    dropMarkerOnCountry( countryName );
  }

  var getCountryByName = function( countryName ) {
    return countries.find( function( country ) {
      return country.name === countryName;
    });
  }

  var getBorderingCountries = function(countryName){
    var country = getCountryByName(countryName);
    var borderingCountryCodes = country.borders;
    var borderingCountries = countries.filter(function(country){
      var countryCode = country.alpha3Code;
      return borderingCountryCodes.includes(countryCode);
    })
    return borderingCountries;
  }

  var moveMapToCountry = function( countryName ) {
    var latLng = getLatLngOfCountryName(countryName);
    mapWrapper.map.setCenter( latLng );
  };

  var getLatLngOfCountryName = function( countryName ){
    var country = getCountryByName( countryName );
    var latLngArray = country.latlng;
    var latLng = {
      lat: latLngArray[0],
      lng: latLngArray[1]
    };
    return latLng;
  };

  var dropMarkerOnCountry = function( countryName ){
    var latLng = getLatLngOfCountryName( countryName );
    mapWrapper.addMarker( latLng );
  };

})();
