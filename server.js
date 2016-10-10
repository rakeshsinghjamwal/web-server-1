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

	var todoItem = _.findWhere(todos, {
		id: todoId
	});

	if (!todoItem) {
		res.status(404).json({
			"error": "no todo find with that id"
		});
	}
	todos = _.without(todos, todoItem);
	res.json(todoItem);
});


//PUT /todo/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todoItem = _.findWhere(todos, {
		id: todoId
	});

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!todoItem)
		res.status(404).send();


	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(404).send();
	}

	console.log(validAttributes);
	_.extend(todoItem, validAttributes);
	res.json(todoItem);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Server started at:' + PORT + '!');
	});
});