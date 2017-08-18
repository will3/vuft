var THREE = require('three');
var camera = require('../core/renderer').camera;

module.exports = function() {
	var currentPosition = new THREE.Vector3();

	function start() {
		currentPosition.copy(self.target);
	};

	function tick() {
		currentPosition.lerp(self.target, 0.4);
		var position = currentPosition.clone();
		position.z = self.distance;
		position.add(self.ship.getForward().multiplyScalar(4));
		camera.position.copy(position);
	};

	var self = {
		start: start,
		tick: tick,
		target: new THREE.Vector3(),
		distance: 200,
		position: camera.position,
		ship: null
	};

	return self;
};