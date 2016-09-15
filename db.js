//We use require in nodejs as we use using statement in C#
//sequelize is an ORM just like entity framework
var Sequelize = require('sequelize'); 

//instantiate an object of sequelize 
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite', 
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {}; 

//sequelize.import lets you import models from a different file. 
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;