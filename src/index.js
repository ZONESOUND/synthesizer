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
        $('#firstPage').hide();
        $('#content').attr('hidden', false);
    });
}

var $objHead = $( 'head' );
// define a function to disable zooming
var zoomDisable = function() {
    $objHead.find( 'meta[name=viewport]' ).remove();
    $objHead.prepend( `<meta name="viewport" 
        content="width=device-width, initial-scale=1.0, user-scalable=0" />` );
};

// ... and another to re-enable it
var zoomEnable = function() {
    $objHead.find( 'meta[name=viewport]' ).remove();
    $objHead.prepend( `<meta name="viewport" 
        content="width=device-width, initial-scale=1.0, user-scalable=1" />`);
};

// if the device is an iProduct, apply the fix whenever the users touches an input
if( navigator.userAgent.length && /iPhone|iPad|iPod/i.test( navigator.userAgent ) ) {
    // define as many target fields as your like 
    //zoomDisable();
    // $( "body" )
    //     .on( { 'touchstart' : function() { zoomDisable() } } )
    //     .on( { 'touchend' : function() { setTimeout( zoomEnable , 500 ) } } );
 }


// function noScroll() {
//     window.scrollTo(0, 0);
// }
  
// // add listener to disable scroll
// window.addEventListener('scroll', noScroll);
window.onload = () => {
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
         event.preventDefault();
      }
    }, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
}

