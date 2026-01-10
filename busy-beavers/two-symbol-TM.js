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
    maxShifts = idMaxShifts.value; // max shifts, both left/right
    if (tmstate == 0) {
        alert("Use radio buttons at A/B/C/D/E to select number of states");
        return;
    }
    shifts = 0;
    TAPE = ['0'];
    ZEROPOS = POS = 0;

    tmstate = STATE_A;
    loop = true;
    while (loop) {
        switch (tmstate) {
            case STATE_A:
                instruction(state0A.value, state1A.value);
                break;
            case STATE_B:
                instruction(state0B.value, state1B.value);
                break;
            case STATE_C:
                instruction(state0C.value, state1C.value);
                break;
            case STATE_D:
                instruction(state0D.value, state1D.value);
                break;
            case STATE_E:
                instruction(state0E.value, state1E.value);
                break;
            case STATE_F:
                instruction(state0F.value, state1F.value);
                break;
            case STATE_H:
                loop = false;
                break;
        }
    }
    idShifts.innerHTML = shifts.toString();
    if (ZEROPOS <= POS)
        idTapeDisplay.innerHTML = TAPE.toSpliced(ZEROPOS, 0, '^').toSpliced(POS + 2, 0, '.').join('');
    else
        idTapeDisplay.innerHTML = TAPE.toSpliced(POS + 1, 0, '.').toSpliced(ZEROPOS + 2, 0, '^').join('');
}
