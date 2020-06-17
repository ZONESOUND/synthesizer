import {EnvelopeNode} from './envelop';
import {Keyboard} from './keyboard';
import * as Synth from './soundusage';

let context;
let oscillator, envelope, filter, gain, compressor;
let keyboard;

function initWebaudio() {
    try {
        // Fix up for prefixing
        //window.AudioContext = window.AudioContext||window.webkitAudioContext;
        //window.AudioContext.prototype.createEnvelope = createEnvelope;
        //context = new AudioContext();
        context = Synth.initContext();
        //AudioNode.
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        console.log(e);
        return false;
    }
    //initSound();
    return true;
}

function initSound() {
    keyboard = new Keyboard($('body'), 'C4', 2+5/12);

    // oscillator = Synth.newOsc('sine', 440);
    // oscillator.start();
    // envelope = new EnvelopeNode(context);
    // oscillator.connect(envelope.input);

    filter = Synth.newFilter(440);

    gain = Synth.newGain(0.5);
    compressor = Synth.newCompressor();
    // oscillator.connect(envelope.input);
    // envelope.connect(filter);
    keyboard.connect(filter);
    filter.connect(gain);
    
    gain.connect(compressor);
    compressor.connect(context.destination);
    
}

// $('#wave-type').change(function() {
//     console.log($("#wave-type option:selected").attr('id'));
//     oscillator.type = $("#wave-type option:selected").attr('id');
// })

// $('#filter-frequency').change(function() {
//     console.log($('#filter-frequency').val());
//     filter.frequency.setValueAtTime($('#filter-frequency').val(), context.currentTime);
//     console.log(filter.frequency.value);
// })

// $('#piano button').mousedown(function() {
//     console.log(parseInt($(this).text()));
//     oscillator.frequency.setValueAtTime(parseInt($(this).text()),context.currentTime);
//     envelope.triggerStart();
// })

// $('#piano button').mouseup(function() {
//     //oscillator.frequency.setValue($(this).text());
//     envelope.triggerEnd();
// })

// $('.envelope').change(function() {
//     eval(`envelope.${$(this).attr('id')}=${$(this).val()}`);
// })

$('#amplitude').change(function() {
    //console.log($(this).val());
    //gain.gain.setValueAtTime($(this).val(), context.currentTime);
})

$('#amplitude').on('input', ()=>{
    gain.gain.linearRampToValueAtTime($('#amplitude').val(), context.currentTime+0.01);
})

$('#pitch').change(function() {
    //console.log('ch');
    //keyboard.set('oscillator.detune', $(this).val());
    //oscillator.detune.setValueAtTime($(this).val(), context.currentTime);
})

$('#pitch').on('input', pitchChange);

function pitchChange() {
    //console.log($('#pitch').val());
    keyboard.set('oscillator.detune', $('#pitch').val());
}

function triggerPlay() {
    envelope.triggerStart();
}

function triggerStop() {
    envelope.triggerEnd();
}

function scalingValue(fromRange, toRange, value) {
    return (value - fromRange[0])*(toRange[1]-toRange[0])/(fromRange[1]-fromRange[0])+ toRange[0];
}

function setValue(obj, value, time) {
    obj.setValueAtTime(value, time);
}

function changeFilter(filterFreq, Q) {
    //console.log(filterFreq);
    //filter.frequency.setValueAtTime(filterFreq, context.currentTime);
    //filter.frequency.value = filterFreq;
    filter.frequency.linearRampToValueAtTime(filterFreq, context.currentTime+0.01);
    //console.log(Q);
    filter.Q.linearRampToValueAtTime(Q, context.currentTime+0.01);
    //console.log(filter.frequency);
}



export {initWebaudio, initSound, triggerPlay, triggerStop, changeFilter};