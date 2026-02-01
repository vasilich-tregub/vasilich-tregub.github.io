/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
var imR;
var imG;
var imB;
var imageData;
var horLevels;
var vertLevels;
function forward_transform() {
    const img = document.getElementById("idImgSrc");
    document.getElementById("idCanvas").width = img.naturalWidth;
    document.getElementById("idCanvas").height = img.naturalHeight;
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    // packed to planar color representation, and dwt for each bitplane
    imR = new Int32Array(new ArrayBuffer(img.naturalWidth * img.naturalHeight * 4));
    imG = new Int32Array(new ArrayBuffer(img.naturalWidth * img.naturalHeight * 4));
    imB = new Int32Array(new ArrayBuffer(img.naturalWidth * img.naturalHeight * 4));
    for (let ih = 0; ih < idCanvas.height; ++ih) {
        for (let iw = 0; iw < idCanvas.width; ++iw) {
            imR[ih * imageData.width + iw] = imageData.data[(ih * imageData.width + iw) * 4 + 0] << 12;
            imG[ih * imageData.width + iw] = imageData.data[(ih * imageData.width + iw) * 4 + 1] << 12;
            imB[ih * imageData.width + iw] = imageData.data[(ih * imageData.width + iw) * 4 + 2] << 12;
        }
    }
    if (idHorizontalLevels.value == 'undefined' || idHorizontalLevels.value < 0 || idHorizontalLevels.value > 5) {
        idHorizontalLevels.value = 0;
    }
    if (idVerticalLevels.value == 'undefined' || idVerticalLevels.value < 0 || idVerticalLevels.value > 2) {
        idVerticalLevels.value = 0;
    }
    if (idHorizontalLevels.value < idVerticalLevels.value) {
        idVerticalLevels.value = idHorizontalLevels.value;
    }
    horLevels = idHorizontalLevels.value;
    vertLevels = idVerticalLevels.value;
    for (let level = 0; level < vertLevels; ++level) {
        forward_transform_vertical(level);
        forward_transform_horizontal(level);
    }
    for (let level = vertLevels; level < horLevels; ++level) {
        forward_transform_horizontal(level);
    }
    for (let ih = 0; ih < idCanvas.height; ++ih) {
        for (let iw = 0; iw < idCanvas.width; ++iw) {
            imageData.data[(ih * imageData.width + iw) * 4 + 0] = (imR[ih * imageData.width + iw] >> 12) + 128;
            imageData.data[(ih * imageData.width + iw) * 4 + 1] = (imG[ih * imageData.width + iw] >> 12) + 128;
            imageData.data[(ih * imageData.width + iw) * 4 + 2] = (imB[ih * imageData.width + iw] >> 12) + 128;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
function forward_transform_horizontal(level) {
    for (let ih = 0; ih < idCanvas.height; ++ih) {
        dwt_forward(imR, ih * imageData.width, imageData.width, 1, level);
        dwt_forward(imG, ih * imageData.width, imageData.width, 1, level);
        dwt_forward(imB, ih * imageData.width, imageData.width, 1, level);
    }
}
function forward_transform_vertical(level) {
    for (let iw = 0; iw < idCanvas.width; ++iw) {
        dwt_forward(imR, iw, imageData.height, imageData.width, level);
        dwt_forward(imG, iw, imageData.height, imageData.width, level);
        dwt_forward(imB, iw, imageData.height, imageData.width, level);
    }
}
function inverse_transform() {
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });

    for (let level = horLevels - 1; level >= vertLevels; --level) {
        inverse_transform_horizontal(level);
    }
    for (let level = vertLevels - 1; level >= 0; --level) {
        inverse_transform_vertical(level);
        inverse_transform_horizontal(level);
    }
    for (let ih = 0; ih < idCanvas.height; ++ih) {
        for (let iw = 0; iw < idCanvas.width; ++iw) {
            imageData.data[(ih * imageData.width + iw) * 4 + 0] = imR[ih * imageData.width + iw] >> 12;
            imageData.data[(ih * imageData.width + iw) * 4 + 1] = imG[ih * imageData.width + iw] >> 12;
            imageData.data[(ih * imageData.width + iw) * 4 + 2] = imB[ih * imageData.width + iw] >> 12;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
function inverse_transform_horizontal(level) {
    for (let ih = 0; ih < idCanvas.height; ++ih) {
        dwt_inverse(imR, ih * imageData.width, imageData.width, 1, level);
        dwt_inverse(imG, ih * imageData.width, imageData.width, 1, level);
        dwt_inverse(imB, ih * imageData.width, imageData.width, 1, level);
    }
}
function inverse_transform_vertical(level) {
    for (let iw = 0; iw < idCanvas.width; ++iw) {
        dwt_inverse(imR, iw, imageData.height, imageData.width, level);
        dwt_inverse(imG, iw, imageData.height, imageData.width, level);
        dwt_inverse(imB, iw, imageData.height, imageData.width, level);
    }
}
function dwt_forward(im, beg, len, indexdiff, level) { // indexdiff = (hor dwt vs. vert dwt) ? 1 : bitmap_stride
    const inc = indexdiff << level;
    const end = beg + len * indexdiff;
    //assert(inc < end && "stepping outside source image");

    let i = beg + inc;
    // high pass filter, {-1./2, 1., -1./2}
    for (; i < end - inc; i += 2 * inc) {
        im[i] -= (im[i - inc] + im[i + inc]) >> 1;
    }
    if (i < end) {
        im[i] -= im[i - inc];
    }

    i = beg;
    // low pass filter, 
    // successive convolutions with {-1./2, 1., -1./2} for odd pixels
    // and {1./4, 1., 1./4} for even pixels
    // for im[n] result is -im[n-2]/8 + im[n-1]/4 + 6*im[n]/8 + im[n+1]/4 - im[n+2]/8
    // i.e., {-1./8, 2./8, 6./8, 2./8, -1./8}
    im[i] += (im[inc] + 1) >> 1;
    i += 2 * inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] += (im[i - inc] + im[i + inc] + 2) >> 2;
    }
    if (i < end) {
        im[i] += (im[i - inc] + 1) >> 1;
    }
}
function dwt_inverse(im, beg, len, indexdiff, level) { // indexdiff = (hor dwt vs. vert dwt) ? 1 : bitmap_stride
    const inc = indexdiff << level;
    const end = beg + len * indexdiff;
    //assert(inc < end && "stepping outside source image");

    // low pass filter, {-1./4, 1./4, -1./4}
    let i = beg;
    im[i] -= (im[inc] + 1) >> 1;
    i += 2 * inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] -= (im[i - inc] + im[i + inc] + 2) >> 2;
    }
    if (i < end) {
        im[i] -= (im[i - inc] + 1) >> 1;
    }

    // high pass filter, {-1./8, 1./8, 6./8, 1./8 -1./8}
    // successive convolutions with {-1./4, 1., -1./4} for even pixels
    // and {1./2, 1., 1./2} for even pixels
    // for im[n] result is -im[n-2]/8 + im[n-1]/8 + 6*im[n]/8 + im[n+1]/8 - im[n+2]/8
    i = beg + inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] += (im[i - inc] + im[i + inc]) >> 1;
    }
    if (i < end) {
        im[i] += im[i - inc];
    }
}
