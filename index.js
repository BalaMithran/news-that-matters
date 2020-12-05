const googleTrends = require('google-trends-api');
const express = require('express');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('9fa58c9a2cc042eeb949b5f86428d65f');
const app = express()
const port = process.env.PORT || 3000
app.set('view engine', 'ejs')

// function newsapif(word) {
//     const NewsAPI = require('newsapi');
//     const newsapi = new NewsAPI('9fa58c9a2cc042eeb949b5f86428d65f');
//     newsapi.v2.topHeadlines({
//         q: word,
//         language: 'en'
//     }).then(response => {
//         return (response)
//     });
// }
// Variable Declarations
var authors = new Array();
var titles = new Array();
var descriptions = new Array();
var urls = new Array();
var imgurls = new Array();
var sources = new Array();
var googletrendsarray = new Array();
googletrendsarray = ["chefs", "taylor", "trump", "corona"]
var articlesreceived = 0;

function nf(thearrword) {
    newsapi.v2.topHeadlines({ q: thearrword, language: 'en' })
        .then(response => {
            var articles = response.articles;
            for (var i = 0; i < articles.length; i++) {
                sources.push(articles[i]["source"]["name"])
                authors.push(articles[i]["author"])
                titles.push(articles[i]["title"])
                descriptions.push(articles[i]["description"])
                urls.push(articles[i]["url"])
                imgurls.push(articles[i]["urlToImage"])
            }

            console.log(articles.length + "articles len");
            articlesreceived += articles.length;
            console.log(articlesreceived);
        });
}


function getDailyTrendsForDay(day) {
    googleTrends.dailyTrends({ trendDate: day, geo: 'US', })
        .then(function (results) {
            var resultsJSON = JSON.parse(results);
            var data = resultsJSON["default"];
            console.log(data);
            var dayData = data["trendingSearchesDays"][0];
            var searches = dayData["trendingSearches"];
            for (var j = 0; j < searches.length; j++) {
                var search = searches[j]
                googletrendsarray.push(search["title"]["query"])
            }
            console.log(googletrendsarray[0]);
            for (var k = 0; k < searches.length; k++) {
                console.log(articlesreceived);
                var thearrword = googletrendsarray[k]
                nf(thearrword)
            }
            // var k = 0;
            // while (articlesreceived < 2) {
            //     var thearrword = googletrendsarray[0]
            //     console.log(thearrword);
            //     nf(thearrword)
            //     k += 1
            // }



        })
        .catch(function (err) {
            console.error("Oh no an error in trends function!", err);
        })
}
let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// prints date in YYYY-MM-DD format
let fina = year + "-" + month + "-" + date
console.log(year + "-" + month + "-" + date);
getDailyTrendsForDay(new Date());


app.get('/', function (req, res) {

    res.render('homepage', { sources: sources, authors: authors, titles: titles, descriptions: descriptions, urls: urls, imgurls: imgurls })
})

app.post('/news', function (req, res) {

    res.render('home', { sources: sources, authors: authors, titles: titles, descriptions: descriptions, urls: urls, imgurls: imgurls })
})

app.post('/googletrendsdata', function (req, res) {

    res.render('trends', { googletrendsarray: googletrendsarray })
})



app.listen(port, () => { console.log("server runnning") })