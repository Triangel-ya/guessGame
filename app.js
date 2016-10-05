var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
var session = require('express-session');

app.use(express.static('webTest01'));

app.use(session({
  	secret: 'secret',
  	resave: false,
  	saveUninitialized: false
}));

app.get("/",function(req,res){
	res.redirect('/login.html');
});

app.get("/login",function(req,res){
	var name = req.query.loginName;
	req.session.name = name;
	res.redirect('/home.html');
});

app.get("/loginName",function(req,res){
	var name = req.session.name;
	res.send(name);
});

io.on("connection",function(socket){
	socket.on("question",function(msg){
		console.log(msg);
		io.emit("answer",msg);
	});
	socket.on("canvas",function(msg){
		io.emit("makeCanvas",msg);
	});
})

server.listen(3000,function(){
	console.log('port 3000 is listening.');
});

