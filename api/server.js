const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
//creates a middleware that can stick in the stack for finding cookie
const session = require("express-session");
//to store session data in the database, call with instance of express'session that gives the instance of knexsessionstore.
const KnexSessionStore= require('connect-session-knex')(session);


const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router");

const server = express();

const sessionConfig = {
  name:'monkey',
  secret:'keep it secret',//crypto sign the cookie
  cookie:{
    //how old could cookie be before its considered expired
    maxAge: 60 * 60 * 1000,
    secure:false,
    httpOnly:true
  },
  resave:false,//avoids recreating sessions that havn't changed
  saveUninitialized:false, //to comply with GDPR laws
  //make the configured instance of knexsession to use knex to store session data in db
  store:new KnexSessionStore({
    //pass it configured instance of knex
    knex: require('../database/connection'),
    tablename: 'sessions',
    sidfieldname:'sid',
    createtable:true,//create it automaticly if session table doesn't exist
    clearInterval:60 * 60 * 1000 //in ms
  })
}
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use("/api/auth",authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
