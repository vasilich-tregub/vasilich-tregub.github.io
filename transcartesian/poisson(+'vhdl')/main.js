/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function r4(string) {
    return parseInt(string, 4);
}
var rank = 64;
var a;
var mesh = new Map(); // map item: key is index.toString(4); value is an array of node neighbors, 3 neighbors or less
var neighmeshes = new Set();
var meshBoundary = new Map();
function connectNodes(node1key, node2key) { 
    mesh.get(node1key).push(node2key);
    mesh.get(node2key).push(node1key);
}
function translate(value, msb) {
    let retval = [];
    value.forEach((el) => {
        el = msb + el.substring(1);
        retval.push(el);
    });
    return retval;
}
function extend(value, shift) {
    let retval = [];
    value.forEach((el) => { retval.push(shift + el); });
    return retval;
}
function addCornerNeighbors(keylen) {
    let corners = new Set(["1", "2", "3"]);
    for (let corner of corners) {
        let cornernode = "0" + corner.padEnd(keylen - 1, corner);
        let neighcorners = new Set([...corners]);
        neighcorners.delete(corner);
        let neighIter = neighcorners[Symbol.iterator]();
        let neigh = neighIter.next().value;
        let anotherneigh = neighIter.next().value;
        let neighnode = neigh + anotherneigh.padEnd(keylen - 1, anotherneigh);
        connectNodes(cornernode, neighnode);
        neighnode = anotherneigh + neigh.padEnd(keylen - 1, neigh);
        connectNodes(cornernode, neighnode);
    }
}
function connectAcrossBorders(value, key) {
    let digits = new Set([...key]);
    if (digits.has("1") && digits.has("2")) {
        let oppositeborderkey = key.replace(/[012]/g, char => {
            const map = { 0 : "3", 1: "2", 2: "1" };
            return map[char];
        });
        connectNodes(key, oppositeborderkey);
    }
    else if (digits.has("2") && digits.has("3")) {
        let oppositeborderkey = key.replace(/[023]/g, char => {
            const map = { 0: "1", 2: "3", 3: "2" };
            return map[char];
        });
        connectNodes(key, oppositeborderkey);
    }
    else if (digits.has("3") && digits.has("1")) {
        let oppositeborderkey = key.replace(/[031]/g, char => {
            const map = { 0: "2", 3: "1", 1: "3" };
            return map[char];
        });
        connectNodes(key, oppositeborderkey);
    }
}
function addBorderNeighbors() {
    meshBoundary.clear();
    meshBoundary = new Map([...mesh.entries()].filter(([key, value]) => key.charAt(0) == "0" && value.length < 3));
    meshBoundary.forEach(connectAcrossBorders);
}
window.onload = (event) => {
    mesh.clear(); // 1-DIGIT KEYS
    mesh.set("0", []);
    for (const neigh of ["1", "2", "3"]) {
        mesh.set(neigh, []);
        connectNodes("0", neigh);
    }
    let mesh0 = new Map(); // 2-DIGIT KEYS
    mesh.forEach((value, key) => {
        mesh0.set('0' + key, extend(value, '0'));
    });
    mesh.clear();
    mesh0.forEach((value, key) => {
        mesh.set((key).toString(4), value);
    });
    neighmeshes.clear();
    for (const neigh of ["1", "2", "3"]) {
        let neighmesh = new Map();
        mesh.forEach((value, key) => {
            key = neigh + key.substring(1);
            neighmesh.set((key), translate(value, neigh));
        });
        neighmeshes.add(neighmesh);
    }
    const iter = neighmeshes[Symbol.iterator]();
    mesh = new Map([...mesh, ...iter.next().value, ...iter.next().value, ...iter.next().value]);
    addCornerNeighbors(2);
    addBorderNeighbors();
    mesh0.clear(); // 3-DIGIT KEYS
    mesh.forEach((value, key) => {
        mesh0.set('0' + key, extend(value, '0'));
    });
    mesh.clear();
    mesh0.forEach((value, key) => {
        mesh.set((key).toString(4), value);
    });
    neighmeshes.clear();
    for (const neigh of ["1", "2", "3"]) {
        let neighmesh = new Map();
        mesh.forEach((value, key) => {
            key = neigh + key.substring(1);
            neighmesh.set((key), translate(value, neigh));
        });
        neighmeshes.add(neighmesh);
    }
    mesh = new Map([...mesh, ...iter.next().value, ...iter.next().value, ...iter.next().value]);
    addCornerNeighbors(3);
    addBorderNeighbors();
    return;
    mesh0.clear(); // 4-DIGIT KEYS
    mesh.forEach((value, key) => {
        mesh0.set('0' + key, extend(value, '0'));
    });
    mesh.clear();
    mesh0.forEach((value, key) => {
        mesh.set((key).toString(4), value);
    });
    neighmeshes.clear();
    for (const neigh of ["1", "2", "3"]) {
        let neighmesh = new Map();
        mesh.forEach((value, key) => {
            key = neigh + key.substring(1);
            neighmesh.set((key), translate(value, neigh));
        });
        neighmeshes.add(neighmesh);
    }
    mesh = new Map([...mesh, ...iter.next().value, ...iter.next().value, ...iter.next().value]);
    addCornerNeighbors(4);
    addBorderNeighbors();
}
var u = new Float64Array(rank);
var f = new Float64Array(rank); // for inner nodes, f = h^2*4*pi*ro (ro is a charge density), for boundary nodes f = boundary potential
function solve() {
    let amesh = [];
    mesh.forEach((value, key) => {
        amesh[r4(key)] = value;
    });
    let u = new Float64Array(rank);
    a = new Array(rank);
    for (let i = 0; i < rank; ++i) {
        a[i] = new Float64Array(rank + 1);
        for (let j = 0; j <= rank; ++j) {
            a[i][j] = 0;
        }
    }
    for (let i = 0; i < rank; ++i) {
        if (amesh[i].length == 3) {
            a[i][i] = 3.0;
            a[i][r4(amesh[i][0])] = -1.0;
            a[i][r4(amesh[i][1])] = -1.0;
            a[i][r4(amesh[i][2])] = -1.0;
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