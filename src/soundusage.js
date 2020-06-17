let context;
function initContext() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
        //window.AudioContext.prototype.createEnvelope = createEnvelope;
    context = new AudioContext();
    return context;
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
    g.gain.setValueAtTime(value, context.currentTime);
    if (dest) g.connect(dest);
    return g;
}

function newConstant(offset, dest=null) {
    let c = context.createConstantSource();
    c.offset = offset;
    if (dest) c.connect(dest);
    return c;
}

function newCompressor(threshold=-50, dest=null) {
    let compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(threshold, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);
    if (dest) compressor.connect(dest);
    return compressor;

}

export {newOsc, newFilter, newGain, newConstant, initContext, context, newCompressor};