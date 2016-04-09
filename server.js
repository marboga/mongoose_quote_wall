var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotes');

var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var quoteSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quote: { type: String, required: true },
	time : { type : Date, default: Date.now },
	likes: 0,
})
mongoose.model('Quote', quoteSchema);
var Quote = mongoose.model('Quote');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index', {err: req.err});
})
app.post('/main', function(req, res){
	console.log('this is data posted: ',req.body);
	var quote = new Quote({name: req.body.name, quote: req.body.quote, likes: 0});
	quote.save(function(err){
		if (err){
			console.log('error occurred! beep beep');
			res.render('index', {err: err});
		}else{
			res.redirect('/main');
		}
	})
})
app.get('/main', function(req, res){
	console.log('quotes page');
	Quote.find({}).sort({likes: 'asc'}).exec(function(err, quotes){
		if (err){
			console.log('error')
		}else{
			console.log(quotes);
			res.render('main', {quotes: quotes})
		}
	})
})
app.get('/like/quote', function(req, res){
	console.log(req.param('id'));
	var quote_id = req.param('id');
	Quote.update({_id: quote_id}, {$inc: {likes: +1}}, function(err){
		if (err){
			console.log('big whoopsie here');
		}else{
			res.redirect('/main');
		}
	})
})

app.listen(8000, function(){
	console.log('listening on 8000');
})
