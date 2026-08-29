/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
var potentials = new Map([
    ["square_well",
        "  U_range = 10.0;\n  dx = 0.01;\n  for (let i=0; i <= U_range/dx; i++) {\n  var x = i*dx;\n  var depth = 2.0;\n" +
        "    if (x <= 0) {\n      U_arr[i] = 0;\n      continue;\n    }\n" +
        "    if (x < 10) {\n      U_arr[i] = -depth;\n      continue;\n    }\n" +
        "    if (x <= 10) {\n      U_arr[i] = 0;\n      continue;\n    }\n  }"
    ],
    ["Hooke",
        "  U_range = 10.5;\n  dx = 0.01;\n  for (let cm = 0; cm <= Math.round(U_range/dx); cm++) {\n" +
        "    U_arr[cm] = (cm*dx - U_range/2)*(cm*dx - U_range/2)/2;\n  }"],
    ["five_square_wells",
        "  U_range = 10.0;\n  var depth = 10.0;\n  dx = 0.01;\n  for (let i = 0; i <= U_range / dx; i++) {\n    var x = i * dx;\n" +
        "    if (x <= 0) { U_arr[i] = 0; continue; }\n    if (x <= 1) { U_arr[i] = -depth; continue; }\n" +
        "    if (x <= 2) { U_arr[i] = 0; continue; }\n    if (x <= 3) { U_arr[i] = -depth; continue; }\n" +
        "    if (x <= 4) { U_arr[i] = 0; continue; }\n    if (x <= 5) { U_arr[i] = -depth; continue; }\n" +
        "    if (x <= 6) { U_arr[i] = 0; continue; }\n    if (x <= 7) { U_arr[i] = -depth; continue; }\n" +
        "    if (x <= 8) { U_arr[i] = 0; continue; }\n    if (x <= 9) { U_arr[i] = -depth; continue; }\n" +
        "    if (x <= 10) { U_arr[i] = 0; continue; }\n  }\n "
    ],
    ["saw",
        "  U_range = 10.0;\n  var depth = 10.0;\n  dx = 0.01;\n  for (let i = 0; i <= U_range / dx; i++) {\n    var x = i * dx;\n" +
        "    if (x <= 0) { U_arr[i] = 0; continue; }\n    if (x <= 1.25) { U_arr[i] = -x/1.25 * depth; continue; }\n" +
        "    if (x <= 2.5) { U_arr[i] = (x-2.5)/1.25 * depth; continue; }\n    if (x <= 3.75) { U_arr[i] = -(x-2.5)/1.25 * depth; continue; }\n" +
        "    if (x <= 5) { U_arr[i] = (x-5)/1.25 * depth; continue; }\n    if (x <= 6.25) { U_arr[i] = -(x-5)/1.25 * depth; continue; }\n" +
        "    if (x <= 7.5) { U_arr[i] = (x-7.5)/1.25 * depth; continue; }\n    if (x <= 8.75) { U_arr[i] = -(x-7.5)/1.25 * depth; continue; }\n" +
        "    if (x <= 10) { U_arr[i] = (x-10)/1.25 * depth; continue; }\n  }\n"
    ],
    ["Coulomb",
        "  U_range = 40.0;\n  dx = 0.01;\n  l = 0; // angular momentum \n  for (let i = 0; i <= U_range / dx; i++) {\n    let x = i * dx;\n" +
        "    if (x <= 0) { U_arr[i] = 1E9; continue; }\n    else { U_arr[i] = -1 / x + l * (l + 1) / (2 * x * x); }\n  }\n" +
        "  // with Coulomb, U(0) is excluded from plot, see hack in code\n  ctl_Emin.value = -1; ctl_Emax.value = -0;"]
]);