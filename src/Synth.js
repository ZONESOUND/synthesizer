class Synth {

    //static AudioContext = window.AudioContext||window.webkitAudioContext;
    //window.AudioContext.prototype.createEnvelope = createEnvelope;
    static context = new (window.AudioContext||window.webkitAudioContext)();

    static newFilter(frequency, dest=null) {
        let f = context.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.setValueAtTime(frequency, context.currentTime);
        return f;
    }
    
    static newOsc(type, frequency, dest=null) {
        let o = context.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(frequency, context.currentTime);
        if (dest) o.connect(dest);
        return o;
    }
    
    static newGain(value, dest=null) {
        let g = context.createGain();
        g.gain.value = value;
        if (dest) g.connect(dest);
        return g;
    }
    
    static newConstant(offset, dest=null) {
        let c = context.createConstantSource();
        c.offset = offset;
        if (dest) c.connect(dest);
        return c;
    }

}