const width = 2048;
const height = 256;
var inputfunc;
function buildinput() {
    inputfunc = new Int16Array(width * 2);
    for (let i = 0; i < width; ++i) {
        //inputfunc[i] = Math.floor(i * i / 4153 + height / 2 * Math.random() / 11) % 237;
        inputfunc[i] = (height / 2 * (1 - Math.cos(7 * i * Math.PI * Math.sin(2 * i / width * Math.PI) / width + Math.random() / 11))) % 256;
    }
    save('inputfunc.bin', inputfunc);
    plot();
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
    compresseda.click();
    document.body.removeChild(compresseda);
    URL.revokeObjectURL(compressedurl); // Clean up
}
const readFile = e => {
  const file = e.target.files[0]
  let reader = new FileReader();

  reader.onload = function(e) {
      let arrayBuffer = new Uint8Array(reader.result);
      console.log(arrayBuffer);
  }

  reader.readAsArrayBuffer(file);
}
window.onload = (event) => {
    document.querySelector("#fileItem").onchange=readFile
}
var levels;
function forward_transform() {
    for (let i = 0; i < idLevels.value; ++i) {
        dwt_forward(inputfunc, 1 << i);
    }
    save('dwt-inputfunc.bin', inputfunc);
    plot();
}
function inverse_transform() {
    for (let i = idLevels.value - 1; i >= 0; --i) {
        dwt_inverse(inputfunc, 1 << i);
    }
    plot();
}
function dwt_forward(im, inc) { // indexdiff = (hor vs. vert) ? 1 : bitmap_stride;
    //assert(inc < end && "stepping outside source image");

    let end = width;
    let i = inc;
    // high pass filter, {-1./2, 1., -1./2}
    // and low pass filter,
    // successive convolutions with {-1./2, 1., -1./2} for odd pixels
    // and {1./4, 1., 1./4} for even pixels
    // for im[n] result is -im[n-2]/8 + im[n-1]/4 + 6*im[n]/8 + im[n+1]/4 - im[n+2]/8
    // i.e., {-1./8, 2./8, 6./8, 2./8, -1./8}
    if (i >= end - inc) {
        im[i] -= im[i - inc];
        im[i - inc] += (im[i] + 1) >> 1;
        return;
    }
    im[i] -= (im[i - inc] + im[i + inc]) >> 1;
    im[i - inc] += (im[i] + 1) >> 1;
    i += 2 * inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] -= (im[i - inc] + im[i + inc]) >> 1;
        im[i - inc] += (im[i - 2 * inc] + im[i] + 2) >> 2;
    }
    if (i < end) {
        im[i] -= im[i - inc];
        im[i - inc] += (im[i - 2 * inc] + im[i] + 2) >> 2;
    }
    else if (i - inc < end) {
        im[i - inc] += (im[i - 2 * inc] + 1) >> 1;
    }
}
function dwt_inverse(im, inc) { // indexdiff = (hor vs. vert) ? 1 : bitmap_stride;
    const end = width;
    //assert(inc < end && "stepping outside source image");

    // low pass filter, {-1./4, 1., -1./4}
    let i = 0;
    im[i] -= (im[i + inc] + 1) >> 1;
    i += 2 * inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] -= (im[i - inc] + im[i + inc] + 2) >> 2;
    }
    if (i < end) {
        im[i] -= (im[i - inc] + 1) >> 1;
    }

    // high pass filter, {-1./8, 1./8, 6./8, 1./8 -1./8}
    // successive convolutions with {-1./4, 1., -1./4} for even pixels
    // and {1./2, 1., 1./2} for odd pixels
    // for im[n] result is -im[n-2]/8 + im[n-1]/8 + 6*im[n]/8 + im[n+1]/8 - im[n+2]/8
    i = inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] += (im[i - inc] + im[i + inc]) >> 1;
    }
    if (i < end) {
        im[i] += im[i - inc];
    }
}
