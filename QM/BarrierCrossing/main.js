/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
var U_arr;
var well_left;
var well_right;
var Uwell;
var aL = 1000;
var x0 = 20.0;
var dx = 0.04;
var gaussW = 0.6;
var p;
var dt = 0.00004;
var psi_arr;
var psi_o_arr;
var psi_ampl_arr;
var potentialSelectedKey;
class Complex {
    real;
    imag;
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    magn() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    add(other) {
        let ret = new Complex(0, 0);
        ret.real = this.real + other.real;
        ret.imag = this.imag + other.imag;
        return ret;
    }
    sub(other) {
        let ret = new Complex(0, 0);
        ret.real = this.real - other.real;
        ret.imag = this.imag - other.imag;
        return ret;
    }
    mul(other) {
        let ret = new Complex(0, 0);
        ret.real = this.real * other.real - this.imag * other.imag;
        ret.imag = this.real * other.imag + this.imag * other.real;
        return ret;
    }
    exp() {
        return (new Complex(Math.exp(this.real) * Math.cos(this.imag), Math.exp(this.real) * Math.sin(this.imag)));
    }
}
function loadPotential(el) {
    ctl_potentialdefinition.value = potentials.get(el.innerText);
    potentialSelectedKey = el.innerText;
    redrawPotential();
}
/* initialize a potential selection element */
window.onload = () => {
    ctl_potentialdefinition.value = potentials.get("Fowler-Nordheim");
    var strPotentials = "&nbsp;";
    for (const iter of potentials.keys()) {
        strPotentials += "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>" + iter + "</span> ";
    }
    //span_potential_sel.innerHTML = strPotentials;
    span_potential_sel.innerHTML = "&nbsp;" +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>Fowler-Nordheim</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>Well</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>Resonant_Tunneling</span>";
    potentialSelectedKey = "Fowler-Nordheim";
    redrawPotential();
}
/* redraw a potential function */
function redrawPotential() {
    U_arr = new Array();
    var strPotentialDefiningCode = ctl_potentialdefinition.value;
    if (potentialSelectedKey == "Fowler-Nordheim") {
        U_range = 50.0;
        dx = 0.04;
        for (var i = 0; i < U_range / dx; i++) {
            if (i * dx < 24.0)
                U_arr[i] = 0;
            else
                U_arr[i] = 50.0 * (25.0 - i * dx);
        }
    }
    else if (potentialSelectedKey == "Well") {
        U_range = 50.0;
        dx = 0.04;
        for (var i = 0; i < U_range / dx; i++) {
            if (i * dx < 23.0 | i * dx > 27)
                U_arr[i] = 0;
            else
                U_arr[i] = -1200.0;
        }
    }
    else if (potentialSelectedKey == "Resonant_Tunneling") {
        U_range = 50.0;
        dx = 0.04;
        for (var i = 0; i < U_range / dx; i++) {
            if (i * dx > 23.9 & i * dx < 24 | i * dx > 24.14 & i * dx < 24.24)
                U_arr[i] = 110.0;
            else
                U_arr[i] = 0.0;
        }
    }
    else {
        return;
    }
    var strPotentialDefiningCode = ctl_potentialdefinition.value;
    zoomed_potential(U_arr, 1000, 500);
}
function plotWavefunction() {
    p = parseFloat(ctl_momentum.value);
    aL = U_range / dx;
    psi_arr = Array(aL).fill(new Complex(0, 0));
    psi_o_arr = Array(aL).fill(new Complex(0, 0));
    psi_ampl_arr = Array(aL).fill(0);
    for (let i = 0; i < aL; i++) {
        psi_arr[i] = (new Complex(0, p * i * dx).exp().mul(new Complex(Math.exp(-(i * dx - x0) * (i * dx - x0) / 2 / gaussW / gaussW) / (Math.sqrt(2 * Math.PI) * gaussW), 0)));
        psi_ampl_arr[i] = psi_arr[i].magn();
    }
    zoomed_wavefunction(psi_ampl_arr, 1000, 500);
}
var nT = 0;
const epsilon = dt / dx / dx;
const alfa = (new Complex(1, 0).add((new Complex(0, -epsilon)).exp())).mul(new Complex(0.5, 0));
const beta = (new Complex(1, 0).sub((new Complex(0, -epsilon)).exp())).mul(new Complex(0.5, 0));
function advanceInTime() {
    nT = parseInt(document.getElementById("ctl_timesteps").value);
    for (let iT = 0; iT < nT; iT++) {
        // apply exponentiated potential
        for (let i = 0; i < aL; i++) {
            psi_arr[i] = psi_arr[i].mul((new Complex(0, -(dt * U_arr[i]))).exp());
        }
        // apply Todd;
        psi_o_arr[0] = psi_arr[0].mul(alfa).add(psi_arr[aL - 1].mul(beta));
        for (let i = 1; i < aL - 1; i++) {
            psi_o_arr[i] = psi_arr[i].mul(alfa).add((((i & 1) == 0) ? psi_arr[i - 1] : psi_arr[i + 1]).mul(beta));
        }
        psi_o_arr[aL - 1] = psi_arr[aL - 1].mul(alfa).add(psi_arr[0].mul(beta));
        // apply Teven
        psi_arr[0] = psi_o_arr[0].mul(alfa).add(psi_o_arr[1].mul(beta));
        for (let i = 1; i < aL - 1; i++) {
            psi_arr[i] = psi_o_arr[i].mul(alfa).add((((i & 1) == 0) ? psi_o_arr[i + 1] : psi_o_arr[i - 1]).mul(beta));
        }
        psi_arr[aL - 1] = psi_o_arr[aL - 1].mul(alfa).add(psi_o_arr[aL - 2].mul(beta));
    }
    for (let i = 0; i < aL; i++) {
        psi_ampl_arr[i] = psi_arr[i].magn();
    }
    zoomed_wavefunction(psi_ampl_arr, 1000, 500);
}