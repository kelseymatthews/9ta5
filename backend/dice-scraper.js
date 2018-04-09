//list of dependencies

const MongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/JobList')
mongoose.Promise = global.Promise;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var request = require('request');
var cheerio = require('cheerio')
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('something is happening');
    next();
})

app.listen(port);
router.route('/jobs')

    .post(function (req, res) {

        var job = new Job();
        job.title = req.body.title;

        job.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Job created!' });
        });
    })

    //creating the ability to GET and query the API

    .get(function (req, res) {
        Job.find(function (err, jobs) {
            if (err)
                res.send(err);

            else if (req.query.location && req.query.title) {
                Job.find(function (err, jobs) {
                    var matchingBothJobs = []

                    if (err)
                        res.send(err);

                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].companyLocation.toLowerCase().includes(req.query.location) && jobs[i].jobTitle.toLowerCase().includes(req.query.title)) {
                            matchingBothJobs = matchingBothJobs.concat(jobs[i])
                        }
                    }
                    res.json(matchingBothJobs);
                });
            }
            else if (req.query.location) {
                Job.find(req.query.location, function (err, jobs) {
                    var matchingLocationJobs = []

                    if (err)
                        res.send(err);

                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].companyLocation.toLowerCase().includes(req.query.location)) {
                            matchingLocationJobs = matchingLocationJobs.concat(jobs[i])
                        }
                    }
                    res.json(matchingLocationJobs);
                });
            }
            else if (req.query.title) {
                Job.find(req.query.title, function (err, jobs) {
                    var matchingJobs = []

                    if (err)
                        res.send(err);

                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].jobTitle.toLowerCase().includes(req.query.title)) {
                            matchingJobs = matchingJobs.concat(jobs[i])
                        }
                    }
                    res.json(matchingJobs);
                });
            }
            else {
                res.json(jobs);
            }
        });
    });


app.use('/api', router);

var app = express();

var Job = mongoose.model('Job', {
    jobTitle: {
        type: String
    },
    jobLink: {
        type: String
    },
    companyName: {
        type: String
    },
    companyLocation: {
        type: String
    }
})

const urls = ['https://www.dice.com/jobs/q-junior-startPage-1-jobs', 'https://www.dice.com/jobs/q-junior-startPage-2-jobs', 'https://www.dice.com/jobs/q-junior-startPage-3-jobs', 'https://www.dice.com/jobs/q-junior-startPage-4-jobs', 'https://www.dice.com/jobs/q-junior-startPage-5-jobs', 'https://www.dice.com/jobs/q-junior-startPage-6-jobs', 'https://www.dice.com/jobs/q-junior-startPage-7-jobs', 'https://www.dice.com/jobs/q-junior-startPage-8-jobs', 'https://www.dice.com/jobs/q-junior-startPage-9-jobs', 'https://www.dice.com/jobs/q-junior-startPage-10-jobs', 'https://www.dice.com/jobs/q-junior-startPage-11-jobs', 'https://www.dice.com/jobs/q-junior-startPage-12-jobs', 'https://www.dice.com/jobs/q-junior-startPage-13-jobs', 'https://www.dice.com/jobs/q-junior-startPage-14-jobs', 'https://www.dice.com/jobs/q-junior-startPage-15-jobs', 'https://www.dice.com/jobs/q-junior-startPage-16-jobs', 'https://www.dice.com/jobs/q-junior-startPage-17-jobs', 'https://www.dice.com/jobs/q-junior-startPage-18-jobs', 'https://www.dice.com/jobs/q-junior-startPage-19-jobs', 'https://www.dice.com/jobs/q-junior-startPage-20-jobs']

//creation of the database

MongoClient.connect('mongodb://localhost:27017/JobList', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }

    console.log('Connected to MongoDB server')

    var jobList = [];

    for (let url of urls) {
        request(url, function (err, resp, body) {
            var $ = cheerio.load(body);

            var scrapedResults = [];

            $('div.serp-result-content').each(function (index, element) {
                scrapedResults.push($(element));
            });

            //setting and saving scraped data to the API SCHEMA

            for (var i = 0; i < scrapedResults.length; i++) {

                var individualJob = new Job({
                    jobTitle: scrapedResults[i].find('a.loggedInVisited > span').text(),
                    jobLink: 'https:dice.com' + scrapedResults[i].find('a.dice-btn-link').attr('href'),
                    companyName: scrapedResults[i].find('a.dice-btn-link > span[class="compName"]').first().text(),
                    companyLocation: scrapedResults[i].find('span[class="jobLoc"]').text()
                })
                
                individualJob.save().then((doc) => {
                    console.log('Saved job', doc);
                }), (e) => {
                    console.log('unable to save todo')
                }
            }
        });
    }
});
