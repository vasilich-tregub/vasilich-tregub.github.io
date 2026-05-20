var marginX = 0;
var text1 = "";
var text2 = "";
var framems = 30;
const deltaW = 0.9;
var changeSign = -1;
var intervalId = 0;
var animInProgress = false;
var bkgcolor = "#6a5acd";
var bkgimage = new Image();
var background = "color";
var canvasFrames;
var frameNo;
window.onload = () => {
    colorBackground("#6a5acd");
    marginX = Number(margin.value);
    text1 = idText1.value;
    text2 = idText2.value;
    //framems = Number(idFramems.value);
    bkgimage.src = "./image.jpg";
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
        animInProgress = false;
        console.log(canvasFrames);
    }
    else {    
        animInProgress = true;
        canvasFrames = [];
        frameNo = 0;
        recordingDuration.textContent = 'Recording in progress...';
        setTimeout(drawText, 0);
    }
}
function drawText() {
    let recordingStartedAt = performance.now();
    let totalFrames = Number(idTotalFrames.value);
    let width = canvas.width;
    let height = canvas.height;
    while (animInProgress && frameNo < totalFrames) {
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
        let ypos = 100;
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
        if (marginX >= 320) { changeSign = -1 };
        if (marginX <= 5) { changeSign = +1 };
        ctx.save();
        ctx.font = "64px sans-serif";
        ctx.fillStyle = "MidnightBlue";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "Gold";
        exitTimestamp = performance.now();
        let drawTextDuration = (exitTimestamp - enterTimestamp).toFixed(1);
        ctx.strokeText(Number(frameNo), 16, 464);
        ctx.fillText(Number(frameNo), 16, 464);
        ctx.strokeText(drawTextDuration, 192, 464);
        ctx.fillText(drawTextDuration, 192, 464);
        ctx.restore();
        canvasFrames.push(ctx.getImageData(0, 0, width, height));
        frameNo++;
    }
    animInProgress = false;
    recordingDuration.textContent = (performance.now() - recordingStartedAt).toFixed() + 'ms';
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
function displayFrame(frameNo) {
    const ctx = document.getElementById("storedFrame").getContext("2d");
    ctx.putImageData(canvasFrames[frameNo], 0, 0);
}
function downloadCanvasContent() {
    var link = document.createElement("a");
    link.download = "canvas-image.webp";
    canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link.href);
        link.click(); // saves image.webp to downloads
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(link.href);
        }, 100);
    }, "image/webp");

}
