/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
const decompmem = new WebAssembly.Memory({
    initial: 3000,
    maximum: 10000,
});

var waobj;
WebAssembly.instantiateStreaming(
    fetch("wavelet.wasm"), {
    js: { mem: decompmem },
}).then((obj) => {
    waobj = obj;
});

var im;
var x_im;


var memR;
var memG;
var memB;
var width;
var height;
var imgsize;
var imageData;
var horLevels;
var vertLevels;
function forward_transform() {
    const imagedecomp = new DataView(decompmem.buffer);
    const img = document.getElementById("idImgSrc");
    width = img.naturalWidth;
    height = img.naturalHeight;
    document.getElementById("idCanvas").width = width;
    document.getElementById("idCanvas").height = height;
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, width, height);
    // packed to planar color representation, and dwt for each bitplane
    imgsize = width * height;
    memR = 0;
    memG = memR + imgsize;
    memB = memG + imgsize;
    for (let ih = 0; ih < height; ++ih) {
        for (let iw = 0; iw < width; ++iw) {
            imagedecomp.setUint32((memR + ih * width + iw) * 4, imageData.data[(ih * width + iw) * 4 + 0] << 12, true);
            imagedecomp.setUint32((memG + ih * width + iw) * 4, imageData.data[(ih * width + iw) * 4 + 1] << 12, true);
            imagedecomp.setUint32((memB + ih * width + iw) * 4, imageData.data[(ih * width + iw) * 4 + 2] << 12, true);
        }
    }
    horLevels = idHorizontalLevels.value;
    vertLevels = idVerticalLevels.value;
    let startTime = performance.now();
    for (let level = 0; level < vertLevels; ++level) {
        forward_transform_vertical(level);
    }
    for (let level = 0; level < horLevels; ++level) {
        forward_transform_horizontal(level);
    }
    let finishTime = performance.now();
    // planar to packed
    for (let ih = 0; ih < height; ++ih) {
        for (let iw = 0; iw < width; ++iw) {
            imageData.data[(ih * width + iw) * 4 + 0] = (imagedecomp.getUint32((memR + ih * width + iw) * 4, true) >> 12);
            imageData.data[(ih * width + iw) * 4 + 1] = (imagedecomp.getUint32((memG + ih * width + iw) * 4, true) >> 12);
            imageData.data[(ih * width + iw) * 4 + 2] = (imagedecomp.getUint32((memB + ih * width + iw) * 4, true) >> 12);
        }
    }
    ctx.putImageData(imageData, 0, 0);
    idPerf.value = (finishTime - startTime).toString();
}
function forward_transform_horizontal(level) {
    for (let ih = 0; ih < height; ++ih) {
        waobj.instance.exports.dwt_forward(memR + ih * width, 1, width, level);
        waobj.instance.exports.dwt_forward(memG + ih * width, 1, width, level);
        waobj.instance.exports.dwt_forward(memB + ih * width, 1, width, level);
    }
}
function forward_transform_vertical(level) {
    for (let iw = 0; iw < width; ++iw) {
        waobj.instance.exports.dwt_forward(memR + iw, width, imgsize, level);
        waobj.instance.exports.dwt_forward(memG + iw, width, imgsize, level);
        waobj.instance.exports.dwt_forward(memB + iw, width, imgsize, level);
    }
}
function inverse_transform() {
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    const imagedecomp = new DataView(decompmem.buffer);

    let startTime = performance.now();
    for (let level = horLevels - 1; level >= 0; --level) {
        inverse_transform_horizontal(level);
    }
    for (let level = vertLevels - 1; level >= 0; --level) {
        inverse_transform_vertical(level);
    }
    let finishTime = performance.now();
    // planar to packed
    for (let ih = 0; ih < height; ++ih) {
        for (let iw = 0; iw < width; ++iw) {
            imageData.data[(ih * width + iw) * 4 + 0] = (imagedecomp.getUint32((memR + ih * width + iw) * 4, true) >> 12);
            imageData.data[(ih * width + iw) * 4 + 1] = (imagedecomp.getUint32((memG + ih * width + iw) * 4, true) >> 12);
            imageData.data[(ih * width + iw) * 4 + 2] = (imagedecomp.getUint32((memB + ih * width + iw) * 4, true) >> 12);
        }
    }
    ctx.putImageData(imageData, 0, 0);
    idPerf.value = (finishTime - startTime).toString();
}
function inverse_transform_horizontal(level) {
    for (let ih = 0; ih < height; ++ih) {
        waobj.instance.exports.dwt_inverse(memR + ih * width, 1, width, level);
        waobj.instance.exports.dwt_inverse(memG + ih * width, 1, width, level);
        waobj.instance.exports.dwt_inverse(memB + ih * width, 1, width, level);
    }
}
function inverse_transform_vertical(level) {
    for (let iw = 0; iw < width; ++iw) {
        waobj.instance.exports.dwt_inverse(memR + iw, width, imgsize, level);
        waobj.instance.exports.dwt_inverse(memG + iw, width, imgsize, level);
        waobj.instance.exports.dwt_inverse(memB + iw, width, imgsize, level);
    }
}
