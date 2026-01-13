// 2 symbol Turing Machine
var tmstates;
const STATE_A = 'A';
const STATE_B = 'B';
const STATE_C = 'C';
const STATE_D = 'D';
const STATE_E = 'E';
const STATE_F = 'F';
const STATE_H = 'H';

var tmstate = 0;
var shifts = 0; // max shifts function S, noncomputable

var ZEROPOS = 0;
var POS = 0;
var TAPE = [];
var maxShifts = 0;
var loop = false;

function action(state) {
    if (state == '') {
        loop = false;
        alert("NO RULE GIVEN, STOP");
        return;
    }
    TAPE[POS] = state[0];
    if (state[1] == 'R') {
        if (POS == TAPE.length - 1)
            TAPE.push('0');
        POS++;
    }
    else {
        if (POS == 0) {
            TAPE.unshift('0');
            ZEROPOS++;
        }
        else
            POS--;
    }
    tmstate = state[2];
}
function instruction(state0, state1) {
    if (shifts >= maxShifts) {
        loop = false;
        return;
    }
    shifts++;
    if (TAPE[POS] == '0')
        action(state0);
    else
        action(state1);
}

function runTM() {
    let state0A = idState0A.value;
    let state1A = idState1A.value;
    let state0B = idState0B.value;
    let state1B = idState1B.value;
    let state0C = idState0C.value;
    let state1C = idState1C.value;
    let state0D = idState0D.value;
    let state1D = idState1D.value;
    let state0E = idState0E.value;
    let state1E = idState1E.value;
    let state0F = idState0F.value;
    let state1F = idState1F.value;
    maxShifts = idMaxShifts.value; // max shifts, both left/right
    shifts = 0;
    TAPE = ['0'];
    ZEROPOS = POS = 0;

    tmstate = STATE_A;
    loop = true;
    const startTime = performance.now();
    while (loop) {
        switch (tmstate) {
            case STATE_A:
                instruction(state0A, state1A);
                break;
            case STATE_B:
                instruction(state0B, state1B);
                break;
            case STATE_C:
                instruction(state0C, state1C);
                break;
            case STATE_D:
                instruction(state0D, state1D);
                break;
            case STATE_E:
                instruction(state0E, state1E);
                break;
            case STATE_F:
                instruction(state0F, state1F);
                break;
            case STATE_H:
                loop = false;
                break;
        }
    }
    const endTime = performance.now();
    idPerf.value = endTime - startTime;
    idShifts.innerHTML = shifts.toString();
    if (ZEROPOS <= POS)
        idTapeDisplay.innerHTML = TAPE.toSpliced(ZEROPOS, 0, '^').toSpliced(POS + 2, 0, '.').join('');
    else
        idTapeDisplay.innerHTML = TAPE.toSpliced(POS + 1, 0, '.').toSpliced(ZEROPOS + 2, 0, '^').join('');
}
