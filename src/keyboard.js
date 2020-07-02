import './keyboard.css';
import * as Synth from './soundusage';
import {EnvelopeNode} from './envelop';
import {waveType} from './wave';
import {adsrConfig} from './controlui';

export class Keyboard {

    constructor(htmlParent, startNote, octaveNum) {
        // if (isNumber(start)) { // freq
        //     this.startFreq = start;
        // } else {
        this.startNote = startNote;
        this.startFreq = noteToFreq(this.startNote);
        //}
        this.keyNum = octaveNum*12;
        this.htmlParent = htmlParent;
        this.initKeys();
        this.arp = false;
        this.arpIntT = 500;
        this.setKeyArp();
        $('#arp').change(this.arpChange.bind(this));
        resizeKeyboard();
    }

    initKeys() {
        //console.log('init key');
        let $ul = $("<ul></ul>");
        this.htmlParent.append($ul);
        let startHalf = calcHalfNote(this.startNote[0])
        this.keys = [];
        for (let i=0; i<this.keyNum; i++) {
            $ul.append(`<li id="key-${i}" class="${this.whiteOrBlack(i+startHalf)}"></li>`);
            this.keys.push(new Key(calcFreq(this.startFreq, i), i));
        }
    }

    arpChange() {
        this.arp = !this.arp;
        if (this.arp) {
            
            this.arpSet = new Set();
            this.arpId = 0;
            this.arpInterval = setInterval(this.playArpSet.bind(this), this.arpIntT);
        } else {
            clearInterval(this.arpInterval);
        }
    }

    playArpSet() {
        let arr = [...this.arpSet]
        if (arr.length > 0) {
            this.arpId %= arr.length;
            this.keys[arr[this.arpId]].play(this.arpIntT/2.);
            this.arpId++;
        }
    }

    addArpSet(i) {
        if (!this.arp) return;
        this.arpSet.add(i);
    }

    setKeyArp() {
        for (let i=0; i<this.keyNum; i++) {
            this.keys[i].setArp(this.addArpSet.bind(this));
            //this.keys[i].setArp();
        }
    }

    connect(audioNode) {
        for (let i=0; i<this.keyNum; i++) {
            this.keys[i].connect(audioNode);
        }
    }

    set (audioParam, val) {
        let now = Synth.context.currentTime+0.01;
        for (let i=0; i<this.keyNum; i++) {
            eval(`this.keys[i].${audioParam}.linearRampToValueAtTime(${val}, now)`);
            //this.keys[i].connect(audioNode);
        }
    }


    whiteOrBlack(half) {
        half %= 12;
        if (half == 5 || half == 0) return 'white';
        if (half < 5) { // < F
            return half%2 ? 'black' : 'white white-wide';
        } else {
            return half%2 ? 'white white-wide' : 'black';
        }
    }

}


class Key {

    constructor(freq, ind) {
        //console.log(freq, '#key-'+ind);
        this.freq = freq;
        this.ind = ind;
        $('#key-'+ind).mousedown(this.mousedown.bind(this));
        $('#key-'+ind).mouseup(this.mouseup.bind(this));
        $('#key-'+ind).mouseout(this.mouseup.bind(this));
        //bind press?
        this.initOsc();
    }
    
    initOsc() {
        this.oscillator = Synth.newOsc('sine', this.freq);
        this.oscillator.start();
        this.envelope = new EnvelopeNode(Synth.context);
        this.oscillator.connect(this.envelope.input);

        //filter = Synth.newFilter(440);


        //gain = Synth.newGain(1);

        
        //this.envelope.connect(Synth.context.destination);
        //this.envelope.connect();
    }

    connect(audioNode) {
        this.envelope.connect(audioNode);
    } 

    setArp(arpCallback) {
        this.arpCallback = arpCallback;
    }
    
    getNowEnvelope() {
        this.envelope.initADSR(adsrConfig);
        //$('.envelope').each(this.changeEnvelopeAttr.bind(this));
    }

    changeEnvelopeAttr(idx, e) {
        //console.log(e);
        eval(`this.envelope.${$(e).attr('id')}=${$(e).val()}`);
    }

    mousedown() {
        this.arpCallback(this.ind);
        this.play();
    }

    mouseup() {
        this.stop();
    }

    play(selfEnd = null) {
        //console.log(this.freq, 'down');
        this.getNowEnvelope();
        //this.oscillator.detune.value = $('#pitch').val();
        this.oscillator.type = waveType;
        //console.log(waveType);
        this.envelope.triggerStart();
        if (selfEnd) {
            setTimeout(this.stop.bind(this), selfEnd);
        }
    }

    stop() {
        //console.log(this.freq, 'up');
        this.envelope.triggerEnd();
    }
}

function isNumber(num){
    return !isNaN(num)
}

function calcHalfNote(note) {
    let halfTable = [0, 2, 4, 5, 7, 9, 11];
    //let halfTable = [-9, -7, -5, -4, -2, 0, 2];
    let noteP = note.toUpperCase().charCodeAt(0) - 65; // 65:'A'charcode
    noteP = (noteP + 5) % 7; // A switch to back
    return halfTable[noteP];
}


function noteToFreq(note) {
    //standard: A4 440
    let noteL = parseInt(note[1]) - 4;
    let halfNum = calcHalfNote(note[0]) - 9 + noteL*12; // 9: A offset
    console.log(halfNum);
    return calcFreq(440, halfNum);
}

function calcFreq(fromFreq, upHalf) {
    return fromFreq*(2**(upHalf/12));
}

window.addEventListener("resize", resizeKeyboard);
function resizeKeyboard() {
    let w = window.innerWidth;
    console.log('w', w);
    $('.white').css('width', w/20);
    $('.white').css('height', w/5);
    console.log($('.white').css('width'), $('.white-wide').css('margin-left'));
    $('.white-wide').css('margin-left', -w/80);
    $('.black').css('margin-left', -w/80);
    $('.black').css('width', w/40);
    $('.black').css('height', w/10);
}
