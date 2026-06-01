/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
// TODO: MACROS for quaternary-digit coords: Qx3 = b11 (3), Qx10 = b1_00 (4), Qx21 = b10_01 etc.
var rank = 16;
var a;
function solve() {
    let u = new Float64Array(rank);
    a = new Array(rank);
    for (let i = 0; i < rank; ++i) {
        a[i] = new Float64Array(rank + 1);
        for (let j = 0; j <= rank; ++j) {
            a[i][j] = 0;
        }
    }
    a[0][0] = -3.0;
    a[0][1] = +1.0;
    a[0][2] = +1.0;
    a[0][3] = +1.0;

    a[1][1]   = -3.0;
    a[1][0]   = +1.0;
    a[1][0xB] = +1.0;
    a[1][0xE]   = +1.0;

    a[2][2]   = -3.0;
    a[2][0]   = +1.0;
    a[2][0xD] = +1.0;
    a[2][7]   = +1.0;

    a[3][3]   = -3.0;
    a[3][0]   = +1.0;
    a[3][6]   = +1.0;
    a[3][9] = +1.0;

    a[4][4] = -3.0;
    a[4][5] = +1.0;
    a[4][6] = +1.0;
    a[4][7] = +1.0;

    a[5][5] = +1.0;
    a[5][rank] = Number(boundary11.value);
    a[6][6] = +1.0;
    a[6][rank] = Number(boundary12.value);
    a[7][7] = +1.0;
    a[7][rank] = Number(boundary13.value);

    a[8][8]   = -3.0;
    a[8][0xB] = +1.0;
    a[8][9]   = +1.0;
    a[8][0xA] = +1.0;

    a[9][9] = +1.0;
    a[9][rank] = Number(boundary21.value);
    a[0xA][0xA] = +1.0;
    a[0xA][rank] = Number(boundary22.value);
    a[0xB][0xB] = +1.0;
    a[0xB][rank] = Number(boundary23.value);

    a[0xC][0xC] = -3.0;
    a[0xC][0xD] = +1.0;
    a[0xC][0xE] = +1.0;
    a[0xC][0xF] = +1.0;

    a[0xD][0xD] = +1.0;
    a[0xD][rank] = Number(boundary31.value);
    a[0xE][0xE] = +1.0;
    a[0xE][rank] = Number(boundary32.value);
    a[0xF][0xF] = +1.0;
    a[0xF][rank] = Number(boundary33.value);

    solvelinsys(a, rank, rank + 1, u);
    console.log(u[0]);
    console.log(u[1]);
    console.log(u[2]);
    console.log(u[3]);
    results.innerHTML = "<pre>u[0..0] = " + u[0] + "; " + "u[0..1] = " + u[1] + "; " + "u[0..2] = " + u[2] + "; " + "u[0..3] = " + u[3] + ";\n" +
        "u[1..0] = " + u[4] + "; " + "u[1..1] = " + u[5] + "; " + "u[1..3] = " + u[7] + "; " + "u[1..2] = " + u[6] + ";\n" +
        "u[2..0] = " + u[8] + "; " + "u[2..1] = " + u[9] + "; " + "u[2..3] = " + u[0xB] + "; " + "u[2..2] = " + u[0xA] + ";\n" +
        "u[3..0] = " + u[0xC] + "; " + "u[3..1] = " + u[0xD] + "; " + "u[3..3] = " + u[0xF] + "; " + "u[3..2] = " + u[0xE] + ";\n</pre>";
}
function seedData() {
    boundary11.value = 9;
    boundary12.value = 6;
    boundary21.value = 0;
    boundary22.value = 3;
    boundary23.value = 9;
    boundary32.value = 3;
    boundary33.value = 6;
    boundary31.value = 9;
    boundary13.value = 9;
}