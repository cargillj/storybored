# StoryBored
### A *simple* blog-type web-application
---
[StoryBored](http://ec2-52-89-99-183.us-west-2.compute.amazonaws.com:3000/) aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.

This web application is built upon the PEAN stack: PostgreSQL, Express, Angular, and Node.

## Getting Started
---
Setup is very simple for those who would like to contribute.
### Table of Contents

- [Create a PostgreSQL Database](#create-a-postgresql-database-)
- [Build the site distribution](#build-the-site-distribution-)
- [Configure the Server](#configure-the-server)
- [Run the Server](#run-the-server-)

### Create a PostgreSQL Database [](#create-postgres-database) 
Storybored stores articles, user info, and comments in PostgreSQL tables. To work on StoryBored you will need to download a distribution of [postgreSQL](http://www.postgresql.org/download/) appropriate to your system. Secondly, you will need to [start a database](http://www.postgresql.org/docs/9.1/static/server-start.html) server with your distribution, and lastly, [create a database](http://www.postgresql.org/docs/9.1/static/server-start.html). As you set up your database take note to remember the hostname and port your database is being served from as we will need those later when setting up environment variables for the development server.

Next, we create the StoryBored specific tables in the database using [these queries](docs/db.sql;).

### Build the Site Distribution [](#build-distribution)
Get the source code:
```
git clone https://github.com/cargillj/storybored.git
```
Install node dependencies:
```
cd storybored
npm install
cd src/server
npm install
```
This project is built using [gulp](http://gulpjs.com/). Note that the first install is for our gulp dependencies and the second is for the server's node dependencies.

Install bower components on the front-end
```
cd ../client/
bower install --save
```

Build the front-end distribution with gulp:
```
cd ../../
gulp dist
```

you now have a distribution of StoryBored located in `dist/`, but the server still needs to be configured to connect to your PostgreSQL database.

### Configure the Server
The server still needs to be supplied the connection string to your database. Create the file `env.js` in `src/server` which will hold our environment variables.

```javascript
// env.js

process.env['CONNECTION_STRING'] = "pg://your_server:port/database_name";
```

### Run the Server [](#run-server)
Simply,
```
node server.js
```
That's it! You now should be serving a development instance of StoryBored from port 3000.
