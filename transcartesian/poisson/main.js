/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function r4(string) {
    return parseInt(string, 4);
}
var rank = 64;
var a;
var mesh = []; // array of node neighbors; 3 neighbors or less
window.onload = (event) => {
    mesh[0] = [1, 2, 3];
    mesh[1] = [0, r4("23"), r4("32")];
    mesh[2] = [0, r4("31"), r4("13")];
    mesh[3] = [0, r4("12"), r4("21")];
    mesh[r4("10")] = [r4("11"), r4("12"), r4("13")];
    mesh[r4("11")] = [r4("10"), r4("233"), r4("322")];
    mesh[r4("12")] = [r4("10"), r4("321"), 3];
    mesh[r4("13")] = [r4("10"), 2, r4("231")];
    mesh[r4("20")] = [r4("21"), r4("22"), r4("23")];
    mesh[r4("21")] = [r4("20"), 3, r4("312")];
    mesh[r4("22")] = [r4("20"), r4("311"), r4("133")];
    mesh[r4("23")] = [r4("20"), r4("132"), 1];
    mesh[r4("30")] = [r4("31"), r4("32"), r4("33")];
    mesh[r4("31")] = [r4("30"), r4("213"), 2];
    mesh[r4("32")] = [r4("30"), 1, r4("123")];
    mesh[r4("33")] = [r4("30"), r4("122"), r4("211")];
    mesh[r4("100")] = [r4("101"), r4("102"), r4("103")];
    mesh[r4("101")] = [r4("100"), r4("123"), r4("132")];
    mesh[r4("102")] = [r4("100"), r4("131"), r4("113")];
    mesh[r4("103")] = [r4("100"), r4("112"), r4("121")];
    mesh[r4("110")] = [r4("111"), r4("112"), r4("113")];
    mesh[r4("111")] = [r4("110")];
    mesh[r4("112")] = [r4("110"), r4("103")];
    mesh[r4("113")] = [r4("110"), r4("102")];
    mesh[r4("120")] = [r4("121"), r4("122"), r4("123")];
    mesh[r4("121")] = [r4("120"), r4("103")];
    mesh[r4("122")] = [r4("120"), r4("33")];
    mesh[r4("123")] = [r4("120"), r4("32"), r4("101")];
    mesh[r4("130")] = [r4("131"), r4("132"), r4("133")];
    mesh[r4("131")] = [r4("130"), r4("102")];
    mesh[r4("132")] = [r4("130"), r4("101"), r4("23")];
    mesh[r4("133")] = [r4("130"), r4("22")];
    mesh[r4("200")] = [r4("201"), r4("202"), r4("203")];
    mesh[r4("201")] = [r4("200"), r4("223"), r4("232")];
    mesh[r4("202")] = [r4("200"), r4("231"), r4("213")];
    mesh[r4("203")] = [r4("200"), r4("212"), r4("221")];
    mesh[r4("210")] = [r4("211"), r4("212"), r4("213")];
    mesh[r4("211")] = [r4("210"), r4("33")];
    mesh[r4("212")] = [r4("210"), r4("203")];
    mesh[r4("213")] = [r4("210"), r4("202"), r4("31")];
    mesh[r4("220")] = [r4("221"), r4("222"), r4("223")];
    mesh[r4("221")] = [r4("220"), r4("203")];
    mesh[r4("222")] = [r4("220")];
    mesh[r4("223")] = [r4("220"), r4("201")];
    mesh[r4("230")] = [r4("231"), r4("232"), r4("233")];
    mesh[r4("231")] = [r4("230"), r4("13"), r4("202")];
    mesh[r4("232")] = [r4("230"), r4("231")];
    mesh[r4("233")] = [r4("230"), r4("11")];
    mesh[r4("300")] = [r4("301"), r4("302"), r4("303")];
    mesh[r4("301")] = [r4("300"), r4("323"), r4("332")];
    mesh[r4("302")] = [r4("300"), r4("331"), r4("313")];
    mesh[r4("303")] = [r4("300"), r4("312"), r4("321")];
    mesh[r4("310")] = [r4("311"), r4("312"), r4("313")];
    mesh[r4("311")] = [r4("310"), r4("22")];
    mesh[r4("312")] = [r4("310"), r4("21"), r4("303")];
    mesh[r4("313")] = [r4("310"), r4("302")];
    mesh[r4("320")] = [r4("321"), r4("322"), r4("323")];
    mesh[r4("321")] = [r4("320"), r4("303"), r4("12")];
    mesh[r4("322")] = [r4("320"), r4("11")];
    mesh[r4("323")] = [r4("301"), r4("320")];
    mesh[r4("330")] = [r4("331"), r4("332"), r4("333")];
    mesh[r4("331")] = [r4("330"), r4("302")];
    mesh[r4("332")] = [r4("330"), r4("301")];
    mesh[r4("333")] = [r4("330")];
}
var u = new Float64Array(rank);
var f = new Float64Array(rank); // for inner nodes, f = h^2*4*pi*ro (ro is a charge density), for boundary nodes f = boundary potential
function solve() {
    a = new Array(rank);
    for (let i = 0; i < rank; ++i) {
        a[i] = new Float64Array(rank + 1);
        for (let j = 0; j <= rank; ++j) {
            a[i][j] = 0;
        }
    }
    for (let i = 0; i < rank; ++i) {
        if (mesh[i].length == 3) {
            a[i][i] = 3.0;
            a[i][mesh[i][0]] = -1.0;
            a[i][mesh[i][1]] = -1.0;
            a[i][mesh[i][2]] = -1.0;
        }
        else {
            a[i][i] = 1.0;
        }
    }
    const simplexdivs = document.querySelectorAll('div.simplex');
    for (el of simplexdivs) {
        if (el.title) {
            a[r4(el.title)][rank] = f[r4(el.title)];
        }
    }

    solvelinsys(a, rank, rank + 1, u);

    for (el of simplexdivs) {
        if (el.title) {
            el.innerText = u[r4(el.title)].toFixed(3);
        }
    }
}
function saveSourceData() {
    const simplexdivs = document.querySelectorAll('div.simplex');
    for (el of simplexdivs) {
        if (el.title) {
            f[r4(el.title)] = (isNaN(Number(el.innerText)) ? 0 : Number(el.innerText));
        }
    }
}
function showSourceData() {
    const simplexdivs = document.querySelectorAll('div.simplex');
    for (el of simplexdivs) {
        if (el.title) {
            el.innerText = f[r4(el.title)].toFixed(3);
        }
    }
}
function seedData() {
    document.querySelectorAll("div.simplex[title]").forEach((el) => { el.innerText = 0; });
    document.querySelector("div.simplex[title='000']").innerText = 12;
    document.querySelector("div.simplex[title='001']").innerText = 5;
    document.querySelector("div.simplex[title='002']").innerText = 5;
    document.querySelector("div.simplex[title='003']").innerText = 5;
    document.querySelector("div.simplex[title='111']").innerText = 9;
    document.querySelector("div.simplex[title='112']").innerText = 8;
    document.querySelector("div.simplex[title='121']").innerText = 6;
    document.querySelector("div.simplex[title='122']").innerText = 3;
    document.querySelector("div.simplex[title='211']").innerText = 0;
    document.querySelector("div.simplex[title='212']").innerText = -3;
    document.querySelector("div.simplex[title='221']").innerText = -6;
    document.querySelector("div.simplex[title='222']").innerText = -7;
    document.querySelector("div.simplex[title='223']").innerText = -3;
    document.querySelector("div.simplex[title='232']").innerText = 0;
    document.querySelector("div.simplex[title='233']").innerText = 2;
    document.querySelector("div.simplex[title='322']").innerText = 2;
    document.querySelector("div.simplex[title='323']").innerText = 0;
    document.querySelector("div.simplex[title='332']").innerText = -3;
    document.querySelector("div.simplex[title='333']").innerText = -7;
    document.querySelector("div.simplex[title='331']").innerText = -6;
    document.querySelector("div.simplex[title='313']").innerText = -3;
    document.querySelector("div.simplex[title='311']").innerText = 0;
    document.querySelector("div.simplex[title='133']").innerText = 3;
    document.querySelector("div.simplex[title='131']").innerText = 6;
    document.querySelector("div.simplex[title='113']").innerText = 8;
}
function zeroData() {
    document.querySelectorAll("div.simplex[title]").forEach((el) => { el.innerText = 0; });
}