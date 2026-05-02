// JavaScript source code
"use strict";

//window.requestAnimFrame = (function () {
//    return window.requestAnimationFrame ||
//        window.webkitRequestAnimationFrame ||
//        window.mozRequestAnimationFrame ||
//        window.oRequestAnimationFrame ||
//        window.msRequestAnimationFrame ||
//        function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
//            return window.setTimeout(callback, 1000 / 60);
//        };
//})();

//window.cancelAnimFrame = (function () {
//    return window.cancelAnimationFrame ||
//        window.webkitCancelAnimationFrame ||
//        window.mozCancelAnimationFrame ||
//        window.oCancelAnimationFrame ||
//        window.msCancelAnimationFrame ||
//        window.clearTimeout;
//})();

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const ctx = canvas.getContext("2d");
ctx.fillStyle = "darkblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "lime";
ctx.lineWidth = 5;
ctx.fillStyle = "fuchsia";
ctx.globalAlpha = 0.9;
ctx.font = 80 + "px serif";
ctx.strokeText('Text Run', 2, 100);
ctx.fillText('Text Run', 2, 100);
const stream = canvas.captureStream();
video.srcObject = stream;
