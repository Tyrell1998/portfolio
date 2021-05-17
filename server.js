var fs = require("fs");
var log = require('fancy-log');
var helmet = require('helmet');
var express = require("express"),
    app = express(),
		server = require('http').createServer(app),
    //io = require("socket.io")(server),
    session = require("express-session"),
    bodyParser = require('body-parser');
var appconfig = require("dotenv");
appconfig.config();
app.use(helmet());
const version = process.env.VERSION;
const webport = process.env.WEB_PORT; //36662 == RR || 6969 == Developing CHANGE THIS BEFORE GOING LIVE
const seshsecret = process.env.SESSION_SECRET;
var sessiondata = {
    secret: seshsecret,
    saveUninitialized: false, // don't create session until something stored,
    resave: true, // don't save session if unmodified
    cookie: {
        maxAge: 86400000
    }
}

var sessionMiddleware = session(sessiondata);

function httpRedirect(req, res, next) {
	var userconnectip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (userconnectip == undefined){
		log("unable to parse Cloudflare/Nginx Ip Header..")
	}else{
		//log(`CONNECT: ${userconnectip}`);
	}
    if (req.headers['x-forwarded-proto'] === 'http') {
        res.redirect(`http://127.0.1.0:${webport}`);
    } else {
        next();
    }
}



app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//io.use(function(socket, next) {
//    sessionMiddleware(socket.request, socket.request.res, next);
//});

app.use("/", httpRedirect, express.static(__dirname+"/client/"));

//io.on("connection", function(socket) {
//    var file1 = require('./socket.js')(socket, io);
//});

server.listen(process.env.WEB_PORT || webport);
log(`*** ALPHA ${version}: Enjoy Your Coding & Development! ***`);
log(`Portfolio ONLINE on Port: ${webport} - navigate to 127.0.0.1:${webport} to view site"`);
