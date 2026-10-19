import { mkvdemuxjs } from "./mkvdemux.js"; // https://github.com/Yahweasel/mkvdemuxjs
const mkv = new mkvdemuxjs.MkvDemux();
const video = document.getElementById("idVideo");
const canvas = document.getElementById("glCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
let videoFrameCallbackId = null;
let frameCount = 0;
video.addEventListener("play", function() {
    frameCount = 0;
    console.log("play started; frameCount = " + frameCount.toString());
    const stream = video.captureStream();
    const track = stream.getVideoTracks()[0];
    console.log(track.getCapabilities());
    frameArrived();
}, false);
video.addEventListener("ended", function() {
    console.log("play ended; frameCount = " + frameCount.toString());
}, false);
function frameArrived() {
    if (video.paused || video.ended) {
        return;
    }
    drawFrameCaptions();
    videoFrameCallbackId = video.requestVideoFrameCallback(function () {
        frameArrived();
    });
}
function drawFrameCaptions() {
   frameCount++;
}
// Demux webm file and printout ebml elements
inputFile.onchange = async (evt) => {
  const stream = inputFile.files[ 0 ].stream();
  const reader = stream.getReader({ mode: "byob" });
    let startingAB = new ArrayBuffer(1932784);
    const buffer = await readInto(startingAB);
    console.log("The first 1932784 bytes, or less:", buffer);

    async function readInto(buffer) {
        let offset = 0;

        while (offset < buffer.byteLength) {
            const { value: view, done } =
                await reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset));
            buffer = view.buffer;
            if (done) {
                break;
            }
            offset += view.byteLength;
        }

        return buffer;
    }
    mkv.push(buffer);
    var printout = "";
    var el;
    while (el = mkv.demux()) {
        if (el.track)
            printout += JSON.stringify(el) + '\n';
        if (el.frames)
            printout += JSON.stringify(el.frames[0]) + '\n';
    }
    webmEbml.innerText = printout;
}
