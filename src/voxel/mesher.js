var mesher = require('./monotone').mesher;
var THREE = require('three');

module.exports = function(chunk, object, material) {
	for (var id in chunk.map) {
		var region = chunk.map[id];

		if (!region.dirty) {
			continue;
		}

		region.dirty = false;

		if (region.mesh != null) {
			region.mesh.parent.remove(region.mesh);
			region.mesh.geometry.dispose();
		}

		var geometry = meshRegion(region);
		region.mesh = new THREE.Mesh(geometry, material);
		object.add(region.mesh);
	}
};

function meshRegion(region) {
	var size = region.size;
	var result = mesher(function(i, j, k) {
		var index = i * size * size + j * size + k;
		return region.data[index];
	}, region.dims);

	var geometry = new THREE.Geometry();
	result.vertices.forEach(function(v) {
		geometry.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
	});

	result.faces.forEach(function(f) {
		var face = new THREE.Face3(f[0], f[1], f[2]);
		face.materialIndex = f[3];
		geometry.faces.push(face);
	});

	return geometry;
};