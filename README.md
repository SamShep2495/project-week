# Northcoders News API


Once this repo has been cloned, please add two files (.env.development & .env.test). These two should include PGDATABASE=THE_DATABASE_WE_ARE_WORKING_ON.

Then you will need to create some other .js files, these are for the app, controller and the models.

Some tests will need to be created to make sure our code is running correctly. This can be done by creating a file called app.test.js

First we will want to check that when we pull through the data for the topics, that the data gets pulled through in the correct format.

Second we will want to check that when we run just /api, it gives us a brief description of all the other /api/... we have ran and tested.

Third, we will want to check if our client input an article id number, that this article alone will pull through. A test will be needed to handle errors.


