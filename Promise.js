function emit(type, elm) {
  if (Array.isArray(elm.evnQue[type])) {
    for (var i = 0; i < elm.evnQue[type].length; i++) {
      elm.evnQue[type][i]();
    }
  }
}

function bind(elm, type, handle) {
  if (!elm.evnQue[type]) elm.evnQue[type] = [];
  elm.evnQue[type].push(handle);
}

function Promise(excutor) {
  this.pm = {
    status: 'pending',
    value: '',
    reason: ''
  };
  this.evnQue = {};

  var self = this;

  if(typeof excutor != 'function') throw new TypeError('Promise excutor is not Function');

  excutor(function(value) {
    self.pm.value = value;
    self.pm.status = 'fulfilled';

    emit('resolve', self);
  }, function(reason) {
    self.pm.reason = reason;
    self.pm.status = 'rejected';

    emit('reject', self);
  });
}

Promise.resolve = function(pro, x) {
  if (x.constructor == Promise) {
    pro.pm = x.pm;
    x.evnQue = pro.evnQue;
  } else if ((typeof x == 'object' || typeof x == 'function') && x.then) {
    try {
      x.then(function(value) {
        Promise.resolve(pro, value);
      }, function(reason) {
        Promise.reject(pro, reason);
      });
    } catch (e) {
      if (pro.pm.status == 'pending') Promise.reject(pro, e);
    }
    return;
  } else {
    pro.pm.value = x;
    pro.pm.status = 'fulfilled';
  }

  if(pro.pm.status == 'fulfilled') emit('resolve', pro);
  else if(pro.pm.status) emit('reject', pro);
};

Promise.reject = function(pro, e) {
  pro.pm.status = 'rejected';
  pro.pm.reason = e;
  emit('reject', pro);
};

Promise.prototype.then = function(onRes, onRej) {
  var next = new Promise(function(res, rej) {});
  var self = this;

  if(this.pm.status == 'pending'){
    bind(this, 'resolve', handle);
    bind(this, 'reject', handle);
  }else {
    handle();
  }

  return next;

  function handle() {
    try {
      var result = null;

      if (self.pm.status == 'fulfilled') {
        if(typeof onRes != 'function'){
          Promise.resolve(next, self.pm.value);
          return;
        }
        result = onRes(self.pm.value);
      }
      else if (self.pm.status == 'rejected') {
        if(typeof onRej != 'function'){
          Promise.reject(next, self.pm.reason);
          return;
        }
        result = onRej(self.pm.reason);
      }

      if (result) Promise.resolve(next, result);
    } catch (e) {
      Promise.reject(next, e);
    }
  }
};

module.exports = Promise;