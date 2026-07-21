/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function r4(string) {
    return parseInt(string, 4);
}
var rank = 256;
var a;
var mesh = new Map(); // map item: key is index.toString(4); value is an array of node neighbors, 3 neighbors or less
var kernel2d = [];
var kernel2dr = [];
var mesh2d = [];
var mesh2dr = [];
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
    //mesh.forEach(logMapElements);
    for (const neigh of ["1", "2", "3"]) {
        mesh.set(neigh, []);
        connectNodes("0", neigh);
    }
    kernel2d = [[1], [0], [2, 3]];
    kernel2dr = [[3, 2], [0], [1]];
    console.log(kernel2d);
    console.log(kernel2dr);
    console.log("mesh 0123");
    //mesh.forEach(logMapElements);
    let mesh0 = new Map(); // 2-DIGIT KEYS
    mesh.forEach((value, key) => {
        mesh0.set('0' + key, extend(value, '0'));
    });
    mesh.clear();
    mesh0.forEach((value, key) => {
        mesh.set((key).toString(4), value);
    });
    console.log("mesh 00,01,02,03");
    //mesh.forEach(logMapElements);
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
    computeMesh2D();
    console.log(mesh2d);
    console.log(mesh2dr);
    console.log("merged '2-digit-key' mesh of " + mesh.size + " nodes; 2-digit-key gives (parseInt('33', 4) + 1) nodes");
    //mesh.forEach(logMapElements);
    console.log("Total " + mesh.size + " nodes");
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
    computeMesh2D();
    console.log(mesh2d);
    console.log(mesh2dr);
    console.log("merged '3-digit-key' mesh of " + mesh.size + " nodes; 3-digit-key gives (parseInt('333', 4) + 1) nodes");
    //mesh.forEach(logMapElements);
    console.log("Total " + mesh.size + " nodes");
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
    computeMesh2D();
    console.log(mesh2d);
    console.log(mesh2dr);
    console.log("merged '4-digit-key' mesh of " + mesh.size + " nodes; 4-digit-key gives (parseInt('3333', 4) + 1) nodes");
    //mesh.forEach(logMapElements);
    console.log("Total " + mesh.size + " nodes");
    addMesh2dToDOM();
    return;
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
            el.innerText = u[r4(el.title)].toFixed(2);
        }
    }

    const trixels = document.querySelectorAll('polygon');
    let maxval = Math.max(...u)
    for (trixel of trixels) {
        if (trixel.textContent) {
            trixel.style.filter = "brightness(" + u[r4(trixel.textContent)]/maxval + ")";
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
            el.innerText = f[r4(el.title)].toFixed(2);
        }
    }
}
function seedData() {
    document.querySelectorAll("div.simplex[title]").forEach((el) => { el.innerText = 0; });
    document.querySelector("div.simplex[title='0031']").innerText = 19; // charge distribution
    document.querySelector("div.simplex[title='0030']").innerText = 12;
    document.querySelector("div.simplex[title='0002']").innerText = 12;
    document.querySelector("div.simplex[title='0213']").innerText = 12;
    document.querySelector("div.simplex[title='0231']").innerText = 12;
    document.querySelector("div.simplex[title='0230']").innerText = 19;
    document.querySelector("div.simplex[title='0321']").innerText = 12;
    document.querySelector("div.simplex[title='0320']").innerText = 19;
    document.querySelector("div.simplex[title='1011']").innerText = 15;
    document.querySelector("div.simplex[title='1111']").innerText = 5; // boundary
    document.querySelector("div.simplex[title='1112']").innerText = 10;
    document.querySelector("div.simplex[title='1121']").innerText = 20;
    document.querySelector("div.simplex[title='1122']").innerText = 40;
    document.querySelector("div.simplex[title='1211']").innerText = 60;
    document.querySelector("div.simplex[title='1212']").innerText = 60;
    document.querySelector("div.simplex[title='1221']").innerText = 40;
    document.querySelector("div.simplex[title='1222']").innerText = 20;
    document.querySelector("div.simplex[title='2111']").innerText = 10;
    document.querySelector("div.simplex[title='2112']").innerText = 20;
    document.querySelector("div.simplex[title='2121']").innerText = 40;
    document.querySelector("div.simplex[title='2122']").innerText = 60;
    document.querySelector("div.simplex[title='2211']").innerText = 60;
    document.querySelector("div.simplex[title='2212']").innerText = 40;
    document.querySelector("div.simplex[title='2221']").innerText = 20;
    document.querySelector("div.simplex[title='2222']").innerText = 10;
    document.querySelector("div.simplex[title='2223']").innerText = 20;
    document.querySelector("div.simplex[title='2232']").innerText = 30;
    document.querySelector("div.simplex[title='2233']").innerText = 35;
    document.querySelector("div.simplex[title='2322']").innerText = 30;
    document.querySelector("div.simplex[title='2323']").innerText = 20;
    document.querySelector("div.simplex[title='2332']").innerText = 10;
    document.querySelector("div.simplex[title='2333']").innerText = 10;
    document.querySelector("div.simplex[title='3222']").innerText = 10;
    document.querySelector("div.simplex[title='3223']").innerText = 15;
    document.querySelector("div.simplex[title='3232']").innerText = 20;
    document.querySelector("div.simplex[title='3233']").innerText = 25;
    document.querySelector("div.simplex[title='3322']").innerText = 30;
    document.querySelector("div.simplex[title='3323']").innerText = 40;
    document.querySelector("div.simplex[title='3332']").innerText = 50;
    document.querySelector("div.simplex[title='3333']").innerText = 60;
    document.querySelector("div.simplex[title='3331']").innerText = 50;
    document.querySelector("div.simplex[title='3313']").innerText = 40;
    document.querySelector("div.simplex[title='3311']").innerText = 30;
    document.querySelector("div.simplex[title='3133']").innerText = 25;
    document.querySelector("div.simplex[title='3131']").innerText = 20;
    document.querySelector("div.simplex[title='3113']").innerText = 15;
    document.querySelector("div.simplex[title='3111']").innerText = 10;
    document.querySelector("div.simplex[title='1333']").innerText = 5;
    document.querySelector("div.simplex[title='1331']").innerText = 10;
    document.querySelector("div.simplex[title='1313']").innerText = 15;
    document.querySelector("div.simplex[title='1311']").innerText = 20;
    document.querySelector("div.simplex[title='1133']").innerText = 25;
    document.querySelector("div.simplex[title='1131']").innerText = 25;
    document.querySelector("div.simplex[title='1113']").innerText = 20;
}
function zeroData() {
    document.querySelectorAll("div.simplex[title]").forEach((el) => { el.innerText = 0; });
}