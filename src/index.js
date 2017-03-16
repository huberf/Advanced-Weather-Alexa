var alexa = require("alexa-app");
var r = require('requests');

var fetchCurrent = (place) => {
  var apiHead = 'https://api.forecast.io/forecast/';
  var apiKey = '';
  var loc = place;
  r.get(apiHead + apiKey + '/' + loc);
}

var weatherApp = new alexa.app('weather');
weatherApp.launch((req, res) => {
  res.say('I can tell you precise weather for any area. Try saying humidity in Sacramento California.').shouldEndSession(true).reprompt('I\'m ready for your query');
});
weatherApp.intent("Humidity",
    {
      "slots": [{"Location": "POST_LOCATION"}],
    },
    function(req, res) {
      var d = require('domain').create();
      d.on('error', function() {
        res.say('You may have uttered an incorrect city, but perhaps my logic has failed you. Please try again or try contacting the developer.');
        res.send();
      });
      d.run(function() {
        var weatherData = fetchCurrent(req.slot('Location'));
        var humidity = weatherData.currently.humidity;
        res.say(`The humidity is ${humidity}`);
        res.send();
      });
      return false;
    }
);
weatherApp.intent('AMAZON.HelpIntent',
    {},
    (req, res) => {
      res.say('You can use me to retrieve advanced weather data such as precise humidity, windspeed, etc. However, you must specify a city and state with all requests. Try saying humidity in Sacramento California.').shouldEndSession(false).remprompt('I\'m still listening.');
    }
);
weatherApp.intent("AMAZON.StopIntent",
  {
    "slots": [],
  },
  function(request, response) {
    console.log('Stopping skill');
    response.say("Goodbye.");
  }
);
weatherApp.intent("AMAZON.CancelIntent",
  {
    "slots": [],
  },
  function(request, response) {
    console.log('Cancelling skill');
    response.say("Cancelled.");
  }
);

exports.handler = weatherApp.lambda();
