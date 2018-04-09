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

const urls = ['https://www.indeed.com/jobs?q=software+developer&explvl=entry_level', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=10', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=20', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=30', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=40', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=50', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=60', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=70', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=80', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=90', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=100', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=110', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=120', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=130', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=140', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=150', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=160', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=170', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=180', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=190', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=200', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=210', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=220', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=230', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=240', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=250', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=260', 'https://www.indeed.com/jobs?q=software+developer&explvl=entry_level&start=270']

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

            var nonSponseredJobs = []

            $('td#resultsCol > div.row').each(function (index, element) {
                nonSponseredJobs.push($(element));
            });

            //setting and saving scraped data to the API SCHEMA

            for (var i = 0; i < nonSponseredJobs.length; i++) {

                var individualJob = new Job({
                    jobTitle: nonSponseredJobs[i].find('a[class="turnstileLink"]').text(),
                    jobLink: 'https:indeed.com' + nonSponseredJobs[i].find('a[class="turnstileLink"]').attr('href'),
                    companyName: nonSponseredJobs[i].find('span[class="company"]').text().replace('\n', '').replace('\n', ''),
                    companyLocation: nonSponseredJobs[i].find('span[class="location"]').text(),
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