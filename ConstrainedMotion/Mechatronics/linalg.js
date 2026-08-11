function mpinverse(A, m, n)
{
    let tol = 0; let mindiag = Number.MAX_VALUE;
    //let m = A.length; let n = A[0].length;
    // A2 = A * AT;
    let A2 = Array(m).fill().map(() => Array(m).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j <= i; j++)
            for (let k = 0; k < n; k++)
                A2[i][j] += A[i][k] * A[j][k];
        if (A2[i][i] < mindiag)
            mindiag = A2[i][i];
    }
    tol = mindiag * mpitol;
    // L = Cholesky(A2);
    let r = 0;
    let L = Array(m).fill().map(() => Array(m).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = i; j < m; j++) {
            L[j][r] = A2[j][i];
            for (let k = 0; k < r; k++)
                L[j][i] -= L[j][k] * L[i][k];
        }
        if (L[i][r] > tol) {
            L[i][r] = Math.sqrt(L[i][r]);
            if (i < L.length - 1)
                for (let j = i + 1; j < m; j++)
                    L[j][r] /= L[i][r];
            r++;
        }
    }
    // M = LT*L
    let M = Array(r).fill().map(() => Array(r).fill(0));
    for (let i = 0; i < r; i++)
        for (let j = 0; j < r; j++)
            for (let k = 0; k < m; k++)
                M[i][j] += L[k][i] * L[k][j];
    //   M = Cholesky(M)
    for (let i = 0; i < r; i++) {
        M[i][i] = Math.sqrt(M[i][i]);
        for (let j = i + 1; j < r; j++)
            M[j][i] /= M[i][i];
        for (let j = i + 1; j < r; j++)
            for (let k = j; k < r; k++)
                M[k][j] -= M[k][i] * M[j][i];
    }
    // Q = [Chol(M)]^-1;
    let Q = Array(r).fill().map(() => Array(r).fill(0));
    for (let i = r - 1; i >= 0; i--)
        for (let j = i; j >= 0; j--)
            if (i == j)
                Q[j][j] = 1 / M[j][j];
            else
                for (let k = j + 1; k <= i; k++)
                    Q[j][i] -= M[k][j] * Q[k][i] / M[j][j];
    // P = QT * Q;
    let P = Array(r).fill().map(() => Array(r).fill(0));
    for (let i = 0; i < r; i++)
        for (let j = 0; j < r; j++)
            for (let k = 0; k < r; k++)
                P[i][j] += Q[i][k] * Q[j][k];
    let P2 = Array(r).fill().map(() => Array(r).fill(0));
    for (let i = 0; i < r; i++)
        for (let j = 0; j < r; j++)
            for (let k = 0; k < r; k++)
                P2[i][j] += P[i][k] * P[k][j];

    let P2LT = Array(r).fill().map(() => Array(m).fill(0));
    for (let i = 0; i < r; i++)
        for (let j = 0; j < m; j++)
            for (let k = 0; k < r; k++)
                P2LT[i][j] += P2[i][k] * L[j][k];

    let LP2LT = Array(m).fill().map(() => Array(m).fill(0));
    for (let i = 0; i < m; i++)
        for (let j = 0; j < m; j++)
            for (let k = 0; k < r; k++)
                LP2LT[i][j] += L[i][k] * P2LT[k][j];

    let AX = Array(n).fill().map(() => Array(m).fill(0));
    for (let i = 0; i < n; i++)
        for (let j = 0; j < m; j++)
            for (let k = 0; k < m; k++)
                AX[i][j] += A[k][i] * LP2LT[k][j];
    return AX;
}