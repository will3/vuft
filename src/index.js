var app = require('./core/app');
var renderer = require('./core/renderer');
var Ship = require('./components/ship');
var ship = Ship();
ship.model = require('./assets/models/frigate');
ship.position.y = 30;
ship.isPlayer = true;

app.add(ship);

var water = require('./components/water')();
app.add(water);

var camera = require('./components/camera')();
app.add(camera);

function tick() {
	camera.target.copy(ship.position);
	camera.ship = ship;
	
	water.position.x = camera.position.x;
	app.tick();
	renderer.render();
};

function animate() {
	tick();
	requestAnimationFrame(animate);
};

animate();