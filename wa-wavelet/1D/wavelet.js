// JavaScript source code

//window.onload = () => {
    /*const radios = document.querySelectorAll('input[name="lastState"]');
    const allStateCodes = document.querySelectorAll('input[name="stateCodes"]');

    radios.forEach(radio => {
        radio.addEventListener('change', event => {
            allStateCodes.forEach(stateCode => {
                stateCode.value = '';
            });
            idShifts.innerHTML = "Shifts:"
            idTapeDisplay.innerHTML = "Tape content:"
        })
    })*/
//}

function textareaSize(checkbox) {
    if (checkbox.checked) {
        var viewportWidth = document.documentElement.clientWidth - 20;
        var viewportHeight = document.documentElement.clientHeight - 200;
        idImage.style.width = viewportWidth + 'px';
        idImage.style.height = viewportHeight / 2 + 'px';
        idXform.style.width = viewportWidth + 'px';
        idXform.style.height = viewportHeight / 2 + 'px';
    }
    else {
        idImage.style.width = null;
        idImage.style.height = null;
        let cssStyle = document.defaultView.getComputedStyle(idImage, null);
        idImage.style.width = cssStyle.getPropertyValue('width');
        idImage.style.height = cssStyle.getPropertyValue('height');
        idXform.style.width = cssStyle.getPropertyValue('width');
        idXform.style.height = cssStyle.getPropertyValue('height');
    }
}

const importObject = {
};

const immemory = new WebAssembly.Memory({
    initial: 10,
    maximum: 100,
});

var waobj;
var im = new Int32Array([7, 10, 8, 6, 4, 1, 3, 7]);
WebAssembly.instantiateStreaming(
    fetch("wavelet.wasm"), {
    js: { mem: immemory },
    //importObject
}).then((obj) => {
    waobj = obj;
});

var im;
var x_im;

function forward_transform() {
    const image = new DataView(immemory.buffer);
    let len = im.length;
    for (let i = 0; i < 8; i++) {
        image.setUint32(i * 4, im[i] * 256 * 16, true); // WebAssembly is little endian
    }
    let string = '';
    for (let i = 0; i < len; ++i) {
        string += im[i] + ";";
    }
    idImage.innerHTML = string;

    waobj.instance.exports.dwt_forward(8, 0);
    waobj.instance.exports.dwt_forward(8, 1);
    waobj.instance.exports.dwt_forward(8, 2);

    string = '';
    for (let i = 0; i < len; ++i) {
        string += image.getInt32(i * 4, true) + ";";
    }
    idXform.innerHTML = string;
}
function inverse_transform() {
    const image = new DataView(immemory.buffer);

    waobj.instance.exports.dwt_inverse(8, 2);
    waobj.instance.exports.dwt_inverse(8, 1);
    waobj.instance.exports.dwt_inverse(8, 0);

    string = '';
    for (let i = 0; i < im.length; ++i) {
        string += image.getInt32(i * 4, true) / 256 / 16 + ";";
    }
    idImage.innerHTML += '\n' + string;
}
function forward_transform_js() {
	let len = im.length;

    let string = '';
    for (let i = 0; i < len; ++i) {
        string += im[i] + ";";
        im[i] *= 256 * 16;
    }

    idImage.innerHTML = string;

    dwt_forward(0);
    dwt_forward(1);
    dwt_forward(2);

    string = '';
    for (let i = 0; i < len; ++i) {
        string += im[i] + ";";
    }
    idXform.innerHTML = string;
}
function inverse_transform_js() {
    dwt_inverse(2);
    dwt_inverse(1);
    dwt_inverse(0);

    string = '';
    for (let i = 0; i < im.length; ++i) {
        string += im[i] / 256.0 / 16 + ";";
    }
    idImage.innerHTML += '\n' + string;
}

function dwt_forward(level) {
    const inc = 1 << level;
	const end = im.length;
    //assert(inc < end && "stepping outside source image");

	let i = inc;
    // high pass filter, {-1./2, 1., -1./2}
    for (; i < end - inc; i += 2 * inc) {
        im[i] -= (im[i - inc] + im[i + inc]) >> 1;
    }
    if (i < end) {
        im[i] -= im[i - inc];
    }

    i = 0;
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
function dwt_inverse(level) {
    const inc =  1 << level;
	const end = im.length;
    //assert(inc < end && "stepping outside source image");

	// low pass filter, {-1./4, 1./4, -1./4}
	let i = 0;
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
    i = inc;
    for (; i < end - inc; i += 2 * inc) {
        im[i] += (im[i - inc] + im[i + inc]) >> 1;
    }
    if (i < end) {
        im[i] += im[i - inc];
    }
}
