import {EnvelopeNode} from './envelop';
let context;
let oscillator, envelope, filter, gain;

function initWebaudio() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        //window.AudioContext.prototype.createEnvelope = createEnvelope;
        
        context = new AudioContext();
        //AudioNode.
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        console.log(e);
        return false;
    }
    initSound();
    return true;
}

function initSound() {
    oscillator = newOsc('sine', 440);
    oscillator.start();

    filter = newFilter(440);

    envelope = new EnvelopeNode(context);

    gain = newGain(1);

    oscillator.connect(filter);
    filter.connect(envelope.input);
    envelope.connect(gain);
    gain.connect(context.destination);
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

function newFilter(frequency, dest=null) {
    let f = context.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(frequency, context.currentTime);
    return f;
}

function newOsc(type, frequency, dest=null) {
    let o = context.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(frequency, context.currentTime);
    if (dest) o.connect(dest);
    return o;
}

function newGain(value, dest=null) {
    let g = context.createGain();
    g.gain.value = value;
    if (dest) g.connect(dest);
    return g;
}

function newConstant(offset, dest=null) {
    let c = context.createConstantSource();
    c.offset = offset;
    if (dest) c.connect(dest);
    return c;
}



export {initWebaudio, initSound, triggerPlay, triggerStop};