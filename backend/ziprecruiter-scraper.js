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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log('something is happening');
    next();
})

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.listen(port);
console.log('Magic happens on the port' + port);


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

    .get(function (req, res) {
        Job.find(function (err, jobs) {
            if (err)
                res.send(err);

            if (req.query.title) {
                Job.find(req.query.title, function (err, jobs) {
                    var matchingJobs = []

                    if (err)
                        res.send(err);

                    for(var i = 0; i < jobs.length; i++) { 
                        if (jobs[i].jobTitle.toLowerCase().includes(req.query.title) ) { 
                            matchingJobs= matchingJobs.concat(jobs[i])
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


const urls = ['https://www.ziprecruiter.com/candidate/search?location=United%20States&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=2&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=3&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=4&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=5&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=6&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=7&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=8&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=9&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=10&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=11&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=12&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=13&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page14&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=15&search=Entry%20Level%20Developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=2&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=3&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=4&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=5&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=6&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=7&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=8&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=9&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=10&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=11&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=12&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=13&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=14&search=jr%20developer','https://www.ziprecruiter.com/candidate/search?location=United%20States&page=15&search=jr%20developer']



MongoClient.connect('mongodb://localhost:27017/JobList', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }

    console.log('Connected to MongoDB server')

    var jobList = [];

    for (let url of urls) {
        request(url, function (err, resp, body) {
            var $ = cheerio.load(body);

            var scrapedResults = []

            $('div.job_content').each(function (index, element) {
                scrapedResults.push($(element));
            });


            for (var i = 0; i < scrapedResults.length; i++) {
                
                jobList = jobList.concat({
                    jobTitle: scrapedResults[i].find('span.just_job_title').text(),
                    jobLink: scrapedResults[i].find('a.job_link').attr('href'),
                    companyName: scrapedResults[i].find('a.t_org_link').text(),
                    companyLocation: scrapedResults[i].find('a.t_location_link').text()
                });

                var individualJob = new Job ({
                    jobTitle: jobList[i].jobTitle,
                    jobLink: jobList[i].jobLink,
                    companyName: jobList[i].companyName,
                    companyLocation: jobList[i].companyLocation,
                })
                individualJob.save().then((doc) => {
                    console.log ('Saved job', doc);
                }), (e) => {
                    console.log('unable to save todo')
                }

                // db.collection('Jobs').insertOne({

                //     jobTitle: resultsArr[i].jobTitle,
                //     jobLink: resultsArr[i].jobLink,
                //     companyName: resultsArr[i].companyName,
                //     companyLocation: resultsArr[i].companyLocation,
                // }, (err, result) => {
                //     if (err) {
                //         return console.log('Unable to insert job', err);
                //     }
                //     console.log(JSON.stringify(result.ops, undefined, 2));
                // });
            }
        });
    }
});