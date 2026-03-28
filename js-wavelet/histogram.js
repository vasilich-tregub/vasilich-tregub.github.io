// JavaScript source code
function histogram() {
    let histoarrR = new Uint32Array(new ArrayBuffer(2 * (1 << 20) * 4));
    let histoarrG = new Uint32Array(new ArrayBuffer(2 * (1 << 20) * 4));
    let histoarrB = new Uint32Array(new ArrayBuffer(2 * (1 << 20) * 4));
    for (let i = 0; i < imR.length; i++) {
        histoarrR[(1 << 20) + imR[i]]++;
        histoarrG[(1 << 20) + imG[i]]++;
        histoarrB[(1 << 20) + imB[i]]++;
    }
    idHistogram.width = histowidth = 256;
    idHistogram.height = histoheight = 256;
    const ctx = idHistogram.getContext("2d", { willReadFrequently: true });
    const histoData = ctx.createImageData(histowidth, histoheight);
    for (let ih = 0; ih < histoheight; ++ih) {
        for (let iw = 0; iw < histowidth; ++iw) {
            let ix = (ih * histowidth + iw) * 4;
            histoData.data[ix + 0] = 64;
            histoData.data[ix + 1] = 64;
            histoData.data[ix + 2] = 64;
            histoData.data[ix + 3] = 255;
        }
    }
    for (let i = 0; i < histoarrR.length; ++i) {
        if (histoarrR[i] != 0) {
            let ix = (Math.trunc(i * histowidth / histoarrR.length) + (histoheight - histoarrR[i]) * histowidth) * 4;
            histoData.data[ix + 0] = 255;
        }
        if (histoarrG[i] != 0) {
            let ix = (Math.trunc(i * histowidth / histoarrG.length) + (histoheight - histoarrG[i]) * histowidth) * 4; 
            histoData.data[ix + 1] = 255;
        }
        if (histoarrB[i] != 0) {
            let ix = (Math.trunc(i * histowidth / histoarrB.length) + (histoheight - histoarrB[i]) * histowidth) * 4; 
            histoData.data[ix + 2] = 225;
        }
    }
    ctx.putImageData(histoData, 0, 0);

    /*let bitposarr = new Uint32Array(new ArrayBuffer(32 * 4));
    let absbitposarr = new Uint32Array(new ArrayBuffer(32 * 4));
    for (let i = 0; i < comparr.length; i++) {
        for (let j = 0; j < 32; ++j) {
            if (comparr[i] & (1 << j)) {
                bitposarr[j]++;
            }
            if (Math.abs(comparr[i]) & (1 << j)) {
                absbitposarr[j]++;
            }
        }
    }
    let salertstr = '';
    let ualertstr = '';
    for (let i = 0; i < 32; i++) {
        salertstr += i + ':' + bitposarr[i] + '; ';
        ualertstr += i + ':' + absbitposarr[i] + '; ';
    }
    alert(salertstr + '\n\n' + ualertstr);*/
}