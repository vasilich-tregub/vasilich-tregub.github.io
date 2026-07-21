function computeMesh2D() {
    let kernel2drows = kernel2d.length;
    let rows2d = 2 * kernel2drows + 1;
    mesh2d = Array(rows2d);
    mesh2dr = Array(rows2d);
    for (let ix = 0; ix < rows2d; ++ix) {
        mesh2d[ix] = [];
        mesh2dr[ix] = [];
    }
    let ix = 0;
    if (kernel2d[0].length == 1) {
        kernel2dr[0].forEach((item) => mesh2d[0].push("3" + item));
        kernel2dr[0].forEach((item) => mesh2d[0].push("2" + item));
        ++ix;
        for (; ix < kernel2drows; ++ix) {
            kernel2dr[ix].forEach((item) => mesh2d[ix].push("3" + item));
            kernel2d[ix - 1].forEach((item) => mesh2d[ix].push("0" + item));
            kernel2dr[ix].forEach((item) => mesh2d[ix].push("2" + item));
        }
        kernel2d[kernel2drows - 1].forEach((item) => mesh2d[ix].push("0" + item));
        ++ix;
        for (; ix < rows2d; ++ix) {
            kernel2dr[ix - kernel2drows - 1].forEach((item) => mesh2d[ix].push("1" + item));
        }
    }
    else {
        for (; ix < kernel2drows; ++ix) {
            kernel2dr[ix].forEach((item) => mesh2d[ix].push("1" + item));
        }
        kernel2d[0].forEach((item) => mesh2d[ix].push("0" + item));
        ++ix;
        for (; ix < rows2d - 1; ++ix) {
            kernel2dr[ix - kernel2drows - 1].forEach((item) => mesh2d[ix].push("2" + item));
            kernel2d[ix - kernel2drows].forEach((item) => mesh2d[ix].push("0" + item));
            kernel2dr[ix - kernel2drows - 1].forEach((item) => mesh2d[ix].push("3" + item));
        }
        kernel2dr[ix - kernel2drows - 1].forEach((item) => mesh2d[ix].push("2" + item));
        kernel2dr[ix - kernel2drows - 1].forEach((item) => mesh2d[ix].push("3" + item));
    }
    for (let ix = 0; ix < rows2d; ++ix) {
        mesh2d[ix].forEach((item) => mesh2dr[rows2d - 1 - ix].push(item));
        mesh2dr[rows2d - 1 - ix].reverse();
    }
    kernel2d = Array.from(mesh2d);
    kernel2dr = Array.from(mesh2dr);
}
function addMesh2dToDOM() { 
    var inputs = document.querySelector('div.centered');
    let inptag = '<div class="simplex" title=';
    let inpclose = '>0</div>';
    let inphtml = '';
    let divbreak = '<div class="break"></div>';
    let divempty = '<div class="simplex"></div>';
    let divpad = '<div class="simplexpad"></div>';    
    for (let iy = 0; iy < mesh2d.length; ++iy) {
        let row = mesh2d[iy];
        let ix = 0;
        for (; ix < row.length - 1; ++ix) {
            inphtml += inptag + row[ix] + inpclose;
            inphtml += divempty;
        }
        inphtml += inptag + row[ix] + inpclose;
        inphtml += divbreak;
    }
    inputs.innerHTML += inphtml;
    const titledSimplices = document.querySelectorAll("div.simplex[title]");
    titledSimplices.forEach((titledSimplexDiv) => titledSimplexDiv.setAttribute("contenteditable", "plaintext-only"));
    console.log(mesh2d);
    console.log(mesh2dr);
    var pyramid = document.querySelector('div.generatedmesh');
    let polyeven = '<polygon points="0,43 25,0 50,43" transform="translate(';
    let polyodd = '<polygon points="0,0 25,43 50,0" transform="translate(';
    let polyclose = '</polygon>';
    let pyhtml = '';
    let iy = 0;
    let y1 = 0;
    if (mesh2d[0].length == 1) {
        pyhtml += polyeven + '0 0' + ')">' + mesh2d[0][0] + polyclose;
        ++iy;
        y1 = 43 / 2;
    }
    for (; iy < mesh2d.length; ++iy) {
        let row = mesh2d[iy];
        let x = -50 * (row.length - 1) / 2;
        y = y1 + 43 * iy / 2;
        for (let ix = 0; ix < row.length; ++ix, x += 50) {
            pyhtml += polyodd + x + ' ' + y + ')">' + row[ix] + polyclose;
        }
        if (++iy == mesh2d.length) break;
        row = mesh2d[iy];
        x = -50 * (row.length - 1) / 2;
        for (let ix = 0; ix < row.length; ++ix, x += 50) {
            pyhtml += polyeven + x + ' ' + y + ')">' + row[ix] + polyclose;
        }
    }
    pyramid.children[0].innerHTML += pyhtml;
}
