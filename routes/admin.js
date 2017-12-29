var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/portfolio'});
var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'portfolio'
});

connection.connect();

router.get('/', function(req, res, next){
	connection.query("SELECT * FROM projects", function(err, rows, fields){
		if(err) throw err;
		res.render('admin/index', {
			"projects": rows
		});
	});
});

router.get('/add', function(req, res, next){
	res.render('admin/add');
});

router.post('/add', upload.single('projectimage'), function(req, res, next){
	var title = req.body.title;
	var description = req.body.description;
	var service = req.body.service;
	var url = req.body.url;
	var client = req.body.client;
	var projectdate = req.body.projectdate;
	//Check image upload
	if(req.file){
		var projectimageName = req.file.filename;
	} else{
		var projectimageName = 'noimage.jpg';
	}
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('admin/add',{
			errors: errors,
			title: title,
			description: description,
			service: service,
			client: client
		});
	} else{
		var project = {
			title: title,
			description: description,
			service: service,
			url: url,
			client: client,
			date: projectdate,
			image: projectimageName
		};
	}
	var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
		//Project inserted
		console.log('Error: '+err);
		console.log('Success: '+result);
	});
	req.flash('success_msg', 'Project Added');
	res.redirect('/admin');
});


module.exports = router;