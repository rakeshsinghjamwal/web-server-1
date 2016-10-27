var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');
module.exports = function(sequelize, DataType){
	return sequelize.define('user',{
		email:{
				type: DataType.STRING, 
				allowNull:false, 
				unique:true, 
				validate:{
					isEmail:true
				}
		}, 
		salt:{
			type:DataType.STRING
		}, 
		password_hash:{
			type:DataType.STRING
		},

		password:{
			type:DataType.VIRTUAL, //Virtual never gets stored in the database but accessbible 
			allowNull:false, 
			validate:{
				len:[7,100]
			}, 
			set:function( value ){
					var salt = bcrypt.genSaltSync(10);
					var hashedPassword = bcrypt.hashSync(value, salt);
					
					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash', hashedPassword); 
			}
		}
	}, 
	{
		hooks:{
			beforeValidate:function(user, options){
				if(typeof user.email === 'STRING')
				{
					user.email = user.email.toLowerCase();
				}
			}
		}, 
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json,'id' , 'email','createdAt', 'updatedAt');
			}
		}

	});
}

