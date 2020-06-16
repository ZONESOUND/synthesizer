import './keyboard.css';
import * as Synth from './soundusage';
import {EnvelopeNode} from './envelop';


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
        
    }

    initKeys() {
        console.log('init key');
        let $ul = $("<ul></ul>");
        this.htmlParent.append($ul);
        let startHalf = calcHalfNote(this.startNote[0])
        this.keys = [];
        for (let i=0; i<this.keyNum; i++) {
            $ul.append(`<li id="key-${i}" class="${this.whiteOrBlack(i+startHalf)}"></li>`);
            this.keys.push(new Key(calcFreq(this.startFreq, i), i));
        }
    }

    connect(audioNode) {
        for (let i=0; i<this.keyNum; i++) {
            this.keys[i].connect(audioNode);
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
        console.log(freq, '#key-'+ind);
        this.freq = freq;
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

    getNowEnvelope() {
        $('.envelope').each(this.changeEnvelopeAttr.bind(this));
    }

    changeEnvelopeAttr(idx, e) {
        //console.log(e);
        eval(`this.envelope.${$(e).attr('id')}=${$(e).val()}`);
    }

    mousedown() {
        console.log(this.freq, 'down');
        this.getNowEnvelope();
        this.envelope.triggerStart();
    }

    mouseup() {
        console.log(this.freq, 'up');
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