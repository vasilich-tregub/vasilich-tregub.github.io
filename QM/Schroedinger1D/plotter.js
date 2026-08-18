/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function zoomed_potential(y_arr, plot_width, plot_height, eigenvalues) {
    const ctx = document.getElementById("_potential").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, document.getElementById("_potential").width, document.getElementById("_potential").height);
    arrLen = y_arr.length;
    const hpxpi = plot_width / (arrLen - 1);
    let maxY = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for (var i = 0; i < arrLen; i++) {
        minY = (minY > parseFloat(y_arr[i])) ? y_arr[i] : minY;
        maxY = (maxY < parseFloat(y_arr[i])) ? y_arr[i] : maxY;
    }
    yScale = plot_height / (maxY - minY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let hx = 0; hx < arrLen; ++hx) {
        ctx.lineTo(Math.round(hpxpi * hx), -yScale * (y_arr[hx] - minY) + plot_height);
    }
    ctx.stroke();
    let ymin = Number.MAX_VALUE;
    let ymax = -Number.MAX_VALUE;
    for (var i = 0; i < y_arr.length; i++) {
        if (ymin > y_arr[i])
            ymin = y_arr[i];
        if (ymax < y_arr[i])
            ymax = y_arr[i];
    }
    ctx.strokeStyle = "gray";
    if (eigenvalues != undefined) {
        for (ev of eigenvalues) {
            ctx.beginPath();
            ctx.moveTo(0, (ymax-ev) * yScale);
            ctx.lineTo(plot_width, (ymax-ev) * yScale);
            ctx.stroke();
        }
    }
}
function zoomed_wavefunction(y_arr, plot_width, plot_height) {
    const ctx = document.getElementById("_wavefunction").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, document.getElementById("_wavefunction").width, document.getElementById("_wavefunction").height);
    arrLen = y_arr.length;
    const hpxpi = plot_width / (arrLen - 1);
    let maxY = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for (var i = 0; i < arrLen; i++) {
        minY = (minY > parseFloat(y_arr[i])) ? y_arr[i] : minY;
        maxY = (maxY < parseFloat(y_arr[i])) ? y_arr[i] : maxY;
    }
    yScale = plot_height / (maxY - minY) / 2;
    ctx.strokeStyle = "violet";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let hx = 0; hx < arrLen; ++hx) {
        ctx.lineTo(Math.round(hpxpi * hx), -yScale * y_arr[hx] + plot_height / 2);
    }
    ctx.stroke();
}
