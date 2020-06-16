//import './ipad.css';
import $ from 'jquery'; 
import {initWebaudio, initSound, triggerPlay, triggerStop} from './sound';

if (initWebaudio()) {
    $('#start').click(function() {
        console.log('start');
        initSound();
        $('#start').hide();
        $('#content').attr('hidden', false);
    });
}
//initSound();


$('#play').mousedown(function() {
    triggerPlay();
})

$('#play').mouseup(function() {
    triggerStop();
})