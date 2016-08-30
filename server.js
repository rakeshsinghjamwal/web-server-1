var express = require('express'); 
var bodyParser = require('body-parser');

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
	var todoItem;
	todos.forEach(function(item){
		if( item.id === todoItemId )
		{
			todoItem = item;
		}
	});

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
	var body = req.body;
	body.id = todoNextId;
	todos.push(body);
	res.json(body);
	todoNextId +=1;
});

app.listen(PORT,function(){
	console.log('Server started at:' + PORT + '!');
});
