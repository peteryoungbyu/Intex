require('dotenv').config();

const express = require("express");

//Needed for the session variable - Stored on the server to hold data
const session = require("express-session");

let path = require("path");


// Allows you to read the body of incoming HTTP requests and makes that data available on req.body
let bodyParser = require("body-parser");

let app = express();

// Use EJS for the web pages - requires a views folder and all files are .ejs
app.set("view engine", "ejs");

app.use(express.static('public'));

const port = process.env.PORT || 3000;


app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.urlencoded({ extended: true }));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "admin",
        database: process.env.RDS_DB_NAME || "intex",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false 
    }
});

app.use((req, res, next) => next());


app.get('/', (req, res) => {
    knex.select().from("users")
      .then(users => {
        console.log(`Successfully retrieved ${users.length} users from database`);
        res.render("index", {users: users});
      })
      .catch((err) => {
        console.error("Database query error:", err.message);
        res.render("index", {
          users: [],
          error_message: `Database error: ${err.message}. Please check if the 'users' table exists.`
        });
      });
    
});















app.listen(port, () => {
    console.log("The server is listening");
});

