/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
var potentials = new Map([
    ["Fowler-Nordheim",
        "  U_range = 50.0;\n  dx = 0.04;\n  for (var i = 0; i < U_range/dx; i++) {\n    if (i*dx < 24.0)\n      U_arr[i] = 0;\n    else\n      U_arr[i] = 50.0*(25.0-i*dx);\n  }"],
    ["Well",
        "  U_range = 50.0;\n  dx = 0.04;\n  for (var i = 0; i < U_range/dx; i++) {\n    if (i*dx < 23.0 | i*dx > 27)\n      U_arr[i] = 0;\n    else\n      U_arr[i] = -1200.0;\n  }"],
    ["Resonant_Tunneling",
        "  U_range = 50.0;\n  dx = 0.04;\n  for (var i = 0; i < U_range/dx; i++) {\n    if (i*dx > 23.9 & i*dx < 24 | i*dx > 24.14 & i*dx < 24.24)\n      U_arr[i] = 110.0;\n    else\n      U_arr[i] = 0.0;\n  }"]
]);