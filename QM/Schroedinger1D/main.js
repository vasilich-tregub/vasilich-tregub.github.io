/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function overEVspan(el) {
    el.style.backgroundColor = "gray";
    for (var i = 0; i < EV_arr.length; i++) {
        if (el.innerText == EV_arr[i])
            evLinesDIV.childNodes[i].strokeweight = "5pt";
    }
}
function leaveEVspan(el) {
    el.style.backgroundColor = "silver";
    for (var i = 0; i < EV_arr.length; i++) {
        evLinesDIV.childNodes[i].strokeweight = "1pt";
    }
}
function clickEVspan(el) {
    ctl_E.value = el.innerText;
    plotWavefunction();
    for (var i = 0; i < EV_arr.length; i++) {
        if (el.innerText == EV_arr[i])
            evLinesDIV.childNodes[i].strokecolor = "purple";
        else
            evLinesDIV.childNodes[i].strokecolor = "silver";
    }
}
function rescalePlots() {
    if (parseFloat(ctl_plot_scale.value) >= 0.1 && parseFloat(ctl_plot_scale.value) <= 100) {
        potentialDIV.style.zoom = 1 / parseFloat(ctl_plot_scale.value);
        wfDIV.style.zoom = 1 / parseFloat(ctl_plot_scale.value);
    }
    else {
        ctl_plot_scale.value = 1.0;
    }
    //  vscale = ctl_plot_scale.value;
}
var U_arr;
var U_arr_plot;
var U_range = 10.0;
var maxU = Number.MIN_VALUE;
var minU = Number.MAX_VALUE;
var dx = 0.01;
var deltaE = 0.004;
//var potentialsXML = new ActiveXObject("Msxml2.DOMDocument");
var EV_arr;
var vscale = 2.0;
var potentialSelectedKey;
function loadPotential(el) {
    ctl_potentialdefinition.value = potentials.get(el.innerText);
    potentialSelectedKey = el.innerText;
    redrawPotential();
}
/* initialize a potential selection element */
window.onload = () => {
    potentialSelectedKey = "Hooke";
    ctl_potentialdefinition.value = potentials.get("Hooke");
    var strPotentials = "&nbsp;";
    for (const iter of potentials.keys()) {
        strPotentials += "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>" + iter + "</span> ";
    }
    //span_potential_sel.innerHTML = strPotentials;
    span_potential_sel.innerHTML = "&nbsp;" +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>square_well</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>Hooke</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>five_square_wells</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>saw</span> " +
        "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>Coulomb</span> ";
    redrawPotential();
}
/* redraw a potential function */
function redrawPotential() {
    ctl_Emin.value = '';
    ctl_Emax.value = '';
    ctl_eigenvalues.innerHTML = '';
    U_arr = new Array();
    var strPotentialDefiningCode = ctl_potentialdefinition.value;
    if (potentialSelectedKey == "square_well") {
        U_range = 10.0;
        dx = 0.01;
        for (let i = 0; i <= U_range / dx; i++) {
            var x = i * dx;
            var depth = 2.0;
            if (x <= 0) {
                U_arr[i] = 0;
                continue;
            }
            if (x < 10) {
                U_arr[i] = -depth;
                continue;
            }
            if (x <= 10) {
                U_arr[i] = 0;
                continue;
            }
        }
    }
    else if (potentialSelectedKey == "Hooke") {
        U_range = 10.5;
        dx = 0.01;
        for (let cm = 0; cm <= Math.round(U_range / dx); cm++) {
            U_arr[cm] = (cm * dx - U_range / 2) * (cm * dx - U_range / 2) / 2;
        }
    }
    else if (potentialSelectedKey == "five_square_wells") {
        U_range = 10.0;
        var depth = 10.0;
        dx = 0.01;
        for (let i = 0; i <= U_range / dx; i++) {
            var x = i * dx;
            if (x <= 0) { U_arr[i] = 0; continue; }
            if (x <= 1) { U_arr[i] = -depth; continue; }
            if (x <= 2) { U_arr[i] = 0; continue; }
            if (x <= 3) { U_arr[i] = -depth; continue; }
            if (x <= 4) { U_arr[i] = 0; continue; }
            if (x <= 5) { U_arr[i] = -depth; continue; }
            if (x <= 6) { U_arr[i] = 0; continue; }
            if (x <= 7) { U_arr[i] = -depth; continue; }
            if (x <= 8) { U_arr[i] = 0; continue; }
            if (x <= 9) { U_arr[i] = -depth; continue; }
            if (x <= 10) { U_arr[i] = 0; continue; }
        }
    }
    else if (potentialSelectedKey == "saw") {
        U_range = 10.0;
        var depth = 10.0;
        dx = 0.01;
        for (let i = 0; i <= U_range / dx; i++) {
            var x = i * dx;
            if (x <= 0) { U_arr[i] = 0; continue; }
            if (x <= 1.25) { U_arr[i] = -x / 1.25 * depth; continue; }
            if (x <= 2.5) { U_arr[i] = (x - 2.5) / 1.25 * depth; continue; }
            if (x <= 3.75) { U_arr[i] = -(x - 2.5) / 1.25 * depth; continue; }
            if (x <= 5) { U_arr[i] = (x - 5) / 1.25 * depth; continue; }
            if (x <= 6.25) { U_arr[i] = -(x - 5) / 1.25 * depth; continue; }
            if (x <= 7.5) { U_arr[i] = (x - 7.5) / 1.25 * depth; continue; }
            if (x <= 8.75) { U_arr[i] = -(x - 7.5) / 1.25 * depth; continue; }
            if (x <= 10) { U_arr[i] = (x - 10) / 1.25 * depth; continue; }
        }
    }
    else if (potentialSelectedKey == "Coulomb") {
        U_range = 40.0;
        dx = 0.01;
        l = 0; // angular momentum 
        for (let i = 0; i <= U_range / dx; i++) {
            let x = i * dx;
            if (x <= 0) { U_arr[i] = 1E9; continue; }
            else { U_arr[i] = -1 / x + l * (l + 1) / (2 * x * x); }
        }
        // U(0) для Кулона не отображается на графике (см. код)
        ctl_Emin.value = -1; ctl_Emax.value = -0;
    }
    U_arr_plot = [...U_arr];
    if (Math.abs(U_arr_plot[0]) > (1E9 - 1)) {			   // hack to accomodate Coulomb potential
        for (i = 0; i < 50; i++) {
            U_arr_plot[i] = U_arr_plot[50]
        }
    }
    zoomed_potential(U_arr_plot, 1000, 250);
}
function showEigenvalues() {
    var emin = parseFloat(ctl_Emin.value);
    var emax = parseFloat(ctl_Emax.value);
    if (isNaN(emin) || isNaN(emax) || emin >= emax) {
        emin = Number.MAX_VALUE;
        emax = -Number.MAX_VALUE;
        for (var i = 0; i < U_arr.length; i++) {
            if (emin > U_arr[i])
                emin = U_arr[i];
            if (emax < U_arr[i])
                emax = U_arr[i];
        }
        ctl_Emin.value = emin;
        ctl_Emax.value = emax;
    }
    maxU = -Number.MAX_VALUE;
    minU = Number.MAX_VALUE;
    for (var i = 0; i < U_arr.length; i++) {
        minU = ((minU > U_arr_plot[i]) ? U_arr_plot[i] : minU);
        maxU = ((maxU < U_arr_plot[i]) ? U_arr_plot[i] : maxU);
    }
    EV_arr = findEigenvalues(emin, emax, U_range, U_arr);
    ctl_eigenvalues.innerHTML = "";
    evLinesDIV.innerHTML = "";
    for (var i = 0; i < EV_arr.length; i++) {
        ctl_eigenvalues.innerHTML =
            "<DIV style='cursor:default;background:silver;white-space:nowrap;border:outset thin'" +
            "onmouseover='overEVspan(this)'" + "onmouseleave='leaveEVspan(this)'" +
            "onclick='clickEVspan(this)'>" + EV_arr[i] + "</DIV>" + ctl_eigenvalues.innerHTML;
        var oEvLine = document.createElement("v:line");
        oEvLine.from = "0, " + parseInt(ctl_vert_plot_scale.value * 200 * (maxU - EV_arr[i]) / (maxU - minU));
        oEvLine.to = parseInt(U_range / dx) + ", " + parseInt(ctl_vert_plot_scale.value * 200 * (maxU - EV_arr[i]) / (maxU - minU));
        oEvLine.strokecolor = "silver";
        evLinesDIV.appendChild(oEvLine);
    }
    zoomed_potential(U_arr_plot, 1000, 250, EV_arr);
}
function plotWavefunction() {
    var E = parseFloat(ctl_E.value);
    var wf_arr = new Array();
    wf_arr = num_Schroedinger(dx, U_range, E, U_arr);
    var oRealWfPlot = document.getElementById("_real_wf");
    ctl_wf_joint.innerText = num_Schroedinger_joint(dx, U_range, E, U_arr);
    //oRealWfPlot.path = vml_plot(U_range / dx, 200, wf_arr);
    zoomed_wavefunction(wf_arr, 1000, 500);
    return;
    zeroLineDIV.innerHTML = "";
    var maxY = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    for (var i = 0; i < wf_arr.length; i++) {
        minY = ((minY > parseFloat(wf_arr[i])) ? wf_arr[i] : minY);
        maxY = ((maxY < parseFloat(wf_arr[i])) ? wf_arr[i] : maxY);
    }
    var oZeroLine = document.createElement("v:line");
    oZeroLine.from = "0," + parseInt(200 * (maxY) / (maxY - minY));
    oZeroLine.to = parseInt(U_range / dx) + "," + parseInt(200 * (maxY) / (maxY - minY));
    oZeroLine.strokecolor = "blue";
    zeroLineDIV.appendChild(oZeroLine);
    wfDIV.style.top = - parseInt(200 * (maxY) / (maxY - minY));
    potentialDIV.style.top = - parseInt(ctl_vert_plot_scale.value * 200 * ((maxU - E) / (maxU - minU) - 1)) + 2;
    potentialDIV.style.top = parseInt(1 / parseFloat(ctl_plot_scale.value) * parseFloat(potentialDIV.style.top));
    wfDIV.style.top = parseInt(1 / parseFloat(ctl_plot_scale.value) * parseFloat(wfDIV.style.top));
}