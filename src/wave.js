import './waveUI.css';
import {COLOR, UI} from './color';
export let waveType = '';

console.log('in wave.js');
let sinew;
let sine = function(p) {
	sinew = new SineWave(p, changeWave);
}

let triw;
let tri = function(p) {
	triw = new TriWave(p, changeWave);
}

let squw;
let square = function(p) {
	squw = new SquWave(p, changeWave);
}

let saww;
let saw = function(p) {
	saww = new SawWave(p, changeWave);
}

function changeWave(name) {
	squw.isPlay = false;
	triw.isPlay = false;
	saww.isPlay = false;
	sinew.isPlay = false;
	waveType = name;
	// console.log('change wave to ', name);
}

class WaveTemplate {
	//for draw
	xspacing = 1; // Distance between each horizontal location
	wavenum = 2;
	theta = 0.0; // Start angle at 0
	thetaspeed = 0.05;
	dangle; // Value for incrementing x
	yvalues; // Using an array to store height values for the wave
	xvalues;
	amplitude;
	moving = false;
	isPlay = false;

	constructor(p, clickCallback=null) {
		this.name = '';
		this.p = p;
		this.setp5();
		this.bgcolor = [255, 255, 255];
		this.strokecolor = [255, 255, 255];
		this.initDraw();
		this.clickCallback = clickCallback;
	}

	initDraw() {
		
		this.width = this.p.windowWidth / 5;
		this.w = this.width + this.xspacing;
		this.amplitude = this.width * 0.5 * 0.7;
		//console.log('am', this.amplitude);
		this.dangle = (this.p.TWO_PI / (this.w / (this.wavenum*this.xspacing)));
		this.xvalues = new Array(this.p.floor(this.w / this.xspacing));
		this.yvalues = new Array(this.p.floor(this.w / this.xspacing));
	}
	
	setp5() {
		let arr = ['setup', 'draw', 'windowResized'];
		arr.forEach(link.bind(this));
		function link(f) {
			eval(`this.p.${f} = this.${f}.bind(this);`);
		}
	}

	setup() {
		//console.log(this);
		this.canvas = this.p.createCanvas(this.width, this.width);
		this.p.background(this.bgcolor);
		this.canvas.mouseClicked(this.mouseClicked.bind(this));
	}

	draw() {
		//console.log(this.isPlay);
		this.p.strokeWeight(UI.strokeW);
		this.p.stroke(this.strokecolor[0], this.strokecolor[1], this.strokecolor[2]);
		this.p.background(this.bgcolor[0], this.bgcolor[1], this.bgcolor[2]);
		//this.p.fill(this.bgcolor[0], this.bgcolor[1], this.bgcolor[2]);
		//this.p.rect(0, 0, this.p.width, this.p.height);

		if (this.isPlay) {
			if (this.moving) this.calcWave();
			this.renderWave();
		}
		else {
			//this.p.stroke(0);
			this.p.line(0, this.width/2, this.width, this.width/2);
		}
	}

	mouseClicked() {
		if (this.clickCallback) this.clickCallback(this.isPlay ? '' : this.name);
		this.isPlay = !this.isPlay;
		//send to other!
	}

	windowResized() {
		this.p.resizeCanvas(this.p.windowWidth / 5, this.p.windowWidth / 5);
		this.width = this.p.windowWidth / 5;
	}

	renderWave() {
		//this.p.stroke(0);
		let px = 0;
		let py = this.width / 2 + this.yvalues[0]

		// A simple way to draw the wave with an ellipse at each location
		for (let i = 0; i < this.yvalues.length; i++) {
			let nx = this.xvalues[i];
			let ny = this.width / 2 + this.yvalues[i];
			this.p.line(px, py, nx, ny);
			px = nx;
			py = ny;
		}
	}
}

class SineWave extends WaveTemplate {

	constructor(p, clickCallback) {
		super(p, clickCallback);
		console.log('sine cons');
		this.name = 'sine';
		this.bgcolor = COLOR.red;
		this.calcWave();
		this.moving = true;
	}


	calcWave() {
		// Increment theta (try different values for
		// 'angular velocity' here)
		this.theta += this.thetaspeed;
	  
		// For every x value, calculate a y value with sine function
		let angle = this.theta;
		for (let i = 0; i < this.yvalues.length; i++) {
			this.xvalues[i] = i*this.xspacing;
			this.yvalues[i] = this.p.sin(angle) * this.amplitude;
			angle += this.dangle;
		}
	}
	  
	
}

class TriWave extends WaveTemplate {
	
	constructor(p, clickCallback) {
		super(p, clickCallback);
		this.name = 'triangle';
		this.bgcolor = COLOR.blue;
		
		this.crop = (this.w/this.wavenum)/4.;
		this.calcWave();
		this.moving = true;
		
	}

	calcWave() {
		// Increment theta (try different values for
		// 'angular velocity' here)
		this.theta += this.thetaspeed;
	  
		// For every x value, calculate a y value with sine function
		let angle = this.theta;
		for (let i = 0; i < this.yvalues.length; i++) {
			this.xvalues[i] = i*this.xspacing;
			this.yvalues[i] = this.tri(angle) * this.amplitude;
			angle += this.dangle;
		}
	}

	tri(a) {
		a %= this.p.TWO_PI;
		let x = a / this.p.TWO_PI * this.crop * 4;
		if (a <= this.p.PI/2.) {
			return x / this.crop;
		} else if (a <= this.p.PI*3/2.) {
			return -x / this.crop + 2;
		} else {
			return x / this.crop - 4;
		}
	}
	
}

class SquWave extends WaveTemplate {
	
	constructor(p, clickCallback) {
		super(p, clickCallback);
		this.name = 'square';
		this.bgcolor = COLOR.yellow;
		//this.crop = (this.w/this.wavenum)/4.;
		this.calcWave();
		this.moving = true;
		
	}

	calcWave() {
		// Increment theta (try different values for
		// 'angular velocity' here)
		this.theta += this.thetaspeed;
	  
		// For every x value, calculate a y value with sine function
		let angle = this.theta;
		for (let i = 0; i < this.yvalues.length; i++) {
			this.xvalues[i] = i*this.xspacing;
			this.yvalues[i] = this.square(angle) * this.amplitude;
			angle += this.dangle;
		}
	}

	square(a) {
		a %= this.p.TWO_PI;
		if (a <= this.p.PI) {
			return -1;
		} else {
			return 1;
		}
	}

	
}

class SawWave extends WaveTemplate {
	
	constructor(p, clickCallback) {
		super(p, clickCallback);
		this.name = 'sawtooth';
		this.bgcolor = COLOR.cyan;
		this.calcWave();
		this.moving = true;
		
	}

	calcWave() {
		// Increment theta (try different values for
		// 'angular velocity' here)
		this.theta += this.thetaspeed;
	  
		// For every x value, calculate a y value with sine function
		let angle = this.theta;
		for (let i = 0; i < this.yvalues.length; i++) {
			this.xvalues[i] = i*this.xspacing;
			this.yvalues[i] = this.saw(angle) * this.amplitude;
			angle += this.dangle;
		}
	}

	saw(a) {
		a %= this.p.TWO_PI;
		return (a / this.p.TWO_PI)*2 - 1; // * (this.w/this.wavenum)
	}	
}


new p5(sine, 'waveContainer');
new p5(square, 'waveContainer');
new p5(tri, 'waveContainer');
new p5(saw, 'waveContainer');

//new p5(temp, 'waveContainer');