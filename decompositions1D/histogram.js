function histogram(zoom) {
    let histoarr = new Uint32Array(new ArrayBuffer(2 * (1 << 8) * 4));
    for (let i = 0; i < inputfunc.length; i++) {
        if (inputfunc[i] != 0) {
            histoarr[(1 << 8) + inputfunc[i]]++;
        }
    }
    idHistogram.width = histowidth = histoarr.length;
    idHistogram.height = histoheight = 256;
    const ctx = idHistogram.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'cyan';
    ctx.moveTo(0, 255);
    for (let i = 0; i < histoarr.length; ++i) {
        ctx.lineTo(i, 255 - histoarr[i]);
    }
    ctx.stroke();
}