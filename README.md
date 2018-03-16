"Nine-Ta-Five"
- Create a react web app for entry-level software jobs.
-Focus on precise results and clean UI/UX design. 

# Project Elements
-Webscraped entry-level software jobs from
 Dice.com, Indeed.com, and ZipRecruiter.com using node.
-Data was compiled in a JSON format once scraped, built MongoDB database, and used Mongoose to make local API to use data in React

# Getting Started
Please make sure you have the following installed.
-Node
-Mongo
-Robo 3t
-React and Redux
-Postman (optional)
-Mongoose

Mongo, Postman and Robo 3t were all downloaded from web
-Run Mongo: ./mongod --dbpath ~/mongo-data

All other dependencies are listed in the package.json file 
run command: npm install

cd into project folder
command line: node backend/indeed-scraper.js  
command line: node backend/dice-scraper.js  
command line: node backend/ziprecruiter-scraper.js  
AFTER run npm start

Access site from localhost in browser