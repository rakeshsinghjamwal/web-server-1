var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('App is running at :' + PORT + '!');
});

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
	var query = req.query;

	var where = {};
	if(query.hasOwnProperty('completed')){
		var completedValue = (query.completed === 'true');
		if(completedValue === true)
		{
			where.completed = true;
		}
	}	

	if(query.hasOwnProperty('desc'))
	{
		var description = query.desc;
		where.description = { $like: '%' + description + '%' };
	}

	console.log(where);
	
	db.todo.findAll({where:where}).then(function(todos){
		res.json(todos);
	
	}).catch(function(e){res.status(500).json(e)});

});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoItemId = parseInt(req.params.id, 10);
	db.todo.findById(todoItemId).then(function(todo){
		if(todo)
			return res.json(todo);
		else 
			return res.status(404).json('No item found');
	}).catch(function(e){
		return res.status(500).json(e);
	});
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create({
		description:body.description
	}).then(function(todo){
		res.json(todo);
	}).catch(function(e){
		res.status(400).json(e);
	});

});

//DELETE /todo/:id 
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({where:{
		id:todoId
	}}).then(function(rowsDeleted){
		if(rowsDeleted == 0 )
		{
			res.status(404).json({error:"No todo with id"});
		}
		else 
		{
			res.status(204).send();
		}

	}).catch(function(e){
		res.status(500).send(e);
	});
	
});


//PUT /todo/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	} 

	db.todo.findById(todoId).then(function(todo){
		if(todo){
			todo.update(attributes).then(function(todo){
				res.json(todo.toJSON());
			}, function(e){
				res.status(400).json(e);
			});
		}
		else 
		{
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});
});

app.post('/users', function(req, res){
	
	console.log(_.pick(req.body, 'email','password'));

	var userBody = req.body; 
	console.log(userBody);
	db.user.create({
		email:userBody.email, 
		password:userBody.password
	})
	.then(function(user){
		if(user){
			console.log('user successfully created');
			res.json(user.toPublicJSON());
		}
		else 
		{
			res.sendStatus(400).send();
		}
	}, function(e){
		res.sendStatus(401).json(e);
	});
});

db.sequelize.sync({ force:true }).then(function() {
	app.listen(PORT, function() {
		console.log('Server started at:' + PORT + '!');
	});
});