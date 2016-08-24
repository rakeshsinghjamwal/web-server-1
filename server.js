var express = require('express'); 
var app = express(); 
var PORT = process.env.PORT || 3000;
var todos = [{
	id:1,
	description:'Go to market', 
	completed:false
},
{
	id:2,
	description:'Meet frank',
	completed:false
},
{
	id:3,
	description:'Wash the car',
	completed:true
}
];

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
		console.log('not found')
		res.status(404).send();
	}
	else 
	{
		console.log('found');
		res.json(todoItem);
	}
	//res.send('Asking for todo with id of ' + req.params.id);

})

app.listen(PORT,function(){
	console.log('Server started at:' + PORT + '!');
});
