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

function Promise(executor) {
  this.pm = {
    status: 'pending',
    value: '',
    reason: ''
  };
  this.evnQue = {};

  var self = this;

  if (typeof executor != 'function') throw new TypeError('Promise executor is not Function');

  executor(function(value) {
    if (self.pm.status === 'pending') {
      self.pm.value = value;
      self.pm.status = 'fulfilled';
      emit('resolve', self);
    }
  }, function(reason) {
    if (self.pm.status === 'pending') {
      self.pm.reason = reason;
      self.pm.status = 'rejected';
      emit('reject', self);
    }
  });
}

Promise.resolve = function(pro, x) {
  if (pro.pm.status == 'rejected') return;

  if (x && x.constructor == Promise) {
    if (x.pm.status == 'fulfilled') {
      Promise.resolve(pro, x.pm.value);
      return;
    } else if (x.pm.status == 'rejected') {
      Promise.reject(pro, x.pm.reason);
      return;
    } else {
      pro.pm = x.pm;
      x.evnQue = pro.evnQue;
    }
  } else if (x && (typeof x == 'object' || typeof x == 'function') && ('then' in x)) {
    var then = null;

    try {
      then = x.then;
    } catch (e) {
      Promise.reject(pro, e);
      return;
    }

    if (typeof then != 'function') {
      pro.pm.value = x;
      pro.pm.status = 'fulfilled';
    } else {
      var times = 0;
      try {
        then.call(x, function(value) {
          if (times > 0) return;
          Promise.resolve(pro, value);
          times++;
        }, function(reason) {
          if (times > 0) return;
          Promise.reject(pro, reason);
          times++;
        });
      } catch (e) {
        if (times === 0) Promise.reject(pro, e);
        times++;
      }

      return;
    }
  } else {
    pro.pm.value = x;
    pro.pm.status = 'fulfilled';
  }

  if (pro.pm.status == 'fulfilled') emit('resolve', pro);
  else if (pro.pm.status == 'rejected') emit('reject', pro);
};

Promise.reject = function(pro, e) {
  if (pro.pm.status == 'fulfilled') return;

  pro.pm.status = 'rejected';
  pro.pm.reason = e;

  emit('reject', pro);
};

Promise.prototype.then = function(onRes, onRej) {
  var next = new Promise(function(res, rej) {});
  var self = this;

  if (self.pm.status == 'pending') {
    bind(self, 'resolve', handle);
    bind(self, 'reject', handle);
  } else {
    handle();
  }

  return next;

  function handle() {
    setTimeout(function() {
      try {
        var result = null;

        if (self.pm.status == 'fulfilled') {
          if (typeof onRes != 'function') {
            Promise.resolve(next, self.pm.value);
            return;
          }

          result = onRes(self.pm.value);
        } else if (self.pm.status == 'rejected') {
          if (typeof onRej != 'function') {
            Promise.reject(next, self.pm.reason);
            return;
          }

          result = onRej(self.pm.reason);
        }

        if (result == next)
          Promise.reject(next, new TypeError());
        else
          Promise.resolve(next, result);
      } catch (e) {
        Promise.reject(next, e);
      }
    });
  }
};

module.exports = Promise;
