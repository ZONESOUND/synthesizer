// export function createEnvelope() {
//     return new EnvelopeNode();
// };

export class EnvelopeNode{
    constructor(context, config) {
        this.context = context;
        console.log(this.context);
        this.input = context.createGain();
        this.input.gain.value = 0;
        
        let oriConfig = {
            attackTime: 0.1,
            decayTime: 0.1,
            releaseTime: 0.1,
            attackValue: 1,
            sustainValue: 0.2,
        }
        oriConfig = {...oriConfig, ...config};
        this.initADSR(oriConfig);
    };

    initADSR(config) {
        this.attackTime = config.attackTime;
        this.decayTime = config.decayTime;
        this.releaseTime = config.releaseTime;
        this.attackValue = config.attackValue;
        this.sustainValue = config.sustainValue;
    }

    setADSR(a, d, s, r) {
        this.attackTime = a;
        this.decayTime = d;
        this.sustainValue = s;
        this.releaseTime = r;
    }
      
    triggerStart () {
        console.log('triggerStart', this.input.gain.value);
        let now = this.context.currentTime;
        this.input.gain.cancelScheduledValues(now);
        this.input.gain.setValueAtTime(this.input.gain.value, now);
        let time = now + this.attackTime;
        this.input.gain.linearRampToValueAtTime(this.attackValue, time);
        this.decayTimeout = setTimeout(this.rampToSustain.bind(this), this.attackTime*1000); 
    }

    rampToSustain() {
        console.log('decay~', this.input.gain.value);
        let now = this.context.currentTime;
        this.input.gain.linearRampToValueAtTime(this.sustainValue, now+this.decayTime);
        this.decayTimeout = null;
    }

    triggerEnd () {
        console.log('triggerEnd', this.input.gain.value);
        let now = this.context.currentTime;
        if (this.decayTimeout) clearTimeout(this.decayTimeout);
        this.input.gain.cancelScheduledValues(now);
        this.input.gain.setValueAtTime(this.input.gain.value, now); //don't know why 
        this.input.gain.linearRampToValueAtTime(0, now+this.releaseTime);
        //this.input.gain.setValueAtTime(0, now);
    }
    
    connect (param) {
        this.input.connect(param);
    }
}