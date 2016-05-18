var adapter = require('./adapter');
var assert = require("assert");

var resolved = adapter.resolved;
var rejected = adapter.rejected;
var deferred = adapter.deferred;
var dummy = {
	dummy: 'dummy'
};

var done = function() {
	console.log('done');
};

var d = deferred();
var isFulfilled = false;

d.promise.then(function onFulfilled() {
	assert.strictEqual(isFulfilled, true);
	done();
});

setTimeout(function() {
	d.resolve(dummy);
	isFulfilled = true;
}, 50);