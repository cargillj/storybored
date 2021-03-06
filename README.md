# StoryBored
### A *simple* blog-type web-application
---
[StoryBored](http://storybored.news) aims to provide an original, current, and unbiased take on pop-culture phenomena such as movies, television, comics, and music.

This web application is built upon the PEAN stack: PostgreSQL, Express, Angular, and Node.

### Current Features
- Article creation, editing, and deletion
- Article comment section via Disqus
- Image uploads to Cloudinary for use in articles
- Searchable article archive- Archive pagination
- Theme toggle
- Admin system
- User Registration
- Forgotten password/username emails

### Planned Features
- TBA

## Getting Started
---
Setup is very simple for those who would like to contribute.
### Table of Contents

- [Get Node.js](#get-node.js)
- [Create a PostgreSQL Database](#create-a-postgresql-database)
- [Create a Cloud with Cloudinary](#create-a-cloud-with-cloudinary)
- [Create a Mailgun Domain](#create-a-mailgun-domain)
- [Build the site distribution](#build-the-site-distribution)
- [Configure the Server](#configure-the-server)
- [Run the Server](#run-the-server)

### Get Node.js

The storybored server is built upon node. So you first need to install the [node package manager](https://nodejs.org/en/) (npm) 
for your operating system.

### Create a PostgreSQL Database

Storybored stores articles, user info, and comments in PostgreSQL tables. To work on StoryBored you will need to download a distribution of [postgreSQL](http://www.postgresql.org/download/) appropriate to your system. Secondly, you will need to [start a database](http://www.postgresql.org/docs/9.1/static/server-start.html) server with your distribution, and lastly, [create a database](http://www.postgresql.org/docs/9.1/static/server-start.html). As you set up your database take note to remember the hostname and port your database is being served from as we will need those later when setting up environment variables for the development server.

Next, we create the StoryBored specific tables in the database using [these queries](docs/db.md).


### Create a Cloud with Cloudinary

We use the Cloudinary cdn to store images that are linked to within articles.  This gives the writers access to all the image 
transformations that Cloudinary offers, giving them even more control over the look of their articles. To start your own 
development cloud [here](http://cloudinary.com/).

### Create a Mailgun Domain

We use the Mailgun email service to send emails for registration and forgotten credentials. You can create your mailgun account and domain [here](http://www.mailgun.com/).

### Build the Site Distribution
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
The server still needs to be supplied the connection string to your database, amongst other values.
Create the file `env.js` in `src/server` which will hold our environment variables.

```javascript
// env.js

process.env['CONNECTION_STRING'] = "pg://username:password@host:port/database_name";
process.env['CLOUDINARY_CLOUD_NAME'] = "your_cloudinary_cloud_name";
process.env['CLOUDINARY_API_KEY'] = "your_cloudinary_api_key";
process.env['CLOUDINARY_API_SECRET'] = "your_cloudinary_api_secret";
process.env['JWT_SECRET'] = "your_jwt_secret";
process.env['MAILGUN_API_KEY'] = "your_mailgun_api_key";
process.env['MAILGUN_DOMAIN'] = "your_mailgun_domain";
process.env['MAILGUN_FROM'] = "your_mailgun_email@domain";
process.env['PRERENDER_TOKEN'] = "your_prerender_token";
```

### Run the Server
Simply,
```
node server.js
```
That's it! You now should be serving a development instance of StoryBored from port 3000.
