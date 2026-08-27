/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
function motion_in_CoulombField() {
    var atau = [];
    var aE = [];
    var ap = [];
    var at = [];
    var aq = [];
    var am = [];
    var aTU = [];
    var qx;
    var qy;
    var t;
    var px;
    var py;
    var E;
    var m = 1.0;
    var Fx;
    var Fy;
    var F;
    var dt;

    var jt, jx, jy;
    var opt_ALD = false;

    var currtime;
    var fintime;
    var timestep;
    var xstepCount;
    t = 0;
    px = Number(idPx.value); py = Number(idPy.value);
    qx = Number(idQx.value); qy = Number(idQy.value);
    m = 1;
    F = -1;
    currtime = 0;
    fintime = Number(idFintime.value);
    dt = timestep = Number(idTimestep.value);
    if (idSpiral.checked) {
        px = 1.1; idPx.value = px;
        fintime = 1.5; idFintime.value = fintime;
        idTimestep.value = '1E-6'; dt = timestep = Number(idTimestep.value);
    }
    var E0 = Math.sqrt(m * m + px * px + py * py);
    E = E0;
    xstepCount = ((fintime - currtime) / timestep);
    atau.push(0);
    aE.push(E);
    ap.push({ px, py });
    at.push(t);
    aq.push({ qx, qy });
    am.push(Math.sqrt(E * E - px * px - py * py));
    aTU.push(E + F / Math.sqrt(qx * qx + qy * qy));
    for (let stau = 0; stau < xstepCount; stau++) {
        let t_1 = t;
        let qx_1 = qx;
        let qy_1 = qy;
        let E_1 = E;
        let px_1 = px;
        let py_1 = py;
        let q3 = (qx * qx + qy * qy) * Math.sqrt(qx * qx + qy * qy);
        let qx_m = qx_1 + px_1 / m * dt / 2;
        let qy_m = qy_1 + py_1 / m * dt / 2;
        let t_m = t_1 + E_1 / m * dt / 2;
        let px_m = px_1 + F * qx_1 / q3 * E / m * dt / 2;
        let py_m = py_1 + F * qy_1 / q3 * E / m * dt / 2;
        let E_m = E_1 + F * (qx_1 * px_1 + qy_1 * py_1) / q3 / m * dt;
        q3 = (qx_m * qx_m + qy_m * qy_m) * Math.sqrt(qx_m * qx_m + qy_m * qy_m);
        qx += px_m / m * dt;
        qy += py_m / m * dt;
        t += E_m / m * dt;
        px += F * qx_m / q3 * E_m / m * dt;
        py += F * qy_m / q3 * E_m / m * dt;
        E += F * (qx_m * px_m + qy_m * py_m) / q3 / m * dt;
        if (Math.abs(aq[aq.length - 1].qx - qx) >= 0.001 || Math.abs(aq[aq.length - 1].qy - qy) >= 0.001) {
            atau.push(stau * dt);
            aE.push(E);
            ap.push({ px, py });
            at.push(t);
            aq.push({ qx, qy });
            am.push(Math.sqrt(E * E - px * px - py * py));
            aTU.push(E + F / Math.sqrt(qx * qx + qy * qy));
        }
    }
    ctx.reset();
    ctx.save();
    ctx.fillStyle = "indigo";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "crimson";
    ctx.beginPath();
    ctx.arc(500, 500, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(aq[0].qx * 500 + 500, aq[0].qy * 500 + 500);
    for (let stau = 1; stau < aq.length; ++stau) {
        ctx.lineTo(aq[stau].qx * 500 + 500, aq[stau].qy * 500 + 500);
    }
    ctx.stroke();
    if (idTUgraph.checked) {
        ctx.strokeStyle = "green";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, aTU[0] * 100);
        for (let stau = 1; stau < aq.length; ++stau) {
            ctx.lineTo(stau * 1000 / aq.length, am[stau] * 100);
        }
        ctx.stroke();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, aTU[0] * 100);
        for (let stau = 1; stau < aq.length; ++stau) {
            ctx.lineTo(stau * 1000 / aq.length, aTU[stau] * 100);
        }
        ctx.stroke();
    }
}
