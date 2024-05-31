# <span style="color:red">Northcoders</span> News API

<h2 style="border-bottom:0px"> <u>Project Description</u> </h2>
This phase of be-nc-news project demonstrates the use and a clear understanding of the core concepts of TDD, complex queries, advanced error handling, MVC, hosting, routing, promises and many more, with a complete of focus on backend development.

The project provides some endpoints to interact with the various topics, articles, users and comments about NC News. All available endpoints can be found in the **endpoints.json** file.

>*The hosted API can be accessed at the following URL: [NC News Backend API](https://be-nc-news-backend-project.onrender.com/api)*
---
## Getting Started
### 1. Cloning Project

In the terminal, run the following commands
```
    git clone https://github.com/umerxz/be-nc-news-backend-project.git
    cd be-nc-new-backened-project
```
### 2. Installation
To install all relevant dependencies and devDependencies from package.json, run
```    
npm install
```
This will install the following setted up dependencies

| Dependencies | devDependencies |
|--------------|-----------------| 
| husky | jest |
| dotenv | jest-extended |
| express | jest-sorted |
| pg | supertest |
| pg-format ||

---

### 3. Database

To connect to the databases:

    1. create 2 files, .env.test and .env.development, for test and development.
    2. In each file use PGDATABASE=database_name, replacing the database_name with the name of the database to connect to.

To create and seed the database run the following commands  
```
npm run setup-dbs
npm run seed
````

### 4. Testing

To run all the test files and test cases, issue the command:
```
npm test 
``` 
>to run tests for a specific file, just add the test filename at the end of the above command.
### Minimum Versions required: 
` Node.js 21.6.1 Postgres 14.10 `

--- 
---
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [<span style="color:red">Northcoders</span>](https://northcoders.com/)