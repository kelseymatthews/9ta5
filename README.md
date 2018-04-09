# Nine-Ta-Five

Nine-Ta-Five is a user friendly simple UX/UI designed website where users can browse through entry level software development jobs

# Prerequisites 

Mongo , Robo 3t  and  Postman (optional) 

# Getting Started

Run Mongo
````
./mongod --dbpath ~/mongo-data
````
From Code Editor
````
npm install
````
````
node backend/indeed-scraper.js 
````
````
node backend/dice-scraper.js 
````
````
node backend/ziprecruiter-scraper.js
````
````
npm start
````

# Database & API Connection
````
var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('something is happening');
    next();
})

app.listen(port);
console.log('Magic happens on the port' + port);

router.route('/jobs')
````

# Initial API Call
````
componentDidMount() {
    axios.get('http://localhost:8080/api/jobs')
        .then(response => {
            console.log('api loaded successfully');

            let apiResponse = response.data;
            console.log(apiResponse);

            this.props.sendAPIToRedux(apiResponse);
        })
}
````

# Pagination
````
this.state = {
    currentPage: 1,
    jobsPerPage: 25,
    disableButton: false
}

const indexOfLastJob = this.state.currentPage * this.state.jobsPerPage;
const indexOfFirstJob = indexOfLastJob - this.state.jobsPerPage;
const currentJobs = this.props.jobResults.slice(indexOfFirstJob, indexOfLastJob);

const pageNumbers = [];
for (let i = 1; i <= Math.ceil(this.props.jobResults.length / this.state.jobsPerPage); i++) {
    pageNumbers.push(i);
}
var buttonClasses = classNames({
    'previous-page-button': true,
    'btn': true,
    'disabled': this.state.currentPage == 1
});
````
        
# Built With

Cherrio , Node.js , React and Redux , Mongo and Mongoose

