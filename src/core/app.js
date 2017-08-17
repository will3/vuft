var shortid = require('shortid');

// Obj life cycle
// start -> tick -> destroy
var App = function() {
	this.map = {};
};

App.prototype.add = function(obj) {
	if (obj._id == null) {
		obj._id = shortid.generate();
	}
	this.map[obj._id] = obj;
};

App.prototype.remove = function(obj) {
	obj._removed = true;
};

App.prototype.tick = function() {
	var obj;

	for (var id in this.map) {
		obj = this.map[id];
		if (!obj._started) {
			if (obj.start != null) {
				obj.start();
			}
			obj._started = true;
		}
	}

	for (var id in this.map) {
		obj = this.map[id];
		if (obj.tick != null) {
			obj.tick();
		}
	}

	var ids = [];
	for (var id in this.map) {
		obj = this.map[id];
		if (obj._removed) {
			if (obj.destroy != null) {
				obj.destroy();
			}
			ids.push(id);
		}
	}

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		delete this.map[id];
	}
};

module.exports = new App();