var app = require('./core/app');
var renderer = require('./core/renderer');
var Ship = require('./components/ship');
var ship = Ship();
ship.model = require('./assets/models/frigate');
ship.position.y = 30;

app.add(ship);

app.add(require('./components/water')());

var camera = require('./components/camera')();
app.add(camera);

function tick() {
	camera.target.copy(ship.position);
	app.tick();
	renderer.render();
};

function animate() {
	tick();
	requestAnimationFrame(animate);
};

animate();