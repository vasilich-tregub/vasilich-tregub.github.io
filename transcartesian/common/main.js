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
var mesh = new Map(); // map item: key is index.toString(4); value is an array of node neighbors; 3 neighbors or less
var neighmeshes = new Set();
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
/*window.onload*/vhdlBuildMesh.onclick = (event) => {
    mesh.clear();
    mesh.set("0", []);
    mesh.forEach(logMapElements);
    for (const neigh of ["1", "2", "3"]) {
        mesh.set(neigh, []);
        connectNodes("0", neigh);
    }
    console.log("mesh 0123");
    mesh.forEach(logMapElements);
    let mesh0 = new Map();
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
    console.log("merged mesh");
    mesh.forEach(logMapElements);
    mesh0.clear();
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
    console.log("next-level merged mesh");
    mesh.forEach(logMapElements);
    console.log(mesh.size);
    mesh0.clear();
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
    console.log("next-next-level merged mesh");
    mesh.forEach(logMapElements);
    console.log(mesh.size);
}
function solve() {
    let u = new Float64Array(rank);
    a = new Array(rank);
    for (let i = 0; i < rank; ++i) {
        a[i] = new Float64Array(rank + 1);
        for (let j = 0; j <= rank; ++j) {
            a[i][j] = 0;
        }
    }
    for (let i = 0; i < rank; ++i) {
        if (mesh[i].length == 3) {
            a[i][i] = -3.0;
            a[i][mesh[i][0]] = 1.0;
            a[i][mesh[i][1]] = 1.0;
            a[i][mesh[i][2]] = 1.0;
        }
        else {
            a[i][i] = 1.0;
        }
    }
    a[r4("111")][rank] = Number(b111.value);
    a[r4("112")][rank] = Number(b112.value);
    a[r4("121")][rank] = Number(b121.value);
    a[r4("122")][rank] = Number(b122.value);
    a[r4("211")][rank] = Number(b211.value);
    a[r4("212")][rank] = Number(b212.value);
    a[r4("221")][rank] = Number(b221.value);
    a[r4("222")][rank] = Number(b222.value);
    a[r4("223")][rank] = Number(b223.value);
    a[r4("232")][rank] = Number(b232.value);
    a[r4("233")][rank] = Number(b233.value);
    a[r4("322")][rank] = Number(b322.value);
    a[r4("323")][rank] = Number(b323.value);
    a[r4("332")][rank] = Number(b332.value);
    a[r4("333")][rank] = Number(b333.value);
    a[r4("331")][rank] = Number(b331.value);
    a[r4("313")][rank] = Number(b313.value);
    a[r4("311")][rank] = Number(b311.value);
    a[r4("133")][rank] = Number(b133.value);
    a[r4("131")][rank] = Number(b131.value);
    a[r4("113")][rank] = Number(b113.value);

    solvelinsys(a, rank, rank + 1, u);

    const numinputs = document.querySelectorAll('input[type=number]');
    for (el of numinputs) {
        el.value = u[r4(el.title)];
    }
}
function seedData() {
    b111.value = 1;
    b112.value = 2;
    b121.value = 3;
    b122.value = 4;
    b211.value = 5;
    b212.value = 4;
    b221.value = 3;
    b222.value = 2;
    b223.value = 1;
    b232.value = 0;
    b233.value = -1;
    b322.value = -2;
    b323.value = -1;
    b332.value = -2;
    b333.value = -3;
    b331.value = -4;
    b313.value = -3;
    b311.value = -2;
    b133.value = -1;
    b131.value = 0;
    b113.value = 1;
}