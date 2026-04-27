// JavaScript source code
const width = 1280;
const height = 640;
var binaryimage;

function drawGrid() {
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.font = "144px serif";
    //ctx.strokeText(textRun, xpos, ypos);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillText("Distance Field", 100, 200);
    /*binaryimage = [
        +0, +0, +0, +0, +0, +0, +0, +0,
        +0, +0, +0, +9, +9, +0, +0, +0,
        +0, +0, +9, +9, +9, +9, +0, +0,
        +0, +9, +9, +9, +9, +9, +9, +0,
        +0, +9, +9, +9, +9, +9, +9, +0,
        +0, +0, +9, +9, +9, +9, +0, +0,
        +0, +0, +0, +9, +9, +0, +0, +0,
        +0, +0, +0, +0, +0, +0, +0, +0,
    ]*/
    binaryimage = new Int32Array(width * height);
    let imageData = ctx.getImageData(0, 0, width, height);
    let zeroscount = 0;
    let onescount = 0;
    for (let i = 0; i < width * height; ++i) {
        binaryimage[i] = (imageData.data[4 * i + 0] > 127) ? 1 << 31 : 0;
    }
    for (let i = 0; i < width * height; ++i) {
        if (binaryimage[i] == 0) {
            zeroscount++;
        }
        else {
            onescount++;
        }
    }
    console.log(zeroscount);
    console.log(onescount);;
    for (let i = 0; i < width * height; ++i) {
        if (binaryimage[i] == 1 << 31) {
            imageData.data[4 * i + 0] = 0;
            imageData.data[4 * i + 1] = 224;
            imageData.data[4 * i + 2] = 224;
            imageData.data[4 * i + 3] = 255;
        }
        else {
            imageData.data[4 * i + 0] = 160;
            imageData.data[4 * i + 1] = 32;
            imageData.data[4 * i + 2] = 128;
            imageData.data[4 * i + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
function drawDistanceField() {
    let startTime = performance.now();
    binaryimage = signed_distance_fields(binaryimage, width, height);
    let finishTime = performance.now();
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, width, height);
    let imageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < width * height; ++i) {
        imageData.data[4 * i + 0] = ((binaryimage[i] > 0) ? 1 : 0) * 2048.0 / (binaryimage[i] + 16);
        imageData.data[4 * i + 1] = 2048.0 / (binaryimage[i] + 16);
        imageData.data[4 * i + 2] = ((binaryimage[i] > 0) ? 0 : 1) * 2048.0 / (binaryimage[i] + 16);
        imageData.data[4 * i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    idPerf.value = (finishTime - startTime).toString();
    //console.log(signed_distance_fields(binaryimage, width, height));
}