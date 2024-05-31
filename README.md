# Northcoders News API

Link to hosted app: https://be-nc-news-backend-project.onrender.com/api

This phase of be-nc-news project demonstrates the use and a clear understanding of the core concepts of TDD, complex queries, advanced error handling, MVC, hosting, routing, promises and many more, with a complete of focus on backend development.

Instructions to Clone
    1. To clone the project go to https://github.com/umerxz/be-nc-news-backend-project.
    2. Copy the https url for the repo.
    3. In the terminal type, git clone <repo-url-here>
    4. change directory where the repo is cloned.

To install all relevant dependencies and devDependencies from package.json, run:
    npm install
    

To create the database run the command:
    npm run setup-dbs, 
After creating database, seed it with:
    npm run seed

To run the test files:
    1. npm test; will run all test cases in all test files.
    2. npm test <test-filename-here>; will only run the tests in the specified file.

Minimum Versions required
    1. Node.js 21.6.1
    2. Postgres 14.10

To connect to the databases:
    1. create 2 separate env files, for test and development.
    2. In each file use PGDATABASE=database_name, replacing the database_name with the name of the database to connect to.

--- 
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)