var assert = require("assert");

var adapter = require('./adapter');
var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;
var dummy = {
	dummy: 'dummy'
};

var bummy = {
	bummy: 'bummy'
};

var done = function() {
	console.log('done');
};

var promise = rejected(dummy);

// var promise = new Promise(function(res, rej){
// 	rej(dummy);
// });

// function resolved(value){
// 	return new Promise(function(res){
// 		res(value);
// 	});
// }

promise
.then(null, function (value) {
	return {
		then: function(onFull){
			// setTimeout(function () {
				onFull(resolved({
					then: function(onFullilled){
						onFullilled(bummy);
					}
				}));
			// }, 0);
		}
	};
})
.then(function (value) {
	assert.strictEqual(value, bummy);
	done();
})
.then(null, reason=>console.log(reason));
