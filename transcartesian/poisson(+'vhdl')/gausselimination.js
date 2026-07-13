/* TERMS OF USE
 * This source code is subject to the terms of the MIT License.
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function gausselim(AB, rows, cols)
{
    for (let i = 0; i < rows; i++)
    {
        let maxpival = Math.abs(AB[i][i]);
        let jpiv = i;
        for (let j = i + 1; j < rows; j++)
        if (maxpival < Math.abs(AB[j][i])) {
            maxpival = Math.abs(AB[j][i]);
            jpiv = j;
        }

        if (jpiv != i)
            for (let k = i; k < cols; k++) {
                let tmp = AB[i][k];
                AB[i][k] = AB[jpiv][k];
                AB[jpiv][k] = tmp;
            }

        if (AB[i][i] != 0) {
            for (let j = i + 1; j < rows; j++)
            {
                let rowScale = AB[j][i] / AB[i][i];
                for (let k = 0; k < cols; k++)
                {
                    if (k <= i)
                        AB[j][k] = 0;
                    else
                        AB[j][k] -= AB[i][k] * rowScale;
                }
            }
        }
    }
}

function solvelinsys(AB, rows, cols, x_arr)
{
    gausselim(AB, rows, cols);
    for (let i = rows - 1; i >= 0; i--) {
        let x = AB[i][cols - 1];
        for (let j = cols - 2; j > i; j--)
            x -= AB[i][j] * x_arr[j];

        x_arr[i] = (x / AB[i][i]);
    }
    return
}
