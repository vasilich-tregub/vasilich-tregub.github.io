var waobj;
var decompmem;
WebAssembly.instantiateStreaming(
    fetch("wavelet.wasm"), {
    //js: { mem: decompmem },
}).then((obj) => {
    waobj = obj;
    decompmem = obj.instance.exports.memory;
});

var im;
var x_im;


var memR;
var memG;
var memB;
var width;
var height;
var width8;
var height8;
var imgsize;
var imgsize8;
var imageData;
var horLevels;
var vertLevels;
function forward_transform(img) {
    const imagedecomp = new DataView(decompmem.buffer);
    //const img = document.getElementById("idImgSrc");
    width = img.naturalWidth;
    height = img.naturalHeight;
    imgsize = width * height;
    width8 = width << 2;
    height8 = height << 2;
    imgsize8 = imgsize << 2;
    document.getElementById("idCanvas").width = width;
    document.getElementById("idCanvas").height = height;
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, width, height);
    // packed to planar color representation, and dwt for each bitplane
    memR = 0;
    memG = memR + imgsize8;
    memB = memG + imgsize8;
    for (let ih = 0; ih < imgsize8; ih += width8) {
        for (let iw = 0; iw < width8; iw += 4) {
            imagedecomp.setUint32((memR + ih + iw), imageData.data[(ih + iw) + 0] << 12, true);
            imagedecomp.setUint32((memG + ih + iw), imageData.data[(ih + iw) + 1] << 12, true);
            imagedecomp.setUint32((memB + ih + iw), imageData.data[(ih + iw) + 2] << 12, true);
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
    for (let ih = 0; ih < imgsize8; ih += width8) {
        for (let iw = 0; iw < width8; iw += 4) {
            imageData.data[(ih + iw) + 0] = (imagedecomp.getUint32((memR + ih + iw), true) >> 12);
            imageData.data[(ih + iw) + 1] = (imagedecomp.getUint32((memG + ih + iw), true) >> 12);
            imageData.data[(ih + iw) + 2] = (imagedecomp.getUint32((memB + ih + iw), true) >> 12);
        }
    }
    ctx.putImageData(imageData, 0, 0);
    idPerf.value = (finishTime - startTime).toString();
}
function forward_transform_horizontal(level) {
    let inc = (1 << level) << 2;
    for (let ih = 0; ih < imgsize8; ih += width8) {
        waobj.instance.exports.dwt_forward_hor(memR + ih, width8, inc);
        waobj.instance.exports.dwt_forward_hor(memG + ih, width8, inc);
        waobj.instance.exports.dwt_forward_hor(memB + ih, width8, inc);
    }
}
function forward_transform_vertical(level) {
    const inc = width8 << level;
    let ih = inc;
    waobj.instance.exports.dwt_forward_vert_first(inc, memR + ih - inc, memR + ih, memR + ih + inc, width8);
    waobj.instance.exports.dwt_forward_vert_first(inc, memG + ih - inc, memG + ih, memG + ih + inc, width8);
    waobj.instance.exports.dwt_forward_vert_first(inc, memB + ih - inc, memB + ih, memB + ih + inc, width8);
    ih += 2 * inc;
    for (; ih < imgsize8 - inc; ih += 2 * inc) {
        waobj.instance.exports.dwt_forward_vert(memR + ih - (inc << 1), memR + ih - inc, memR + ih, memR + ih + inc, width8);
        waobj.instance.exports.dwt_forward_vert(memG + ih - (inc << 1), memG + ih - inc, memG + ih, memG + ih + inc, width8);
        waobj.instance.exports.dwt_forward_vert(memB + ih - (inc << 1), memB + ih - inc, memB + ih, memB + ih + inc, width8);
    }
    if (ih < imgsize8) {
        waobj.instance.exports.dwt_forward_vert_last(memR + ih - (inc << 1), memR + ih - inc, memR + ih, width8);
        waobj.instance.exports.dwt_forward_vert_last(memG + ih - (inc << 1), memG + ih - inc, memG + ih, width8);
        waobj.instance.exports.dwt_forward_vert_last(memB + ih - (inc << 1), memB + ih - inc, memB + ih, width8);
    }
    else if (ih - inc < imgsize8) {
        waobj.instance.exports.dwt_forward_vert_lastelse(memR + ih - (inc << 1), memR + ih - inc, width8);
        waobj.instance.exports.dwt_forward_vert_lastelse(memG + ih - (inc << 1), memG + ih - inc, width8);
        waobj.instance.exports.dwt_forward_vert_lastelse(memB + ih - (inc << 1), memB + ih - inc, width8);
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
    for (let ih = 0; ih < imgsize8; ih += width8) {
        for (let iw = 0; iw < width8; iw += 4) {
            imageData.data[(ih + iw) + 0] = (imagedecomp.getUint32((memR + ih + iw), true) >> 12);
            imageData.data[(ih + iw) + 1] = (imagedecomp.getUint32((memG + ih + iw), true) >> 12);
            imageData.data[(ih + iw) + 2] = (imagedecomp.getUint32((memB + ih + iw), true) >> 12);
        }
    }
    ctx.putImageData(imageData, 0, 0);
    idPerf.value = (finishTime - startTime).toString();
}
function inverse_transform_horizontal(level) {
    for (let ih = 0; ih < imgsize; ih += width) {
        waobj.instance.exports.dwt_inverse((memR >> 2) + ih, 1, width, level);
        waobj.instance.exports.dwt_inverse((memG >> 2) + ih, 1, width, level);
        waobj.instance.exports.dwt_inverse((memB >> 2) + ih, 1, width, level);
    }
}
function inverse_transform_vertical(level) {
    for (let iw = 0; iw < width; ++iw) {
        waobj.instance.exports.dwt_inverse((memR >> 2) + iw, width, imgsize, level);
        waobj.instance.exports.dwt_inverse((memG >> 2) + iw, width, imgsize, level);
        waobj.instance.exports.dwt_inverse((memB >> 2) + iw, width, imgsize, level);
    }
}
