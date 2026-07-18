/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
const vhdlBuildMesh = document.getElementById("buildMesh");
function r4(string) {
    return parseInt(string, 4);
}
function s4(int) {
    return (Math.floor(int)).toString(4);
}
var rank = 64;
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
function logMapElements(value, key, map) {
    console.log(`mesh[${key}] = ${value}`);
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
        //console.log("borderkey = " + key + "; opposite key = " + oppositeborderkey);
        connectNodes(key, oppositeborderkey);
    }
    else if (digits.has("2") && digits.has("3")) {
        let oppositeborderkey = key.replace(/[023]/g, char => {
            const map = { 0: "1", 2: "3", 3: "2" };
            return map[char];
        });
        //console.log("borderkey = " + key + "; opposite key = " + oppositeborderkey);
        connectNodes(key, oppositeborderkey);
    }
    else if (digits.has("3") && digits.has("1")) {
        let oppositeborderkey = key.replace(/[031]/g, char => {
            const map = { 0: "2", 3: "1", 1: "3" };
            return map[char];
        });
        //console.log("borderkey = " + key + "; opposite key = " + oppositeborderkey);
        connectNodes(key, oppositeborderkey);
    }
}
function addBorderNeighbors() {
    //console.log("Border Collie");
    meshBoundary.clear();
    meshBoundary = new Map([...mesh.entries()].filter(([key, value]) => key.charAt(0) == "0" && value.length < 3));
    meshBoundary.forEach(connectAcrossBorders);
    //console.log("Border Collie");
}
/*window.onload*/vhdlBuildMesh.onclick = (event) => {
    mesh.clear(); // 1-DIGIT KEYS
    mesh.set("0", []);
    mesh.forEach(logMapElements);
    for (const neigh of ["1", "2", "3"]) {
        mesh.set(neigh, []);
        connectNodes("0", neigh);
    }
    kernel2d = Array(3);
    kernel2dr = Array(3);
    for (let ix = 0; ix < 3; ++ix) {
        kernel2d[ix] = [];
        kernel2dr[ix] = [];
    }
    mesh.forEach((value, key) => {
        if (key == "0") {
            kernel2d[1].push(key);
        }
        else if (key == "1") {
            kernel2d[0].push(key);
        }
        else {
            kernel2d[2].push(key);
        }
    });
    for (let ix = 0; ix < 3; ++ix) {
        kernel2d[ix].forEach((item) => kernel2dr[2 - ix].push(item));
    }
    for (let ix = 0; ix < 3; ++ix) {
        kernel2dr[ix].reverse();
    }
    console.log(kernel2d);
    console.log(kernel2dr);
    console.log("mesh 0123");
    mesh.forEach(logMapElements);
    let mesh0 = new Map(); // 2-DIGIT KEYS
    mesh.forEach((value, key) => {
        mesh0.set('0' + key, extend(value, '0'));
    });
    mesh.clear();
    mesh0.forEach((value, key) => {
        mesh.set((key).toString(4), value);
    });
    console.log("mesh 00,01,02,03");
    mesh.forEach(logMapElements);
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
    let rows2d = 7;
    mesh2d = Array(rows2d);
    mesh2dr = Array(rows2d);
    for (let ix = 0; ix < rows2d; ++ix) {
        mesh2d[ix] = [];
        mesh2dr[ix] = [];
    }
    kernel2dr[0].forEach((item) => mesh2d[0].push("3" + item));
    kernel2dr[0].forEach((item) => mesh2d[0].push("2" + item));
    for (let ix = 1; ix < 3; ++ix) {
        kernel2dr[ix].forEach((item) => mesh2d[ix].push("3" + item));
        kernel2d[ix - 1].forEach((item) => mesh2d[ix].push("0" + item));
        kernel2dr[ix].forEach((item) => mesh2d[ix].push("2" + item));
    }
    kernel2d[2].forEach((item) => mesh2d[3].push("0" + item));
    for (let ix = 4; ix < rows2d; ++ix) {
        kernel2dr[ix - 4].forEach((item) => mesh2d[ix].push("1" + item));
    }
    for (let ix = 0; ix < rows2d; ++ix) {
        mesh2d[ix].forEach((item) => mesh2dr[rows2d - 1 - ix].push(item));
    }
    console.log(mesh2d);
    console.log(mesh2dr);
    console.log("merged '2-digit-key' mesh of " + mesh.size + " nodes; 2-digit-key gives (parseInt('33', 4) + 1) nodes");
    mesh.forEach(logMapElements);
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
    console.log("merged '3-digit-key' mesh of " + mesh.size + " nodes; 3-digit-key gives (parseInt('333', 4) + 1) nodes");
    mesh.forEach(logMapElements);
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
    console.log("merged '4-digit-key' mesh of " + mesh.size + " nodes; 4-digit-key gives (parseInt('3333', 4) + 1) nodes");
    mesh.forEach(logMapElements);
    console.log("Total " + mesh.size + " nodes");
}
