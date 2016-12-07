(function(){

var countries = null;

var app = function(){

  var url = 'https://restcountries.eu/rest/v1/all';
  makeRequest(url, requestComplete);
}

var makeRequest = function(url, callBack){
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = callBack;
  request.send();
};

var requestComplete = function(){
  countries = JSON.parse(this.responseText)
  populateCountriesSelect();
  var lastCountry = localStorage.lastCountry;
  if(lastCountry) {
    setSelectedCountry(lastCountry);
    setCountryInfo(lastCountry);
  }
};

var populateCountriesSelect = function(){
  var selectCountries = document.getElementById('countries-select');
  selectCountries.onchange = handleCountrySelected;
  countries.forEach(function(country){
    var option = document.createElement('option');
    option.innerText = country.name;
    selectCountries.appendChild(option);
  });
}

var setCountryInfo = function(countryName){
  var infoDiv = document.querySelector( '#country-info-holder' );
  infoDiv.innerText = "";
  var ul = document.createElement( 'ul' );
  var country = getCountryByName( countryName );
  var dataDisplay = [ 'name', 'capital', 'population' ];

  dataDisplay.forEach( function( dataKey ) {
    var li = document.createElement( 'li' );
    var dataValue = country[dataKey];
    li.innerText = dataKey + ": " + dataValue;
    ul.appendChild( li );
  });
  infoDiv.appendChild( ul );

  localStorage.lastCountry = countryName;
}

var setSelectedCountry = function(countryName){
  var selectCountries = document.querySelector('#countries-select');
  selectCountries.value = countryName;
};

var handleCountrySelected = function( ev ) {
  var countryName = ev.target.value;
  setCountryInfo(countryName);
}

var getCountryByName = function( countryName ) {
  return countries.find( function( country ) {
    return country.name === countryName;
  });
}

window.onload = app;

})();
