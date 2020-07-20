import {changeFilter, changeAmp, changePitch, changeArp} from './sound';
import {COLOR, UI} from './color';
export let adsrConfig = {
    attackTime: 0.5,
    decayTime: 0.5,
    releaseTime: 0.1,
    attackValue: 1,
    sustainValue: 0.2
}

let adsr = function(p) {
    let canvas;
    let widthSec = 4;
    let attack, decay, release;
    let sustainTime = 0.5;
    p.setup = function() {
        p.createCanvas(p.windowWidth*2 / UI.widthDiv + p.windowWidth*0.05, p.windowWidth / UI.widthDiv);
        attack = new Draggable(p);
        decay = new Draggable(p);
        release = new Draggable(p);
        
        // canvas.touchStarted(mousePressed);
        // canvas.mousePressed(mousePressed);
        // canvas.mouseDragged(mouseDragged);
    }

    p.draw = function() {
        p.strokeWeight(UI.strokeW);
        p.background(COLOR.bg[0],COLOR.bg[1],COLOR.bg[2]);
        //p.fill(COLOR.yellow[0], COLOR.yellow[1], COLOR.yellow[2]);
        p.stroke(COLOR.yellow[0], COLOR.yellow[1], COLOR.yellow[2]);
        p.fill(255);
        p.rect(UI.strokeW/2., UI.strokeW/2., p.width-UI.strokeW, p.height-UI.strokeW);
        
        let attackX = time2width(adsrConfig.attackTime);
        let attackY = val2height(adsrConfig.attackValue);
        let decayX = time2width(adsrConfig.decayTime) + attackX;
        let decayY = val2height(adsrConfig.sustainValue);
        let sustainX = time2width(sustainTime) + decayX;
        let releaseX = time2width(adsrConfig.releaseTime) + sustainX;
        //console.log(attackX, attackY);
        p.line(0, p.height, attackX, attackY);
        p.line(attackX, attackY, decayX, decayY);
        p.line(decayX, decayY, sustainX, decayY);
        p.line(sustainX, decayY, releaseX, p.height);
        p.fill(COLOR.yellow[0], COLOR.yellow[1], COLOR.yellow[2]);
        let w = 10;
        //console.log(p.height, attackY);
        attack.draw(attackX, attackY, w);
        decay.draw(decayX, decayY, w);
        release.draw(releaseX, p.height, w);
    }

    let touchStarted = function() {
        attack.drag = false;
        decay.drag = false;
        release.drag = false;
        for (var i = 0; i < p.touches.length; i++) {
            if (attack.checkIn(p.touches[i].x, p.touches[i].y, 30)) {
                attack.drag = true;
            }
    
            if (decay.checkIn(p.touches[i].x, p.touches[i].y, 30)) {
                decay.drag = true;
            } 
    
            if (release.checkIn(p.touches[i].x, p.touches[i].y, 30)) {
                release.drag = true;
            } 
        }
    }

    let mousePressed = function() {
        if (attack.checkIn(p.mouseX, p.mouseY, 30)) {
            attack.drag = true;
        } else {
            attack.drag = false;
        }

        if (decay.checkIn(p.mouseX, p.mouseY, 30)) {
            decay.drag = true;
        } else {
            decay.drag = false;
        }

        if (release.checkIn(p.mouseX, p.mouseY, 30)) {
            release.drag = true;
        } else {
            release.drag = false;
        }
    }

    let touchMoved = function() {
        
        for (var i = 0; i < p.touches.length; i++) {
            if (attack.drag && attack.checkIn(p.touches[i].x, p.touches[i].y, 80)) {
                adsrConfig.attackTime = minmax(width2time(p.touches[i].x), 0, widthSec-adsrConfig.decayTime-sustainTime-adsrConfig.releaseTime);
                adsrConfig.attackValue = minmax(height2val(p.touches[i].y), 0, 1);
            }
            else if (decay.drag && decay.checkIn(p.touches[i].x, p.touches[i].y, 80)) {
                adsrConfig.decayTime = minmax(width2time(p.touches[i].x) - adsrConfig.attackTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.releaseTime);
                adsrConfig.sustainValue = minmax(height2val(p.touches[i].y), 0, 1);
            }
            else if (release.drag && release.checkIn(p.touches[i].x, p.touches[i].y, 100)) {
                adsrConfig.releaseTime = minmax(width2time(p.touches[i].x) - adsrConfig.attackTime - adsrConfig.decayTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.decayTime);
            }
        }
    }

    let mouseDragged = function() {
        if (attack.drag && attack.checkIn(p.mouseX, p.mouseY, 80)) {
            adsrConfig.attackTime = minmax(width2time(p.mouseX), 0, widthSec-adsrConfig.decayTime-sustainTime-adsrConfig.releaseTime);
            adsrConfig.attackValue = minmax(height2val(p.mouseY), 0, 1);
        }
        else if (decay.drag && decay.checkIn(p.mouseX, p.mouseY, 80)) {
            adsrConfig.decayTime = minmax(width2time(p.mouseX) - adsrConfig.attackTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.releaseTime);
            adsrConfig.sustainValue = minmax(height2val(p.mouseY), 0, 1);
        }
        else if (release.drag && release.checkIn(p.mouseX, p.mouseY, 80)) {
            adsrConfig.releaseTime = minmax(width2time(p.mouseX) - adsrConfig.attackTime - adsrConfig.decayTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.decayTime);
        }
        //let distance = p.dist(p.mouseX, p.mouseY, attack.x, attack.y);  
        
        //

        //console.log(p.mouseX, p.mouseY, width2time(p.mouseX));
    }

    p.touchMoved = touchMoved;
    p.touchStarted = touchStarted;
    p.mousePressed = mousePressed;
    p.mouseDragged = mouseDragged;
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth*2 / UI.widthDiv + p.windowWidth*0.05, p.windowWidth / UI.widthDiv);
	}
    let time2width = function(time) {
        return time / widthSec * p.width;
    }

    let width2time = function(width) {
        return width / p.width * widthSec;
    }

    let val2height = function(val) {
        return -val * p.height + p.height;
    }

    let height2val = function(height) {
        return -(height - p.height) / p.height;
    }
}

export let filterFreq = 440;
let Q = 1;
let filter = function(p) {
    let freqMax = 4000;
    let freqMin = 50;
    let logw = 70;
    let canvas;
    let press = false;
    p.setup = function() {
        canvas = p.createCanvas(p.windowWidth / UI.widthDiv, p.windowWidth / UI.widthDiv);
        p.background(0);
        //change to only drag canvas
        //canvas.mouseDragged(mouseDragged);
        canvas.touchStarted(()=>{
            press = true;})
        canvas.touchEnded(()=>{
            press = false;})
        canvas.mousePressed(()=>{
            press = true;});
        canvas.mouseOut(()=>{
            press = false});
    }

    p.draw = function() {
        p.strokeWeight(UI.strokeW);
        p.background(COLOR.bg[0], COLOR.bg[1], COLOR.bg[2]);
        p.stroke(COLOR.blue[0], COLOR.blue[1], COLOR.blue[2]);
        p.fill(255);
        p.rect(UI.strokeW/2., UI.strokeW/2., p.width-UI.strokeW, p.height-UI.strokeW);
        
        let freqw = freq2Width(filterFreq)
        // p.line(0, p.height/2, freqw, p.height/2);
        // p.noFill();
        // p.beginShape();
        // for (let x = 0; x < logw; x++) {
        //     let xValue = p.map(x, 0, logw, 5, 0);
        //     let yValue = p.log(xValue);
        //     let y = p.map(yValue, Math.log(5), -2, p.height/2, p.height);
        //     p.vertex(x+freqw, y);
        //     //console.log(x,y, yValue, Math.log(2), Math.log(0.1));
        // }
        // p.endShape();
        p.fill(COLOR.blue[0], COLOR.blue[1], COLOR.blue[2]);
        p.ellipse(freqw, p.map(Q, 0.001, 100, p.height, 0), 10);
    }

    p.touchMoved = function() {
        if (!press) return;
        var i=0;
        while(!touchIn(p.touches[i].x, p.touches[i].y) && i < p.touches.length) {
            i++;
        }
        //alert(i);
        if (i == p.touches.length) return;
        filterFreq = minmax(width2Freq(p.touches[i].x), freqMin, freqMax);
        Q = p.map(p.touches[i].y, 0, p.height, 100, 0.001);
        changeFilter(filterFreq, Q);
        
    }

    p.mouseDragged = function() {
        if (!press) return;
        //console.log(filterFreq);
        //console.log(p, this);
        filterFreq = minmax(width2Freq(p.mouseX), freqMin, freqMax);
        Q = p.map(p.mouseY, 0, p.height, 100, 0.001);
        changeFilter(filterFreq, Q);
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth / UI.widthDiv, p.windowWidth / UI.widthDiv);
	}

    let touchIn = function(x, y) {
        return x >=0 && x <= p.width && y >=0 && y <=p.height;
    }

    let width2Freq = function(w) {
        return p.map(w, 0, p.width, freqMin, freqMax);
    }

    let freq2Width = function(f) {
        return p.map(f, freqMin, freqMax, 0, p.width);
    }
}

let minmax = function(v, minv, maxv) {
    if (v < minv) return minv;
    if (v > maxv) return maxv;
    return v;
}

let amplitude = 0.5;
let pitch = 0;
let otherfunc = function(p) {
    let ampSlider;
    let pitchSlider;
    let arpToggle;
    let touch = false;
    let canvas;
    let press = false;
    p.setup = function() {
        canvas = p.createCanvas(p.windowWidth / UI.widthDiv, p.windowWidth / UI.widthDiv);
        p.background(0);
        //change to only drag canvas
        //canvas.mouseDragged(mouseDragged);
        //let off = p.width/12;
        let w = (p.width-UI.strokeW)/5;
        ampSlider = new Slider(p, [1, 0], amplitude, UI.strokeW/2.+w*2, UI.strokeW/2., w, p.height-UI.strokeW, p.width/12);
        pitchSlider = new Slider(p, [100, 0], pitch, UI.strokeW/2.+w*4, UI.strokeW/2., w, p.height-UI.strokeW, p.width/12);
        arpToggle = new Toggle(p, UI.strokeW/2., UI.strokeW/2., p.width/5, p.height-UI.strokeW, false);
    }

    p.draw = function() {
        p.background(COLOR.bg[0], COLOR.bg[1], COLOR.bg[2]);
        p.strokeWeight(UI.strokeW);
        p.stroke(0);
        ampSlider.draw([0, 0, 0], [255, 255, 255]);
        p.stroke(0);
        pitchSlider.draw([255, 255, 255], [0, 0, 0]);
        arpToggle.draw();
    }

    let touchStarted = function() {
        if (ampSlider.touchStarted()) {
            changeAmp(ampSlider.getVal());
            return false;
        }
        if (pitchSlider.touchStarted()) {
            changePitch(pitchSlider.getVal());
            return false;
        }
        if (arpToggle.touchStarted()) {
            changeArp(arpToggle.on);
            return false;
        }
        
    }

    let mousePressed = function() {
        if (touch) return;
        if (ampSlider.mousePressed()) {
            changeAmp(ampSlider.getVal());
        }
        if (pitchSlider.mousePressed()) {
            changePitch(pitchSlider.getVal());
        }
        if (arpToggle.mousePressed()) {
            changeArp(arpToggle.on);
        }
    }

    let mouseOut = function() {
        ampSlider.mouseOut();
        pitchSlider.mouseOut();
    }

    p.mouseDragged = function() {
        if (ampSlider.mouseDragged()) {
            changeAmp(ampSlider.getVal());
        }
        if (pitchSlider.mouseDragged()) {
            changePitch(pitchSlider.getVal());
        }
    }

    

    p.touchMoved = function() {
        if (ampSlider.touchMoved()) {
            changeAmp(ampSlider.getVal());
        }
        if (pitchSlider.touchMoved()) {
            changePitch(pitchSlider.getVal());
        }
    }

    p.touchStarted = touchStarted;
    p.mousePressed = mousePressed;
    p.mouseOut = mouseOut;
    p.touchEnded = mouseOut;

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth / UI.widthDiv, p.windowWidth / UI.widthDiv);
        let w = (p.width-UI.strokeW)/5;
		ampSlider.resize(UI.strokeW/2.+w*2, UI.strokeW/2., w, p.height-UI.strokeW, p.width/12);
        pitchSlider.resize(UI.strokeW/2.+w*4, UI.strokeW/2., w, p.height-UI.strokeW, p.width/12);
        arpToggle.resize(UI.strokeW/2., UI.strokeW/2., p.width/5, p.height-UI.strokeW);
	}
}

class Toggle {
    constructor(p, x, y, w, h, on) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        console.log('toggle', on);
        this.on = on;
    }

    resize(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        this.p.stroke(0);
        this.p.fill(255);
        this.p.rect(this.x, this.y, this.w, this.h);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(15);
        this.p.noStroke();
        if (this.on) {
            this.p.stroke(COLOR.cyan[0],COLOR.cyan[1],COLOR.cyan[2]);
            this.p.fill(COLOR.cyan[0],COLOR.cyan[1],COLOR.cyan[2]);
            this.p.rect(this.x, this.y+this.h*2/3., this.w, this.h/3.);
            this.p.noStroke();
            this.p.text('ON', this.x+this.w/2., this.y+this.h/3.);
        } else {
            this.p.stroke(COLOR.red[0],COLOR.red[1],COLOR.red[2]);
            this.p.fill(COLOR.red[0],COLOR.red[1],COLOR.red[2]);
            this.p.rect(this.x, this.y, this.w, this.h/3.);
            this.p.noStroke();
            this.p.text('OFF', this.x+this.w/2., this.y+this.h*2/3.);
        }
        
        //
    }
    


    checkIn(x, y) {
        if (x >= this.x && x <= this.x+this.w && y >=this.y && y <= this.y+this.h) {
            return true;
        }
        else return false;
    }

    mousePressed() {
        if (this.checkIn(this.p.mouseX, this.p.mouseY)) {
            this.on = !this.on;
            this.draw();
            return true;
        }
        return false;
    };

    touchStarted() {
        for (var i=0; i<this.p.touches.length; i++) {
            if (this.checkIn(this.p.touches[i].x, this.p.touches[i].y)) {
                this.on = !this.on;
                this.draw();
                return true;
            }
        }
        return false;
    }
}

class Slider {
    constructor(p, range, now, x, y, w, h, h2) {
        this.p = p;
        this.drag = false;
        this.range = range;
        this.now = now;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.h2 = h2;
        this.moveh = 0;
    }

    resize(x, y, w, h, h2) {
        this.now = this.pos2Val(this.moveh);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.h2 = h2;
        this.moveh = this.val2Pos(this.now);
    }

    draw(fillColor, fillColorIn) {
        this.p.fill(fillColor[0], fillColor[1], fillColor[2]);
        this.p.rect(this.x, this.y, this.w, this.h);
        //this.p.stroke(fillColor[0], fillColor[1], fillColor[2]);
        this.p.fill(fillColorIn[0], fillColorIn[1], fillColorIn[2]);
        this.p.rect(this.x, this.y+this.moveh, this.w, this.h2);
    }

    checkIn(x, y, thres=this.w) {
        if (this.p.dist(x, y, this.x, this.y) < thres) {
            return true;
        }
        else return false;
    }

    checkInMove(x, y) {
        if (x >= this.x && x <= this.x+this.w && y >=this.y+this.moveh && y <= this.y+this.moveh+this.h2) {
            return true;
        }
        else return false;
    }

    checkInSlider(x, y) {
        if (x >= this.x && x <= this.x+this.w && y >=this.y && y <= this.y+this.h) {
            return true;
        }
        else return false;
    }

    touchStarted() {
        for (var i=0; i<this.p.touches.length; i++) {
           if (this.checkInSlider(this.p.touches[i].x, this.p.touches[i].y)) {
                this.setMoveh(this.p.touches[i].y);
                return true;
            }
        }
        return false;
    }

    mousePressed() {
        //return false;
        // if (this.checkInMove(this.p.mouseX, this.p.mouseY)) {
        //     this.press = true;
        // } else 
        if (this.checkInSlider(this.p.mouseX, this.p.mouseY)) {
            this.press = true;
            this.setMoveh(this.p.mouseY);
            return true;
        }
        this.press = false;
        return false;
    };

    mouseOut() {
        this.press = false;
    };

    mouseDragged() {
        //return false;
        if (!this.press) return false;
        this.setMoveh(this.p.mouseY);
        return true;
    }

    touchMoved() {
        //if (!this.press) return false;
        for (var i=0; i<this.p.touches.length; i++) {
            if (this.checkInSlider(this.p.touches[i].x, this.p.touches[i].y)) {
                this.setMoveh(this.p.touches[i].y);
                return true;
            }
        }
        return false;
    }

    setMoveh(mouseY) {
        this.moveh = minmax(mouseY-this.y, 0, this.h-this.h2);
    } 

    getVal() {
        this.now = this.pos2Val(this.moveh);
        return this.now;
    }

    setVal(val) {
        this.now = val;
        this.moveh = this.val2Pos(this.now);
    }

    pos2Val(p) {
        return this.p.map(p, 0, this.h-this.h2, this.range[0], this.range[1]);
    }

    val2Pos(v) {
        return this.p.map(v, this.range[0], this.range[1], 0, this.h-this.h2);
    }

}

class Draggable {
    constructor(p) {
        this.p = p;
        this.drag = false;
    }

    draw(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.p.ellipse(x, y, w);
    }

    checkIn(x, y, thres=this.w) {
        if (this.p.dist(x, y, this.x, this.y) < thres) {
            return true;
        }
        else return false;
    }
}

//new p5(adsr, 'controlContainer');
//new p5(filter, 'controlContainer');
new p5(otherfunc, 'p5Container');
new p5(filter, 'p5Container');
new p5(adsr, 'p5Container');
