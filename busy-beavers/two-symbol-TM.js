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
var XX = 0;
var AA = 0;
var BB = 0;
var CC = 0;
var DD = 0;
var EE = 0;
var FF = 0;

const TAPE_LEN = 200000;

var POS = TAPE_LEN / 2;
var MIN_POS = 0;
var MAX_POS = TAPE_LEN - 1;
const TAPE = [];

function increment(count) {
    XX++; count++;
}

function action(state) {
    TAPE[POS] = state[0];
    if (state[1] == 'R')
        POS++;
    else
        POS--;
    tmstate = state[2];
}
function instruction(state0, state1) {
    if (POS < 0 || POS > TAPE_LEN) {
        alert("POS %d outside TAPE LEN"/*, POS*/);
        //exit(0);
    }
    if (TAPE[POS] == '0')
        action(state0);
    else
        action(state1);
}

function runTM() {
    if (tmstate == 0) {
        alert("Use radio buttons at A/B/C/D/E to select number of states");
        return;
    }
    MIN_POS = 0;
    MAX_POS = TAPE_LEN - 1;
    XX = 0;
    AA = 0;
    BB = 0;
    CC = 0;
    DD = 0;
    EE = 0;
    FF = 0;
    XX = 0;
    TAPE.splice(0);
    for (let i = 0; i < TAPE_LEN; ++i)
        TAPE.push('0');

    tmstate = STATE_A;
    let loop = true;
    while (loop) {
        switch (tmstate) {
            case STATE_A:
                increment(AA);
                instruction(state0A.value, state1A.value);
                break;
            case STATE_B:
                increment(BB);
                instruction(state0B.value, state1B.value);
                break;
            case STATE_C:
                increment(CC);
                instruction(state0C.value, state1C.value);
                break;
            case STATE_D:
                increment(DD);
                instruction(state0D.value, state1D.value);
                break;
            case STATE_E:
                increment(EE);
                instruction(state0E.value, state1E.value);
                break;
            case STATE_F:
                increment(FF);
                instruction(state0F.value, state1F.value);
                break;
            case STATE_H:
                loop = false;
                break;
        }
    }
    //alert(XX);
    const tapeToShow = TAPE.slice(TAPE_LEN / 2 - 50, TAPE_LEN / 2 + 50);
    idTapeDisplay.innerHTML = tapeToShow;
}
