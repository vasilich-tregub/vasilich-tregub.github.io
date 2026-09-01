/* TERMS OF USE
 * This source code is subject to the terms of the MIT License.
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
var action = false;
var g;
window.onload = () => {
    idNetlist.value = netlistTriPend;
}
idStop.addEventListener("click", async () => {
    action = false;
});
id_g.addEventListener("click", async (event) => {
    g = Number(id_g.value);
    action = false;
    ctx.clearRect(0, 0, 1000, 1000);
    await scheduler.yield();
});
idNetlistSelect.addEventListener("click", async (event) => {
    switch (event.target.value) {
        case "netlistTriPend":
            idNetlist.value = netlistTriPend;
            break;
        case "netlistChain":
            idNetlist.value = netlistChain;
            break;
        case "netlistSymPiston":
            idNetlist.value = netlistSymPiston;
            break;
        case "netlistAsymPiston":
            idNetlist.value = netlistAsymPiston;
            break;
        case "netlistSwing":
            idNetlist.value = netlistSwing;
            break;
        case "netlist2p3bPend":
            idNetlist.value = netlist2p3bPend;
            break;
        case "netlist2p2bPend":
            idNetlist.value = netlist2p2bPend;
            break;
        case "netlistSoliton":
            idNetlist.value = netlistSoliton;
            break;
        case "netlistCrosshair":
            idNetlist.value = netlistCrosshair;
            break;
        case "netlistUnbalanced":
            idNetlist.value = netlistUnbalanced;
            break;
        case "netlistInvertedPendulum":
            idNetlist.value = netlistInvertedPendulum;
            break;
    }
});
var bodies = 0;
var constraints = 0;
var Q = [];
var Bs = [];
var Cs = [];
var CTs = [];
let x0 = 0.0;
//let deltat = 0.000001;
var mpitol = 1.0E-9;
var Ethresh = 1;
var deltat = 0.001;
var U = 0;
var T = 0;
var E = 0;
function dq_dt()
{
    let q_dot = Array(4 * bodies).fill(0);

    mpitol = mpitol;
    const A = Array(constraints).fill().map(() => Array(2 * bodies).fill(0));
    const bv = Array(constraints).fill(0);
    for (let i = 0; i < constraints; i++)
    {
        switch (CTs[i])
        {
          case "Link":
            let C = Cs[i];
            let j = 2 * Bs.indexOf(C.B1);
            if (C.B2 == null) {
                A[i][j] = 2 * ((C.B1).x - C.anchorX);
                A[i][j + 1] = 2 * ((C.B1).y - C.anchorY);
                bv[i] = -2 * ((C.B1).vx * (C.B1).vx + (C.B1).vy * (C.B1).vy);
            }
            else {
              let j2 = 2 * Bs.indexOf(C.B2);
                A[i][j] = 2 * ((C.B1).x - (C.B2).x);
                A[i][j + 1] = 2 * ((C.B1).y - (C.B2).y);
                A[i][j2] = 2 * ((C.B2).x - (C.B1).x);
                A[i][j2 + 1] = 2 * ((C.B2).y - (C.B1).y);
                bv[i] = -2 * (((C.B1).vx - (C.B2).vx) * ((C.B1).vx - (C.B2).vx)
                    + ((C.B1).vy - (C.B2).vy) * ((C.B1).vy - (C.B2).vy));
            }
            break;
          case "Track":
            let CT = Cs[i];
            let jt = 2 * Bs.indexOf(CT.B);
            A[i][jt] = CT.kx;
            A[i][jt + 1] = CT.ky;
            break;
        }
    }
    let bq = Array(bv.length).fill(0);
    for (let i = 0; i < bq.length; i++)
        for (let j = 0; j < A[0].length; j++) {
            bv[i] -= A[i][j] * Q[j];
            if (j % 2 == 0)
                bq[i] -= A[i][j] * (Bs[j>>1]).vx;
            else
                bq[i] -= A[i][j] * (Bs[j>>1]).vy;
        }
    for (let i = 0; i < A.length; i++)
        for (let j = 0; j < A[0].length; j++)
            A[i][j] /= (Bs[j>>1]).m;
    Ampi = mpinverse(A, constraints, 2 * bodies);
    for (let i = 0; i < Ampi.length; i++)
        for (let j = 0; j < Ampi[0].length; j++)
            Ampi[i][j] /= (Bs[i>>1]).m;
    let rhsv = Array(Q.length).fill(0);
    let rhsq = Array(Q.length).fill(0);
    for (let i = 0; i < Ampi.length; i++)
        for (let j = 0; j < Ampi[0].length; j++) {
            switch (CTs[j]) {
                case "Link":
                    let B1 = (Cs[j]).B1;
                    let x1 = B1.x, y1 = B1.y, vx1 = B1.vx, vy1 = B1.vy, len2 = (Cs[j]).length2;
                    if ((Cs[j]).B2 == null) {
                        let ancX = (Cs[j]).anchorX; let ancY = (Cs[j]).anchorY;
                        rhsv[i] += Ampi[i][j] * (bv[j] - 2 / deltat * ((x1 - ancX) * vx1 + (y1 - ancY) * vy1));
                        rhsq[i] += Ampi[i][j] * (bq[j] - 1 / deltat * ((x1 - ancX) * (x1 - ancX) + (y1 - ancY) * (y1 - ancY) - len2));
                    }
                    else {
                        let B2 = (Cs[j]).B2;
                        rhsv[i] += Ampi[i][j] * (bv[j] - 2 / deltat * ((x1 - B2.x) * (vx1 - B2.vx) + (y1 - B2.y) * (vy1 - B2.vy)));
                        rhsq[i] += Ampi[i][j] * (bq[j] - 1 / deltat * ((x1 - B2.x) * (x1 - B2.x) + (y1 - B2.y) * (y1 - B2.y) - len2));
                    }
                    break;
                case "Track":
                    let C = Cs[j];
                    rhsv[i] += Ampi[i][j] * (bv[j] - 1 / deltat * (C.kx * (C.B).vx + C.ky * (C.B).vy));
                    rhsq[i] += Ampi[i][j] * (bq[j] - 1 / deltat * (C.kx * (C.B).x + C.ky * (C.B).y) + C.konst);
                    break;
            }
        }
    for (let i = 0; i < bodies; i++) {
        q_dot[2 * i] = (Bs[i]).vx + rhsq[2 * i];
        q_dot[2 * i + 1] = (Bs[i]).vy + rhsq[2 * i + 1];
        q_dot[2 * (i + bodies)] = Q[2 * i] + rhsv[2 * i];
        q_dot[2 * (i + bodies) + 1] = Q[2 * i + 1] + rhsv[2 * i + 1];
    }
    return q_dot;
}
function simulate() {
    T = 0;
    U = 0;
    let q_dot = dq_dt();
    let q = Array(4 * bodies).fill();
    for (let i = 0; i < bodies; i++) {
        q[2 * i] = (Bs[i]).x;
        q[2 * i + 1] = (Bs[i]).y;
        q[2 * (i + bodies)] = (Bs[i]).vx;
        q[2 * (i + bodies) + 1] = (Bs[i]).vy;
        (Bs[i]).x += q_dot[2 * i] * deltat / 2;
        (Bs[i]).y += q_dot[2 * i + 1] * deltat / 2;
        (Bs[i]).vx += q_dot[2 * (i + bodies)] * deltat / 2;
        (Bs[i]).vy += q_dot[2 * (i + bodies) + 1] * deltat / 2;
    }
    q_dot = dq_dt();
    for (let i = 0; i < bodies; i++) {
        (Bs[i]).x = q[2 * i] + q_dot[2 * i] * deltat;
        (Bs[i]).y = q[2 * i + 1] + q_dot[2 * i + 1] * deltat;
        (Bs[i]).vx = q[2 * (i + bodies)] + q_dot[2 * (i + bodies)] * deltat;
        (Bs[i]).vy = q[2 * (i + bodies) + 1] + q_dot[2 * (i + bodies) + 1] * deltat;
        T += (Bs[i]).m * (Bs[i]).m *
            ((Bs[i]).vx * (Bs[i]).vx / 2 + (Bs[i]).vy * (Bs[i]).vy / 2);
        U += (Bs[i]).m * (Bs[i]).m * (-Q[2 * i + 1] * (Bs[i]).y - Q[2 * i] * (Bs[i]).x);
        if (isNaN(T + U)) {
            console.log("Body # ", i);
            break;
        }
    }
}
async function drawMachine() {
    while (action) {
        simulate();
        if (Math.abs(T + U - E) > Ethresh) {
            console.log("T+U-E " + (T + U - E) + "; T " + T + "; U " + U + "; E = " + E);
            //break;
            action = false;
            return;
        }
        if (isNaN(T + U)) {
            console.log("T+U " + (T + U) + "; T " + T + "; U " + U);
            action = false;
            return;
        }
        ctx.clearRect(0, 0, 1000, 1000);
        for (let i = 0; i < constraints; i++) {
            try {
                switch (CTs[i]) {
                    case "Link":
                        let C = Cs[i];
                        ctx.strokeStyle = C.color;
                        if (C.B2 == null) {
                            ctx.beginPath();
                            ctx.moveTo(500 - 160 * C.anchorX, 500 - 160 * C.anchorY);
                            ctx.lineTo(500 - 160 * (C.B1).x, 500 - 160 * (C.B1).y);
                            ctx.stroke();
                        }
                        else {
                            ctx.beginPath();
                            ctx.moveTo(500 - 160 * (C.B1).x, 500 - 160 * (C.B1).y);
                            ctx.lineTo(500 - 160 * (C.B2).x, 500 - 160 * (C.B2).y);
                            ctx.stroke();
                        }
                        break;
                    // case "Track":
                    //    break;
                }
            }
            catch { }
        }
        await scheduler.yield();
        requestAnimationFrame(drawMachine);
    }
}
function tran() {
    g = Number(id_g.value);
    bodies = 0;
    constraints = 0;
    Q = [];
    Bs = [];
    Cs = [];
    CTs = [];
    x0 = 0.0;
    //let deltat = 0.000001;
    mpitol = 1.0E-9;
    Ethresh = 3;
    deltat = 0.001;
    U = 0;
    T = 0;
    E = 0;
    parseNetlist();
    action = true;
    ctx.lineWidth = 2.5;
    drawMachine();
}