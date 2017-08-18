var THREE = require('three');
var scene = require('../core/renderer').scene;
var Chunk = require('../voxel/chunk');
var mesher = require('../voxel/mesher');
var keycode = require('keycode');

module.exports = function() {
	var obj = new THREE.Object3D();
	obj.rotation.order = 'ZYX';
	var chunk = new Chunk();
	var materials = [];

	var rotateObj = new THREE.Object3D();
	var shipObj = new THREE.Object3D();
	var engineAmount = 1;
	var enginePower = 0.1;
	var maxSpeed = 10;
	var vel = new THREE.Vector3();
	var friction = 0.97;
	var keyholds = {};
	var turnSpeed = 0.1;
	var gravity = new THREE.Vector3(0, -0.05, 0);

	function start() {
		scene.add(obj);
		obj.add(rotateObj);
		rotateObj.add(shipObj);

		rotateObj.rotation.x = Math.PI / 2;

		if (self.model != null) {
			// Load chunk
			var data = self.model.data;
			var center = [0, 0, 0];
			for (var i = 0; i < data.length; i++) {
				var line = data[i];
				chunk.set(line[0], line[1], line[2], line[3]);
				center[0] += line[0];
				center[1] += line[1];
				center[2] += line[2];
			}
			center[0] /= data.length;
			center[1] /= data.length;
			center[2] /= data.length;
			center[0] += 0.5;
			center[1] += 0.5;
			center[2] += 0.5;
			shipObj.position.x = -center[0];
			shipObj.position.y = -center[1];
			shipObj.position.z = -center[2];

			// Load material
			var palette = self.model.palette;
			var m = [];
			for (var i = 0; i < palette.length; i++) {
				if (palette[i] == null) {
					m.push(null);
				} else {
					m.push(new THREE.MeshBasicMaterial({
						color: palette[i]
					}));
				}
			}
			materials = m;
		}

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
	};

	function onKeyDown(e) {
		var key = keycode(e);
		keyholds[key] = true;
	};

	function onKeyUp(e) {
		var key = keycode(e);
		keyholds[key] = false;
	};

	function tick() {
		mesher(chunk, shipObj, materials);

		var forwardAmount = keyholds['up'] ? 1 : 0;
		var acc = new THREE.Vector3(0, enginePower * forwardAmount, 0).applyEuler(obj.rotation);
		vel.add(acc);

		if (obj.position.y < 0) {
			vel.add(new THREE.Vector3(0, 0.1, 0));
		}

		if (!keyholds['up']) {
			vel.add(gravity);	
		}

		var turnAmount = 0;
		if (keyholds['left']) {
			turnAmount++;
		} 	

		if (keyholds['right']) {
			turnAmount--;
		}

		obj.rotation.y += turnAmount * turnSpeed;		
		obj.rotation.z = obj.rotation.y;

		// Step rigid body
		vel.multiplyScalar(friction);
		if (vel.length() > maxSpeed) {
			vel.setLength(maxSpeed);
		}
		obj.position.add(vel);
	};

	function destroy() {
		scene.remove(obj);

		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};

	function getForward() {
		return new THREE.Vector3(0, 1, 0).applyEuler(obj.rotation);
	};

	var self = {
		start: start,
		tick: tick,
		destroy: destroy,
		position: obj.position,
		isPlayer: false,
		getForward: getForward
	};

	return self;
};