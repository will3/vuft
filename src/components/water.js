var THREE = require('three');
var scene = require('../core/renderer').scene;

module.exports = function() {
	var obj = new THREE.Object3D();
	var lineGeometry, lineMaterial, line;
	function start() {
		scene.add(obj);

		lineGeometry = new THREE.Geometry();
		lineGeometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
		lineGeometry.vertices.push(new THREE.Vector3(1000, 0, 0));

		lineMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff
		});
		line = new THREE.Line(lineGeometry, lineMaterial);
		obj.add(line);
	};

	function tick() {

	};

	function destroy() {
		scene.remove(obj);
	};

	return {
		start: start,
		tick: tick,
		destroy: destroy,
	};
};