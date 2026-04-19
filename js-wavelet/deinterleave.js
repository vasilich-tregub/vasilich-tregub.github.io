/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function deinterleave() {
    // de-interleave coefficients for test imaging:     
    let Fq = 0; // Bw - color_bit_depth
    let rs = 1 << Fq; // right shift, ==1 for this exercise
    let a = 1;
    let deiy = 0; // pixel Y of deinterleaved decomposition
    for (let vlvl = vertLevels; vlvl >= 0; --vlvl) {
        let incy = 2 << vlvl;
        if (vlvl == vertLevels) {
            incy = 1 << vlvl;
        }
        for (let iy = 1 << vlvl; iy < height; iy += incy, ++deiy) {
            let deix = 0; // pixel X of deinterleaved decomposition
            for (let lvl = horLevels; lvl >= 0; --lvl) {
                let incx = 2 << lvl;
                if (lvl == horLevels) {
                    incx = 1 << lvl;
                }
                for (let ix = 1 << lvl; ix < width; ix += incx, ++deix) {
                    let iLL = deiy * width + deix;
                    let iCC = iy * width + ix;
                    a = (vlvl == vertLevels && lvl == horLevels) ? 1 : 4; // to highlight wavelet coefficients
                    imageData.data[iLL * 4 + 0] = a * imR[iCC]; // red 
                    imageData.data[iLL * 4 + 1] = a * imG[iCC]; // green 
                    imageData.data[iLL * 4 + 2] = a * imB[iCC]; // blue 
                }
            }
        }
    }
    const ctx = document.getElementById("idCanvas").getContext("2d", { willReadFrequently: true });
    ctx.putImageData(imageData, 0, 0);
    save('deinterleaved.gzip', imageData.data)
}
async function save(fileName, ...arr) {
    //const byteArray = new Uint8Array([0x6f, 0x63, 0x74, 0x65, 0x74, 0x2d, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d]);
    const blob = new Blob([...arr], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    //a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
    const compressedstream = blob.stream().pipeThrough(new CompressionStream("gzip"));
    const compressedblob = await new Response(compressedstream).blob()
    const compressedurl = URL.createObjectURL(compressedblob);
    const compresseda = document.createElement('a');
    compresseda.href = compressedurl;
    compresseda.download = fileName + '.zip';
    document.body.appendChild(compresseda);
    //compresseda.click();
    document.body.removeChild(compresseda);
    URL.revokeObjectURL(compressedurl); // Clean up
    idInputSize.innerText = 'Size = ' + blob.size + '; Compressed size = ' + compressedblob.size;
}
