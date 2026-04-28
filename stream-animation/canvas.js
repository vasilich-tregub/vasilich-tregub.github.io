var marginX = 0;
var text1 = "";
var text2 = "";
var speed = 30;
const deltaW = 0.9;
var changeSign = -1;
var intervalId = 0;
var animInProgress = false;
window.onload = () => {
    colorBackground("#6a5acd");
    marginX = Number(margin.value);
    text1 = idText1.value;
    text2 = idText2.value;
    speed = Number(idSpeed.value);
}
function setTexts() {
    text1 = idText1.value;
    text2 = idText2.value;
}
function setMargin() {
    marginX = Number(margin.value);
}
function setSpeed() {
    speed = Number(idSpeed.value);
    clearInterval(intervalId);
    intervalId = setInterval(drawText, speed);
}
function clearCanvas() {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function animateColumnWidth() {
    if (animInProgress) {    
        clearInterval(intervalId);
        animInProgress = false;
        speed = Number(idSpeed.value);
    }
    else {    
        intervalId = setInterval(drawText, speed);
        animInProgress = true;
    }

}
function drawText() {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fontsz = document.getElementById("fontsize").value;
    ctx.font = fontsz + "px serif";
    //const text1 = "Dynamic column width text layout demo";
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
    if (marginX >= 320) {changeSign = -1};
    if (marginX <= 5) {changeSign = +1};
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
}
function colorBackground(color) {
    document.getElementById("canvasbackground").style.backgroundImage = "none";
    document.getElementById("canvasbackground").style.backgroundColor = color;
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
