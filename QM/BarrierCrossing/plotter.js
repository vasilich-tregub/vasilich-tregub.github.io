/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function zoomed_potential(y_arr, plot_width, plot_height) {
    const ctx = document.getElementById("_potential").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, document.getElementById("_potential").width, document.getElementById("_potential").height);
    arrLen = y_arr.length;
    let hpxpi = plot_width / (arrLen - 1);
    let maxY = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for (var i = 0; i < arrLen; i++) {
        minY = (minY > parseFloat(y_arr[i])) ? y_arr[i] : minY;
        maxY = (maxY < parseFloat(y_arr[i])) ? y_arr[i] : maxY;
    }
    yScale = plot_height / (maxY - minY) / 2;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let hx = 0; hx < arrLen; ++hx) {
        ctx.lineTo(Math.round(hpxpi * hx), -yScale * y_arr[hx] + plot_height / 2);
    }
    ctx.stroke();
}
function zoomed_wavefunction(y_arr, plot_width, plot_height) {
    const ctx = document.getElementById("_wavefunction").getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, document.getElementById("_wavefunction").width, document.getElementById("_wavefunction").height);
    let arrLen = y_arr.length;
    let hpxpi = plot_width / (arrLen - 1);
    let maxY = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    for (var i = 0; i < arrLen; i++) {
        minY = (minY > parseFloat(y_arr[i])) ? y_arr[i] : minY;
        maxY = (maxY < parseFloat(y_arr[i])) ? y_arr[i] : maxY;
    }
    yScale = plot_height / (maxY - minY) / 2;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let hx = 0; hx < arrLen; ++hx) {
        ctx.lineTo(Math.round(hpxpi * hx), -yScale * y_arr[hx] + plot_height / 2);
    }
    ctx.stroke();
}
