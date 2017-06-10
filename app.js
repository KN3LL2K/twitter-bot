
require('dotenv').config();

var Twitter = require('twitter');

var config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

var T = new Twitter(config);

var params = {
  track: '@_KN3LL'
}

var currencies = {
  btc: 'BTC', bitcoin: 'BTC', eth:'ETH', ethereum: 'ETH', doge: 'DOGE'
}


T.stream('statuses/filter', params, function(stream) {
  console.log('listening')
  stream.on('data', function(tweet) {
    console.log(tweet.text, tweet.user.screen_name);
    var currency = tweet.text.split(' ')[1].toLowerCase();
    var user = tweet.user.screen_name
    if (currency !== undefined && currency in currencies) {
      console.log(currency);
      var from = currencies[currency];

      request.get(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=USD`).end(function(err, res) {
        console.log(res.body.USD);
        var value = res.body.USD || 0;
        if (!err) {
          T.post('statuses/update', {status: `@${user} have you heard about ${currency}? It's $${value}.`}, function(error, tweet, response) {
            if (error) {
              console.log(error);
            }
            console.log(tweet.in_reply_to_screen_name, currency, value);
          })
        } else {
          console.log(err);
        }
      })
    } else {
      console.log('nada');
      T.post('statuses/update', {status: `@${user} http://gph.is/1nFH9lL`}, function(error, tweet, response) {
            if (error) {
              console.log(error);
            }
            console.log(tweet.in_reply_to_screen_name);
          })
    }
  })

  stream.on('error', function(error) {
    //print out the error
    console.log(error);
  });
})


