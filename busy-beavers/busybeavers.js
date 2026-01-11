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
                    state0A.value = '1RH';
                    break;
                case '2':
                    state0A.value = '1RB';
                    state1A.value = '1LB';
                    state0B.value = '1LA';
                    state1B.value = '1RH';
                    break;
                case '3':
                    state0A.value = '1RB';
                    state1A.value = '1RH';
                    state0B.value = '0RC';
                    state1B.value = '1RB';
                    state0C.value = '1LC';
                    state1C.value = '1LA';
                    break;
                case '4':
                    state0A.value = '1RB';
                    state1A.value = '1LB';
                    state0B.value = '1LA';
                    state1B.value = '0LC';
                    state0C.value = '1RH';
                    state1C.value = '1LD';
                    state0D.value = '1RD';
                    state1D.value = '0RA';
                    break;
                case '5':
                    state0A.value = '1RB';
                    state1A.value = '1LC';
                    state0B.value = '1RC';
                    state1B.value = '1RB';
                    state0C.value = '1RD';
                    state1C.value = '0LE';
                    state0D.value = '1LA';
                    state1D.value = '1LD';
                    state0E.value = '1RH';
                    state1E.value = '0LA';
                    break;
                case '6':
                    state0A.value = '1RB';
                    state1A.value = '0LD';
                    state0B.value = '1RC';
                    state1B.value = '0RF';
                    state0C.value = '1LC';
                    state1C.value = '1LA';
                    state0D.value = '0LE';
                    state1D.value = '1RH';
                    state0E.value = '1LF';
                    state1E.value = '0RB';
                    state0F.value = '0RC';
                    state1F.value = '0RE';
                    break;
                case '6BB':
                    state0A.value = '1RB';
                    state1A.value = '0LD';
                    state0B.value = '0RC';
                    state1B.value = '1RB';
                    state0C.value = '1RD';
                    state1C.value = '1RF';
                    state0D.value = '0LE';
                    state1D.value = '1LD';
                    state0E.value = '1LA';
                    state1E.value = '1LE';
                    state0F.value = '1RH';
                    state1F.value = '0RB';
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