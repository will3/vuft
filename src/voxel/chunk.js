var Chunk = function() {
	this.map = {};
	this.size = 16;
};

Chunk.prototype.get = function(i, j, k) {
	var region = this.getRegion(i, j, k);
	i -= region.origin[0];
	j -= region.origin[0];
	k -= region.origin[0];
	var index = i * this.size * this.size + j * this.size + k;
	return region.data[index];
};

Chunk.prototype.set = function(i, j, k, v) {
	var region = this.getOrCreateRegion(i, j, k);
	i -= region.origin[0];
	j -= region.origin[0];
	k -= region.origin[0];
	var index = i * this.size * this.size + j * this.size + k;
	region.data[index] = v;
	region.dirty = true;
};

Chunk.prototype.getOrCreateRegion = function(i, j, k) {
	var origin = this.getOrigin(i, j, k);
	var id = origin.join(',');

	if (this.map[id] == null) {
		this.map[id] = {
			origin: origin,
			data: [],
			dims: [ this.size, this.size, this.size ],
			size: this.size
		};
	}

	return this.map[id];
};

Chunk.prototype.getRegion = function(i, j, k) {
	var origin = this.getOrigin(i, j, k);
	var id = origin.join(',');

	return this.map[id];
};

Chunk.prototype.getOrigin = function(i, j, k) {
	return [
		Math.floor(i / this.size),
		Math.floor(j / this.size),
		Math.floor(k / this.size)
	];
};

module.exports = Chunk;