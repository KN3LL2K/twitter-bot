var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var request = require('superagent');
const PORT = 8080;

var app = express();
var compiler = webpack(webpackConfig);
// var { shadesPalette } = require('./colorHelpers.js');
require('dotenv').config();

// console.log(shadesPalette('#DA5252'));
// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: webpackConfig.output.publicPath
// }))

// app.use(require('webpack-hot-middleware')(compiler));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// })

// app.listen(PORT, 'localhost', function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(`listening on ${PORT}`);
// });

var Twitter = require('twitter');

var config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

var T = new Twitter(config);

// var stream = T.stream('')

// var params = {
//   q: '@_KN3LL',
//   count: 10,
//   result_type: 'recent',
//   lang: 'en'
// }

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


// T.get('search/tweets', params, function(err, data, response) {
//   console.log('hello')
//   if (!err) {
//     let results = data.statuses;
//     // console.log(data.statuses[0].text);
//     for (let i = 0; i < results.length; i++) {
//       //for each result 'favorite it'
//       let tweet = results[i].text;
//       console.log(tweet);
//       // let id = { id: results[i].id_str };
//       // T.post('favorites/create', id, function(err, response) {
//       //   if (err) {
//       //     console.log(err[0].message);
//       //   } else {
//       //     let username = response.user.screen_name;
//       //     let tweetId = response.id_str;
//       //     console.log('favd', `https://twitter.com/${username}/status/${tweetId}`);
//       //   }
//       // });

//     }
//   } else {
//     console.log(err);
//   }
// })


