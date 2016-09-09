//We use require in nodejs as we use using statement in C#
//sequelize is an ORM just like entity framework
var Sequelize = require('sequelize'); 

//instantiate an object of sequelize 
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite', 
	'storage': __dirname + '/basic-sqllite-datbase.sqllite'
});

//define model
var Todo = sequelize.define('todo',{
	description:{
		type:Sequelize.STRING, 
		allowNull:false, 
		validate:{
			len:[10,250]
		}
	}, 
	completed:{
		type:Sequelize.BOOLEAN, 
		allowNull:false, 
		defaultValue:false
	}
});

//force: true drops the existing tables in the database and starts from scratch. 
//sequelize.sync({force:true})
sequelize.sync().then(function(){
	console.log('Everything is synced');
	Todo.findById(1).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}
		else 
			console.log('item no found');

	});;
	// Todo.create({
	// 				description:'Take out the boy'
	// 			})
	// 	.then(
	// 			function(todo)
	// 				{
	// 					return Todo.create
	// 						({
	// 							description:'Wash the car'
	// 						});
	// 				}
	// 		)
	// 	.then(function(){

	// 		//return Todo.findById(1);
	// 		return Todo.findAll({
	// 			where:{
	// 				description:{
	// 					$like:'%boy%'
	// 				}
	// 			}
	// 		});
	// 	})
	// 	.then(function(todos){
	// 		if(todos)
	// 		{
	// 			todos.forEach(function(todo){
	// 				console.log(todo.toJSON());
	// 			})
	// 		}
	// 		else 
	// 		{
	// 			console.log('no todo found'); 
	// 		}
	// 	})
	// 	.catch(function(e)
	// 		{
	// 			console.log(e);
	// 		});

});