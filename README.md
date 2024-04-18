# Northcoders News API

Here is a link to my live server - https://project-week-sam-shep-news-room.onrender.com

This project is for me to build an API for the purpose of accessing application data programmatically.

So far I have developed the back end service. This will provide the information to the front end.

Once this repo has been cloned, please add two files (.env.development & .env.test). These two should include PGDATABASE=THE_DATABASE_WE_ARE_WORKING_ON.

I have downloaded a number of dependencies, these are:
    - dotenv
    - express
    - pg
    - pg-format
    - supertest
    
I have also downloaded jest, jest-extended and jest-sorted for the purpose of testing.

Then you will need to create some other .js files, these are for the app, controller and the models.

Some tests will need to be created to make sure our code is running correctly. This can be done by creating a file called app.test.js

I then developed a number of api request such as GET, POST, PATCH and DELETE. These have been added to app.js and for further description please see endpoints.json.

The minimum versions of Node.js, and Postgres needed to run the project.


