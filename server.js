var express = require('express'); 
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express(); 
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; 

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('App is running at :' + PORT +'!');
});

// GET /todos
app.get('/todos',function(req, res){
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoItemId = parseInt(req.params.id, 10);
	var todoItem  = _.findWhere(todos, {id: todoItemId});
	if(!todoItem)
	{
		res.status(404).send();
	}
	else 
	{
		res.json(todoItem);
	}
});

// POST /todos
app.post('/todos',function(req, res){
	var body = _.pick(req.body, 'description','completed') ;
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(404).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId;
	todos.push(body);
	res.json(body);
	todoNextId +=1;
});

//DELETE /todo/:id 
app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);

	var todoItem = _.findWhere(todos,{id:todoId});

	if(!todoItem)
	{
		res.status(404).json({"error":"no todo find with that id"});
	}
	todos = _.without(todos,todoItem);
	res.json(todoItem);

});


app.listen(PORT,function(){
	console.log('Server started at:' + PORT + '!');
});
