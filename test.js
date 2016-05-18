var assert = require("assert");

var adapter = require('./adapter');
var resolved = adapter.resolved || function(value){
	return new Promise(function(res){
		res(value);
	});
};
var rejected = adapter.rejected ||function(reason){
	return new Promise(function(res, rej){
		rej(reason);
	});
};
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

var promise = resolved(dummy);
var expectedValue = undefined;

promise.then(function onFulfilled() {
	return expectedValue;
}).then(function onPromise2Fulfilled(actualValue) {
	assert.strictEqual(actualValue, expectedValue);
	done();
})