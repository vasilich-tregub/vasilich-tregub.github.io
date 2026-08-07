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

var dt;
var _tau;
var _E;
var _p;
var _t;
var _q;
var _m;
var _TU;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
function drawTrajectory() {
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

    if (opt_ALD) {
        jt = (E - E_m - E_m + E_1) / dt;
        jx = (px - px_m - px_m + px_1) / dt;
        jy = (py - py_m - py_m + py_1) / dt;

        px += 2.0 / 3 * (jx + px / m * (E / m * jt - px / m * jx - py / m * jy));
        py += 2.0 / 3 * (jy + py / m * (E / m * jt - px / m * jx - py / m * jy));
        E += 2.0 / 3 * (jt + E / m * (E / m * jt - px / m * jx - py / m * jy));

        qx += 2.0 / 3 * (jx + px / m * (E / m * jt - px / m * jx - py / m * jy)) * dt / 2;
        qy += 2.0 / 3 * (jy + py / m * (E / m * jt - px / m * jx - py / m * jy)) * dt / 2;
        t += 2.0 / 3 * (jt + E / m * (E / m * jt - px / m * jx - py / m * jy)) * dt / 2;
    }
    if (xstepCount-- >= 0) {
        if (Math.floor((_q.qx - qx) * 500) != 0 || Math.floor((_q.qy - qy) * 500) != 0) {
            ctx.beginPath();
            ctx.moveTo(_q.qx * 250 + 500, _q.qy * 250 + 500);
            ctx.lineTo(qx * 250 + 500, qy * 250 + 500);
            ctx.stroke();
            _q = { qx, qy };
            //console.log(xstepCount);
        }
        requestAnimationFrame(drawTrajectory);
    }
}
function motion_in_CoulombField() {
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
    t = 0;
    px = 1; py = 0;
    qx = 0; qy = 1.05;
    m = 1;
    F = -1;
    currtime = 0;
    fintime = 10;
    dt = timestep = 5E-4;
    var E0 = Math.sqrt(m * m + px * px + py * py);
    E = E0;
    xstepCount = ((fintime - currtime) / timestep);
    _q = { qx, qy };
    drawTrajectory();
}
