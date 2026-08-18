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
function loadPotential(el) {
    ctl_potentialdefinition.value = potentials.get(el.innerText);
    redrawPotential();
}
/* initialize a potential selection element */
window.onload = () => {
    ctl_potentialdefinition.value = potentials.get("Hooke");
    var strPotentials = "&nbsp;";
    for (const iter of potentials.keys()) {
        strPotentials += "<span style='text-decoration:underline;cursor:pointer' onclick='loadPotential(this)'>" + iter + "</span> ";
    }
    span_potential_sel.innerHTML = strPotentials;
    redrawPotential();
}
/* redraw a potential function */
function redrawPotential() {
    ctl_Emin.value = '';
    ctl_Emax.value = '';
    ctl_eigenvalues.innerHTML = '';
    //  potentialDIV.style.zoom = 1/parseFloat(ctl_plot_scale.value);
    //  wfDIV.style.zoom = 1/parseFloat(ctl_plot_scale.value);
    U_arr = new Array();
    var strPotentialDefiningCode = ctl_potentialdefinition.value;
    try {
        eval(strPotentialDefiningCode);
    }
    catch (e) {
        alert("Error of evaluating script of potential\n" + e);
        return;
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
