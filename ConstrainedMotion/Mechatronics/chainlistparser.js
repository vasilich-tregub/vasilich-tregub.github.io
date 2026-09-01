/* TERMS OF USE
 * This source code is subject to the terms of the MIT License.
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
const netlistTriPend = "* Triple Pendulum\r\nB1 0 1 1\r\nB2 1 1 1\r\n" +
    "B3 1 2 1\r\n" +
    "C1 B1 (0,0)\r\nC2 B1 B2\r\n" +
    "C3 B2 B3\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlistChain = "* 12 Link Chain\r\n" +
    "B15 3.0 0 1\r\nB16 3.2 0 1\r\n" +
    "B13 2.6 0 1\r\nB14 2.8 0 1\r\n" +
    "B11 2.2 0 1\r\nB12 2.4 0 1\r\n" +
    "B9 1.8 0 1\r\nB10 2.0 0 1\r\n" +
    "B7 1.4 0 1\r\nB8 1.6 0 1\r\n" +
    "B5 1.0 0 1\r\nB6 1.2 0 1\r\n" +
    "B3 0.6 0 1\r\nB4 0.8 0 1\r\n" +
    "B1 0.2 0 1\r\nB2 0.4 0 1\r\n" +
    "C1 B1 (0,0)\r\nC2 B1 B2\r\n" +
    "C3 B2 B3\r\nC4 B3 B4\r\n" +
    "C5 B4 B5\r\nC6 B5 B6\r\n" +
    "C7 B6 B7\r\nC8 B7 B8\r\n" +
    "C9 B8 B9\r\nC10 B9 B10\r\n" +
    "C11 B10 B11\r\nC12 B11 B12\r\n" +
    "C13 B12 B13\r\nC13 B13 B14\r\n" +
    "C15 B14 B15\r\nC16 B15 B16\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlistSymPiston = "* Symmetric Piston\r\nB1 -1 1 1\r\nB2 1 1 1\r\n" +
    "B3 0 1.9999 1\r\n" +
    "C1 B1 (0,0) orange\r\nC2 B2 (0,0)\r\n" +
    "C3 B1 B3\r\nC4 B2 B3 magenta\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlistAsymPiston = "* Asymmetric Piston\r\nB1 -1 1 1\r\nB2 1 1 2\r\n" +
    "B3 0 2 1\r\n" +
    "C1 B1 (0,0)\r\nC2 B2 (0,0)\r\n" +
    "C3 B1 B3\r\nC4 B2 B3\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlistSwing = "* \"Rubber\" Swing\r\nB1 0.4 0 1\r\nB2 0.8 0 1\r\n" +
    "B3 1.2 0 1\r\nB4 1.6 0 1\r\n" +
    "B5 1.6 0.4 1\r\nB6 -0.4 0 1\r\n" +
    "B7 -0.8 0 1\r\nB8 -1.2 0 1\r\n" +
    "B9 -1.6 0 1\r\nB10 -1.6 0.4 1\r\n" +
    "C1 B1 (0,0)\r\nC2 B1 B2\r\n" +
    "C3 B2 B3\r\nC4 B3 B4\r\n" +
    "C5 B4 B5\r\nC6 B6 (0,0)\r\n" +
    "C7 B6 B7\r\nC8 B7 B8\r\n" +
    "C9 B8 B9\r\nC10 B9 B10\r\nC11 B5 B10\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlist2p3bPend = "* 2-pivot 3-bob Pendulum\r\n" +
    "B1 -1 1 1\r\nB2 1 1 1\r\nB3 0 2 1\r\n" +
    "C1 B1 (-2,0)\r\nC2 B1 B3\r\nC3 B2 B3\r\nC4 B2 (2,0)\r\n" +
    ".tran 0 10 1E-3\r\n.print 1 2 3 4 5";
const netlist2p2bPend = "* 2-pivot 2-bob Pendulum\r\n" +
    "B1 -1 1 1\r\nB2 1 -1 1\r\n" +
    "C1 B1 (-2,0)\r\nC2 B1 B2\r\nC4 B2 (2,0)\r\n" +
    ".tran 0 10 1E-3\r\n";
const netlistSoliton = "* \"Soliton\" \r\n" +
    "B1 0 1 1\r\nB2 0 -1 1\r\n" +
    "C1 B1 (1,1)\r\nC2 B1 B2\r\nC4 B2 (-1,-1)\r\n" +
    ".tran 0 10 1E-3\r\n";
const netlistCrosshair = "* Crosshair Pendulum\r\n" +
    "B1 0.001 0 1\r\nB2 0 2 1\r\n" +
    "C1 B1 B2\r\nT1 B1 0 1 0\r\nT2 B2 1 0 0\r\n" +
    ".tran 0 10 1E-3\r\n";
const netlistUnbalanced = "* Unbalanced Rod\r\n" +
    "B1 1 0 1\r\nB2 -1 0 2\r\n" +
    "C1 B1 (0,0)\r\nC2 B2 (0,0)\r\nC3 B1 B2\r\n" +
    ".tran 0 10 1E-3\r\n";
const netlistInvertedPendulum = "* Inverted pendulum\r\n" +
    "B1 0 0 1 2 0\r\nB2 0 .25 1\r\nB3 .5 2 .1\r\n" +
    "C1 B1 B2\r\nC2 B2 B3\r\nT1 B1 0 1 0\r\nT2 B2 1 0 0\r\n" +
    ".tran 0 10 1E-3\r\n";
class Body {
    bodyName;
    m;
    x;
    y;
    vx;
    vy;
    constructor (bN, X, Y, M, Vx = 0, Vy = 0) {
        this.bodyName = bN;
        this.m = Math.sqrt(M);
        this.x = X;
        this.y = Y;
        this.vx = Vx;
        this.vy = Vy;
    }
}
class Link
{
    LinkName;
    B1;
    B2;
    anchorX;
    anchorY;
    length2;
    constructor(lN, b1, b2 = null, x = 0, y = 0, len2, color = "")
    {
        this.LinkName = lN;
        this.B1 = b1;
        this.B2 = b2;
        this.anchorX = x;
        this.anchorY = y;
        this.length2 = len2;
        this.color = color;
    }
}
class Track
{
    TrackName;
    B;
    kx;
    ky;
    konst;
    constructor(tN, b, Kx, Ky, Konst)
    {
        this.TrackName = tN;
        this.B = b;
        this.kx = Kx;
        this.ky = Ky;
        this.konst = Konst;
    }
}
function parseNetlist()
{
    const netlistLines = idNetlist.value.split('\n');
    try {
        let delimiter = ' ';
        let chips = null;
        for(currLine of netlistLines)
        {
            if (currLine.length == 0) continue;
            chips = currLine.split(delimiter);

            if (currLine[0] == '*')
                continue;

            if (currLine[0] == '.') {
                switch (chips[0]) {
                    case ".tran":
                        currtime = Number(chips[1]);
                        fintime = Number(chips[2]);
                        timestep = Number(chips[3]);
                        deltat = timestep;
                        xstepCount = Math.floor((fintime - currtime) / timestep);
                        break;
                    /*
                                  case ".print":
                                    nodeset = new ArrayList();
                                    for (int i = 1; i < chips.Length; i++)
                                      nodeset.push( Number(chips[i]) <= nodes ? Number(chips[i]) - 1 : 0 );
                                    break;
                    */
                }
                continue;
            }

            switch (currLine[0]) {
                case 'B':
                    if (chips.length == 4) {
                        Bs.push(new Body(chips[0], Number(chips[1]), Number(chips[2]), Number(chips[3])));
                    }
                    else if (chips.length == 6) {
                        Bs.push(new Body(chips[0], Number(chips[1]), Number(chips[2]), Number(chips[3]), Number(chips[4]), Number(chips[5])));
                    }
                    break;
                case 'C':
                    B1 = null;
                    B2 = null;
                    for(B of Bs)
                    {
                        if (B.bodyName == chips[1])
                            B1 = B;
                    }
                    if (B1 == null)
                        break;
                    if (chips[3] === undefined)
                        color = "yellow";
                    else
                        color = chips[3];
                    if (chips[2][0] == '(') {
                        str = chips[2];
                        str = str.replaceAll("(", "");
                        str = str.replaceAll(")", "");
                        console.log(str.split(',')[0]);
                        console.log(str.split(',')[1]);
                        ancX = Number(str.split(',')[0]);
                        ancY = Number(str.split(',')[1]);
                        Cs.push(new Link(chips[0], B1, B2, ancX, ancY, 
                            (B1.x - ancX) * (B1.x - ancX) + (B1.y - ancY) * (B1.y - ancY), color));
                    }
                    else {
                        for(B of Bs)
                        {
                            if (B.bodyName == chips[2])
                                B2 = B;
                        }
                        if (B2 == null)
                            break;
                        Cs.push(new Link(chips[0], B1, B2, 0, 0, 
                            (B1.x - B2.x) * (B1.x - B2.x) + (B1.y - B2.y) * (B1.y - B2.y), color));
                    }
                    CTs.push("Link");
                    break;
                case 'T':
                    b = null;
                    for(B of Bs)
                    {
                        if (B.bodyName == chips[1])
                            b = B;
                    }
                    if (b == null)
                        break;
                    Cs.push(new Track(chips[0], b, Number(chips[2]), Number(chips[3]), Number(chips[4])));
                    CTs.push("Track");
                    break;
            }
        }

        bodies = Bs.length;
        constraints = Cs.length;
        Q = Array(2 * bodies).fill(0);
        E = 0;
        for (let i = 0; i < bodies; i++)
        {
            Q[2 * i + 1] = -g;
            //          Q[2*i] = -1.0;
            E += (Bs[i]).m * (Bs[i]).m * (-Q[2 * i + 1] * (Bs[i]).y - Q[2 * i] * (Bs[i]).x +
                (Bs[i]).vx * (Bs[i]).vx / 2 + (Bs[i]).vy * (Bs[i]).vy / 2 );
        }
        console.log("E_total = ", E);
    }
    catch (e)
    {
        console.error("Failed to parse the netlist: ", e.message);
    }

}
