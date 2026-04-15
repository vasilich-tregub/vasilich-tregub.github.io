function plot() {
    idInput.width = width;
    idInput.height = height;
    const ctx = document.getElementById("idInput").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'cyan';
    ctx.moveTo(0, 255);
    let shr = idBw.value - 8; // (wavelet_bit_precision - image_bit_depth)
    for (let i = 0; i < width; ++i) {
        ctx.lineTo(i, 255 - (inputfunc[i] >> shr));
    }
    ctx.stroke();
}
