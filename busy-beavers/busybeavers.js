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
        idTapeDisplay.style.width = cssStyle.getPropertyValue(width);
        idTapeDisplay.style.height = cssStyle.getPropertyValue(height);
    }
}

function ruleChanged(rulestr) {
    var rule = rulestr.value;
    if (!(rule[0] == '0' || rule[0] == '1') &&
        !(rule[1] == 'L' || rule[1] == 'R') &&
        !(rule[2] == 'A' || rule[2] == 'B' || rule[2] == 'C' || rule[2] == 'D' || rule[2] == 'E' || rule[2] == 'F' || rule[2] == 'H'))
        {
            rulestr.value = '0LH';
        }
}