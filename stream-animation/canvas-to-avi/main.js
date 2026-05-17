var marginX = 0;
var text1 = "";
var text2 = "";
var framems = 30;
const deltaW = 0.3;
var changeSign = -1;
var intervalId = 0;
var animInProgress = false;
var bkgcolor = "#6a5acd";
var bkgimage = new Image();
var background = "color";
var savedFrameTimestamp = 0;
var aviBlob;
var framesToRecord = 0;
var aviWorker;
window.onload = () => {
    colorBackground("#6a5acd");
    marginX = Number(margin.value);
    text1 = idText1.value;
    text2 = idText2.value;
    //framems = Number(idFramems.value);
    bkgimage.src = "./image.jpg";
    //AVIJS.settings = { width: 320, height: 240 };
    //aviStream = new AVIJS.Stream(60, 320, 240);
}
function setTexts() {
    text1 = idText1.value;
    text2 = idText2.value;
}
function setMargin() {
    marginX = Number(margin.value);
}
/*function setFramems() {
    framems = Number(idFramems.value);
    clearInterval(intervalId);
    intervalId = setInterval(drawText, framems);
}*/
function clearCanvas() {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function animateColumnWidth() {
    if (animInProgress) {
        //clearInterval(intervalId);
        animInProgress = false;
        //framems = Number(idFramems.value);
        aviWorker.postMessage({ action: 'buffer' });
    }
    else {
        frameTimestamp = 0;
        //intervalId = setInterval(drawText, framems);
        animInProgress = true;
        framesToRecord = 0;
        aviWorker = new Worker("./AVI.js");
        aviWorker.postMessage({ action: 'settings', settings: { width: 320, height: 240 } });
        aviWorker.postMessage({ action: 'stream', stream: { fps: 30, width: 320, height: 240 } });
        drawText();
        aviWorker.addEventListener("message", (msg) => {
            console.log("msg from aviWorker: ", msg.data);
            const url = URL.createObjectURL(msg.data);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `canvas-to-avi-${Date.now()}.avi`;
            document.body.appendChild(a);
            a.click();
            aviWorker.terminate();
        });
    }
}
function drawText(callbackTimestamp) {
    let enterTimestamp = performance.now();
    const ctx = document.getElementById("canvas").getContext("2d", { willReadFrequently: true });
    if (background == "color") {
        ctx.save();
        ctx.fillStyle = bkgcolor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    else {
        ctx.drawImage(bkgimage, 0, 0, canvas.width, canvas.height)
    }
    let fontsz = document.getElementById("fontsize").value;
    ctx.font = fontsz + "px serif";
    const words = text1.split(/\s/);    
    let xpos = marginX;
    let ypos = 40;
    for (let ix = 0; ix < words.length; ++ix) {
        let metrics = ctx.measureText(words[ix] + " ");
        if (xpos + metrics.width > canvas.width - marginX) {
            xpos = marginX;
            ypos += metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        }
        drawTextRun(words[ix], xpos, ypos);
        xpos += metrics.width;
    }
    //const text2 = "عرض توضيلتخطيط النص بعرض أعمدة ديناميكي"
    const words2 = text2.split(/\s/);
    xpos = canvas.width - marginX;
    ypos += ctx.measureText(words2[0]).fontBoundingBoxAscent + ctx.measureText(words2[0]).fontBoundingBoxDescent;
    for (let ix = 0; ix < words2.length; ++ix) {
        let metrics = ctx.measureText(words2[ix] + " ");
        if (xpos - metrics.width < marginX) {
            xpos = canvas.width - marginX;
            ypos += metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        }
        drawTextRun(words2[ix], xpos - metrics.width, ypos);
        xpos -= metrics.width;
    }
    marginX += changeSign * deltaW;
    if (marginX >= 96) {changeSign = -1};
    if (marginX <= 2.5) {changeSign = +1};
    ctx.save();
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "MidnightBlue";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "Gold";
    exitTimestamp = performance.now();
    let frameDuration = (callbackTimestamp - savedFrameTimestamp).toFixed(1);
    savedFrameTimestamp = callbackTimestamp;
    let drawTextDuration = (exitTimestamp - enterTimestamp).toFixed(1);
    ctx.strokeText(frameDuration, 2, 224);
    ctx.fillText(frameDuration, 2, 224);
    ctx.strokeText(drawTextDuration, 56, 224);
    ctx.fillText(drawTextDuration, 56, 224);
    ctx.restore();
    if (framesToRecord < 100)
        aviWorker.postMessage({ action: 'frameImageData', stream: 0, frame: ctx.getImageData(0, 0, 320, 240) });
    framesToRecord++;
    if(animInProgress)
    requestAnimationFrame(drawText);
}
function drawTextRun(textRun, xpos, ypos) {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = "lime";
    ctx.lineWidth = strokeLineWidth.value;
    ctx.fillStyle = "fuchsia";
    ctx.globalAlpha = gAlpha.value;
    let fontsz = document.getElementById("fontsize").value;
    ctx.font = fontsz + "px serif";
    ctx.strokeText(textRun, xpos, ypos);
    ctx.fillText(textRun, xpos, ypos);
}
function imageBackground() {
    document.getElementById("canvasbackground").style.backgroundImage = "url('image.jpg')";
    document.getElementById("canvasbackground").style.backgroundRepeat = "repeat";
    background = "image";
}
function colorBackground(color) {
    document.getElementById("canvasbackground").style.backgroundImage = "none";
    document.getElementById("canvasbackground").style.backgroundColor = color;
    bckcolor = color;
    background = "color";
}
function downloadCanvasContent() {
    var link = document.createElement("a");
    link.download = "canvas-image.png";

    canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link.href);
        link.click(); // saves image.png to downloads
    }, "image/png");

}
