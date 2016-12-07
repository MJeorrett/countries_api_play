(function(){

var countries = null;

var app = function(){

  var url = 'https://restcountries.eu/rest/v1/all';
  makeRequest(url, requestComplete);
}

var makeRequest = function(url, callBack){
  console.log(url);
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = callBack;
  request.send();
};

var requestComplete = function(){
  countries = JSON.parse(this.responseText)
  populateCountriesSelect();

};

var populateCountriesSelect = function(){
  var selectCountries = document.getElementById('countries-select');
  countries.forEach(function(country){
    var option = document.createElement('option');
    option.innerText = country.name;
    selectCountries.appendChild(option);
  });
}



window.onload = app;

})();
