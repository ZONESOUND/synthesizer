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
    keyboard = new Keyboard($('body'), 'C4', 1);
    

    oscillator = Synth.newOsc('sine', 440);
    oscillator.start();
    envelope = new EnvelopeNode(context);
    oscillator.connect(envelope.input);

    filter = Synth.newFilter(440);


    gain = Synth.newGain(1);
    compressor = Synth.newCompressor();
    oscillator.connect(envelope.input);
    envelope.connect(filter);
    keyboard.connect(filter);
    filter.connect(gain);
    
    gain.connect(compressor);
    compressor.connect(context.destination);
    
}

$('#wave-type').change(function() {
    console.log($("#wave-type option:selected").attr('id'));
    oscillator.type = $("#wave-type option:selected").attr('id');
})

$('#filter-frequency').change(function() {
    console.log($('#filter-frequency').val());
    filter.frequency.setValueAtTime($('#filter-frequency').val(), context.currentTime);
})

$('#piano button').mousedown(function() {
    console.log(parseInt($(this).text()));
    oscillator.frequency.setValueAtTime(parseInt($(this).text()),context.currentTime);
    envelope.triggerStart();
})

$('#piano button').mouseup(function() {
    //oscillator.frequency.setValue($(this).text());
    envelope.triggerEnd();
})

$('.envelope').change(function() {
    eval(`envelope.${$(this).attr('id')}=${$(this).val()}`);
})

$('#amplitude').change(function() {
    console.log($(this).val());
    gain.gain.setValueAtTime($(this).val(), context.currentTime);
})

$('#pitch').change(function() {
    oscillator.detune.value = $(this).val();
})

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





export {initWebaudio, initSound, triggerPlay, triggerStop};