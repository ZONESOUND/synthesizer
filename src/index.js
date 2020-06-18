//import './ipad.css';
import $ from 'jquery'; 
import {initWebaudio, initSound, triggerPlay, triggerStop} from './sound';
import './wave.js';
import './controlui';
import './index.css';

if (initWebaudio()) {
    $('#start').click(function() {
        console.log('start');
        initSound();
        $('#start').hide();
        $('#content').attr('hidden', false);
    });
}