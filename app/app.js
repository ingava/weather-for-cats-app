window.onload = function(){

    //setting up global variables

    var long;
    var lat;
    var api;
    var units  = "&units=metric&"; // or "&units=imperial&"
    var apiKey = "appid=2006f597b15bf19bce8e2a81a90bc5c7";
    var url;
    var loc;
    var temp;

    // selecting DOM elements

    var cloudy      = document.getElementById("cloudy");
    var sunny       = document.getElementById("sunny");
    var snow        = document.getElementById("snow");
    var rainy       = document.getElementById("rainy");
    var temperature = document.getElementById("temperature");
    var unitsC      = document.getElementById("celsius");
    var unitsF      = document.getElementById("fahrenheit");

    //setting up promise function

    function get(url) {
        return new Promise(function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.onload = function(){
                if (xhttp.status == 200) {
                    resolve(JSON.parse(xhttp.response));
                } else {
                    reject(xhttp.statusText);
                }
            };
            xhttp.onerror = function(){
                reject(xhttp.statusText);
            };
            xhttp.send();
        });
    }

    // getting data from IP and Open Weather APIs

    var promise = get("http://ip-api.com/json");
    promise.then(function(locationData){
        loc  = locationData.city;
        lat  = locationData.lat;
        long = locationData.lon;
        api  = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long;
        url  = api + units + apiKey;
        return get(url);
    }).then(function(weatherData){
        console.log(url);
        var location = document.getElementById("location");
        location.textContent = loc + ", " + weatherData.sys.country;
        temp = Math.round(weatherData.main.temp);
        temperature.textContent = temp;
        console.log(weatherData.weather[0].main);
        if (weatherData.weather[0].main == "Rain" || weatherData.weather[0].main == "Drizzle" || weatherData.weather[0].main == "Thunderstorm") {
            rainy.className = "";
            rainy.style.display = "block";
            rainy.style.margin = "auto";
        } else if (weatherData.weather[0].main == "Snow") {
            snow.className = "";
            snow.style.display = "block";
            snow.style.margin = "auto";
        } else if (weatherData.weather[0].main == "Clear") {
            sunny.className = "";
            sunny.style.display = "block";
            sunny.style.margin = "auto";
        } else if (weatherData.weather[0].main == "Clouds") {
            cloudy.className = "";
            cloudy.style.display = "block";
            cloudy.style.margin = "auto";
        }
    }).catch(function(error){
        console.log(error);
    });

    //event handlers

    unitsC.addEventListener("click", function () {
        unitsC.style.display = "none";
        unitsF.style.display = "inline-block";
        toFahrenheit();
    });

    unitsF.addEventListener("click", function () {
        unitsF.style.display = "none";
        unitsC.style.display = "inline-block";
        temperature.textContent = temp;
    });
    
    function toFahrenheit() {
        temperature.textContent = Math.round(temp * 1.8 + 32);
    }
};
