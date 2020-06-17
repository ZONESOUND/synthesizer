import {changeFilter} from './sound';
export let adsrConfig = {
    attackTime: 0.5,
    decayTime: 0.5,
    releaseTime: 0.1,
    attackValue: 1,
    sustainValue: 0.2
}

let adsr = function(p) {
    let widthSec = 4;
    let attack, decay, release;
    let sustainTime = 0.5;
    p.setup = function() {
        p.createCanvas(p.windowWidth*2 / 5 + p.windowWidth*0.05, p.windowWidth / 5);
        attack = new Draggable(p);
        decay = new Draggable(p);
        release = new Draggable(p);
    }

    p.draw = function() {
        p.background(100);
        p.stroke(255);
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
        p.fill(255);
        let w = 10;
        //console.log(p.height, attackY);
        attack.draw(attackX, attackY, w);
        decay.draw(decayX, decayY, w);
        release.draw(releaseX, p.height, w);
    }

    p.mousePressed = function() {
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

    p.mouseDragged = function() {
        if (attack.drag) {
            adsrConfig.attackTime = minmax(width2time(p.mouseX), 0, widthSec-adsrConfig.decayTime-sustainTime-adsrConfig.releaseTime);
            adsrConfig.attackValue = minmax(height2val(p.mouseY), 0, 1);
        }
        else if (decay.drag) {
            adsrConfig.decayTime = minmax(width2time(p.mouseX) - adsrConfig.attackTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.releaseTime);
            adsrConfig.sustainValue = minmax(height2val(p.mouseY), 0, 1);
        }
        else if (release.drag) {
            adsrConfig.releaseTime = minmax(width2time(p.mouseX) - adsrConfig.attackTime - adsrConfig.decayTime, 0, widthSec-adsrConfig.attackTime-sustainTime-adsrConfig.decayTime);
        }
        //let distance = p.dist(p.mouseX, p.mouseY, attack.x, attack.y);  
        
        //

        //console.log(p.mouseX, p.mouseY, width2time(p.mouseX));
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
        canvas = p.createCanvas(p.windowWidth / 5, p.windowWidth / 5);
        p.background(0);
        //change to only drag canvas
        //canvas.mouseDragged(mouseDragged);
        canvas.mousePressed(()=>{
            press = true;});
        canvas.mouseOut(()=>{
            press = false});
    }

    p.draw = function() {
        p.background(100);
        p.stroke(255);
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
        p.fill(255);
        p.ellipse(freqw, p.map(Q, 0.001, 100, p.height, 0), 10);
    }


    p.mouseDragged = function() {
        if (!press) return;
        //console.log(filterFreq);
        //console.log(p, this);
        filterFreq = minmax(width2Freq(p.mouseX), freqMin, freqMax);
        Q = p.map(p.mouseY, 0, p.height, 100, 0.001);
        changeFilter(filterFreq, Q);

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
 new p5(adsr, 'p5Container');
 new p5(filter, 'p5Container');
