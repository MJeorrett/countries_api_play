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
  populateBorderingCountries();
  var lastCountry = localStorage.lastCountry;
  if(lastCountry) {
    setSelectedCountry(lastCountry);
    setCountryInfo(lastCountry);
  }
};

var populateCountriesSelect = function(){
  var selectCountries = document.getElementById('countries-select');
  selectCountries.onchange = handleCountrySelected;

  var countryNames = countries.map( function( country ) {
    return country.name;
  });

  populateSelect( selectCountries, countryNames );
};

var populateBorderingCountries = function(countries){
  var selectBorderingCountries = document.querySelector('#bordering-countries-select');

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
  select.innerHTML = "<option value='' disabled selected>Select a bordering country</option>";
  stringList.forEach(function(string){
    var option = document.createElement('option');
    option.innerText = string;
    select.appendChild(option);
  });
}

var setCountryInfo = function( countryName) {
  var infoDiv = document.querySelector( '#country-info-holder' );
  infoDiv.innerText = "";
  setCountryInfoDiv( infoDiv, countryName );

  localStorage.lastCountry = countryName;
};

var setCountryInfoDiv = function( infoDiv, countryName ) {
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

window.onload = app;

})();
