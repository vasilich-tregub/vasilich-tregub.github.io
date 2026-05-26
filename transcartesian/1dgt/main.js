/* TERMS OF USE
 * This source code is subject to the terms of the MIT License.
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
var rank = 4;
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

    a[1][1] = 1.0;

    a[1][4] = Number(boundary1.value);

    a[2][2] = 1.0;

    a[2][4] = Number(boundary2.value);

    a[3][3] = 1.0;
    a[3][4] = Number(boundary3.value);
    solvelinsys(a, rank, rank + 1, u);
    console.log(u[0]);
    console.log(u[1]);
    console.log(u[2]);
    console.log(u[3]);
    results.innerHTML="<pre>u[0] = " + u[0] + "\n" + "u[1] = " + u[1] + "\n" + "u[2] = " + u[2] + "\n" + "u[3] = " + u[3] + "\n</pre>";
}
