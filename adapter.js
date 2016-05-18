var Promise = require('./index');

exports.resolved = function(value){
	return new Promise(function(res){
		res(value);
	});
};

exports.rejected = function(reason){
	return new Promise(function(res, rej){
		rej(reason);
	});
};

exports.deferred = function(){
	var p = new Promise(function(res, rej){});

	return {
		promise: p,
		resolve: function(value){
			Promise.resolve(p, value);
		},
		reject: function(reason){
			Promise.reject(p, reason);
		}
	};
};
