// JavaScript source code

window.onload = () => {
    const radios = document.querySelectorAll('input[name="lastState"]');
    const allStateCodes = document.querySelectorAll('input[name="stateCodes"]');

    radios.forEach(radio => {
        radio.addEventListener('change', event => {
            allStateCodes.forEach(stateCode => {
                stateCode.value = '';
            });
            idShifts.innerHTML = "Shifts:"
            idTapeDisplay.innerHTML = "Tape content:"
            tmstate = STATE_A;
            switch (event.target.value) { 
                case '1':
                    idState0A.value = '1RH';
                    idMaxShifts.value = 2;
                    break;
                case '2':
                    idState0A.value = '1RB';
                    idState1A.value = '1LB';
                    idState0B.value = '1LA';
                    idState1B.value = '1RH';
                    idMaxShifts.value = 7;
                    break;
                case '3':
                    idState0A.value = '1RB';
                    idState1A.value = '1RH';
                    idState0B.value = '0RC';
                    idState1B.value = '1RB';
                    idState0C.value = '1LC';
                    idState1C.value = '1LA';
                    idMaxShifts.value = 15;
                    break;
                case '4':
                    idState0A.value = '1RB';
                    idState1A.value = '1LB';
                    idState0B.value = '1LA';
                    idState1B.value = '0LC';
                    idState0C.value = '1RH';
                    idState1C.value = '1LD';
                    idState0D.value = '1RD';
                    idState1D.value = '0RA';
                    idMaxShifts.value = 108;
                    break;
                case '5':
                    idState0A.value = '1RB';
                    idState1A.value = '1LC';
                    idState0B.value = '1RC';
                    idState1B.value = '1RB';
                    idState0C.value = '1RD';
                    idState1C.value = '0LE';
                    idState0D.value = '1LA';
                    idState1D.value = '1LD';
                    idState0E.value = '1RH';
                    idState1E.value = '0LA';
                    idMaxShifts.value = 47176871;
                    break;
                case '6':
                    idState0A.value = '1RB';
                    idState1A.value = '0LD';
                    idState0B.value = '1RC';
                    idState1B.value = '0RF';
                    idState0C.value = '1LC';
                    idState1C.value = '1LA';
                    idState0D.value = '0LE';
                    idState1D.value = '1RH';
                    idState0E.value = '1LF';
                    idState1E.value = '0RB';
                    idState0F.value = '0RC';
                    idState1F.value = '0RE';
                    break;
                case '6BB':
                    idState0A.value = '1RB';
                    idState1A.value = '1RA';
                    idState0B.value = '1RC';
                    idState1B.value = '1RH';
                    idState0C.value = '1LD';
                    idState1C.value = '0RF';
                    idState0D.value = '1RA';
                    idState1D.value = '0LE';
                    idState0E.value = '0LD';
                    idState1E.value = '1RC';
                    idState0F.value = '1RA';
                    idState1F.value = '0RE';
                    break;
            }
        })
    })
}

function textareaSize(checkbox) {
    if (checkbox.checked) {
        var viewportWidth = document.documentElement.clientWidth - 20;
        var viewportHeight = document.documentElement.clientHeight - 200;
        idTapeDisplay.style.width = viewportWidth + 'px';
        idTapeDisplay.style.height = viewportHeight + 'px';
    }
    else {
        idTapeDisplay.style.width = null;
        idTapeDisplay.style.height = null;
        let cssStyle = document.defaultView.getComputedStyle(idTapeDisplay, null);
        idTapeDisplay.style.width = cssStyle.getPropertyValue('width');
        idTapeDisplay.style.height = cssStyle.getPropertyValue('height');
    }
}

function ruleChanged(rulestr) {
    var rule = rulestr.value;
    if (!(rule[0] == '0' || rule[0] == '1') ||
        !(rule[1] == 'L' || rule[1] == 'R') ||
        !(rule[2] == 'A' || rule[2] == 'B' || rule[2] == 'C' || rule[2] == 'D' || rule[2] == 'E' || rule[2] == 'F' || rule[2] == 'H'))
        {
            rulestr.value = '';
        }
}

const importObject = {
};

var waobj;
var waTMruleArr;
var waTMruleArrDV;
var waTMruleScrArr;
var waTMruleScrArrDV;
var waTMruleBidirArr;
var waTMruleBidirArrDV;
var waTMruleStateArr;
var waTMruleStateDV;

WebAssembly.instantiateStreaming(
    fetch("bb.wasm"),
    importObject
).then((obj) => {
    // Get exported memory
    waobj = obj;
    waTMruleArr = obj.instance.exports.waTMruleArr;
    waTMruleArrDV = new DataView(waTMruleArr.buffer);
    waTMruleScrArr = obj.instance.exports.waTMruleScrArr;
    waTMruleScrArrDV = new DataView(waTMruleScrArr.buffer);
    waTMruleBidirArr = obj.instance.exports.waTMruleBidirArr;
    waTMruleBidirArrDV = new DataView(waTMruleBidirArr.buffer);
    waTMruleStateArr = obj.instance.exports.waTMruleStateArr;
    waTMruleStateArrDV = new DataView(waTMruleStateArr.buffer);
    // Log memory
    //obj.instance.exports.logAllMemory();
});
function runWasmTM(ruleix) {
    let jsTMruleArr = new Int32Array(48);
    var jsTMruleScrArr = new Int32Array(48);
    var jsTMruleBidirArr = new Int32Array(48);
    var jsTMruleStateArr = new Int32Array(48);
    let domRuleArr = [idState0A, idState1A, idState0B, idState1B, idState0C, idState1C, idState0D, idState1D, idState0E, idState1E, idState0F, idState1F];
    for (let i = 0; i < 12; ++i) {
        let rule = domRuleArr[i].value;
        jsTMruleArr[i] = rule[0] * 0x10000 + ((rule[1] == 'R') ? 0 : 1) * 0x100 + (rule.charCodeAt(2) - 0x41);
        jsTMruleScrArr[i] = rule[0];
        jsTMruleBidirArr[i] = ((rule[1] == 'R') ? 1 : -1);
        jsTMruleStateArr[i] = (rule.charCodeAt(2) - 0x41);
    }
    for (let i = 0; i < 12; ++i) {
        waTMruleArrDV.setInt32(4 * i, jsTMruleArr[i], true);
        waTMruleScrArrDV.setInt32(4 * i, jsTMruleScrArr[i], true);
        waTMruleBidirArrDV.setInt32(4 * i, jsTMruleBidirArr[i], true);
        waTMruleStateArrDV.setInt32(4 * i, jsTMruleStateArr[i], true);
    }

    waobj.instance.exports.startWaTM(ruleix);
}
function viewWasmTMrules() {
    let jsTMruleArr = new Int32Array(48);
    for (let i = 0; i < 12; ++i)
        jsTMruleArr[i] = waTMruleArrDV.getInt32(4 * i, true);

    let str = '';
    for (let i = 0; i < 12; ++i)
        str += jsTMruleArr[i].toString(16) + "; ";
    idWasmRulesDisplay.value = str;
}
function viewWasmTape() {
    let tapeCells = new Int32Array(48);
    let waTapeDV = new DataView(waobj.instance.exports.tapepos.buffer);
    for (let i = 32768 - 20; i < 32768 + 20; ++i)
        tapeCells[i - 32768 + 20] = waTapeDV.getUint8(i, true);

    let str = '';
    for (let i = 32768 - 20; i < 32768 + 20; ++i)
        str += tapeCells[i - 32768 + 20].toString(16) + "; ";
    //const bytes = new Uint8Array(waobj.instance.exports.tapepos.buffer, 0, 12);
    //const string = new TextDecoder("utf-8").decode(bytes);
    idWasmRulesDisplay.value = str;
}