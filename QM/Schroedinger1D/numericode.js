/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
/*
 * Utilities for qm computations with 1-D piece wise constant potential
 * mailto:vasilich@tregub.ru
 */
/* numerical solution of 1-D Schroedinger equation in [0, range) with an energy E and potential U_arr */
function num_Schroedinger(dx, range, E, U_arr) {
  var wf_arr = new Array();
  var iRightSide = Math.round(range/dx);
  var iJoint = iRightSide;
  wf_arr[1] = Math.exp(-Math.sqrt(2*(U_arr[0]-E))*0.0); // x coord = zero
  wf_arr[0] = Math.exp(-Math.sqrt(2*(U_arr[0]-E))*dx);  // x coord = minus one
  for (var i = 2; i <= iJoint; i++) {
    wf_arr[i] = ( 
                 2*(1-(5*dx*dx/12)*2*(E-U_arr[i-1]))*wf_arr[i-1] - 
                 (1+(dx*dx/12)*2*(E-U_arr[i-2]))*wf_arr[i-2] 
                ) / (1+(dx*dx/12)*2*(E-U_arr[i]));
    if ( (U_arr[i-2] < U_arr[i-1]) && (E < U_arr[i-1]) ) break;
  }
  iJoint = (i > iRightSide) ? (iRightSide - 1) : (i - 1);
  var wf_arr_jointNext = wf_arr[iJoint + 1];
  wf_arr[iRightSide] = Math.exp(-Math.sqrt(2*(U_arr[iRightSide]-E))*dx);
  wf_arr[iRightSide - 1] = Math.exp(-Math.sqrt(2*(U_arr[iRightSide]-E))*0.0);
  for (i = iRightSide - 2; i > iJoint; i--) {
    wf_arr[i] = ( 
                 2*(1-(5*dx*dx/12)*2*(E-U_arr[i+1]))*wf_arr[i+1] - 
                 (1+(dx*dx/12)*2*(E-U_arr[i+2]))*wf_arr[i+2] 
                ) / (1+(dx*dx/12)*2*(E-U_arr[i]));
  }
  for (i = iRightSide; i > iJoint; i--) {
    wf_arr[i] *= wf_arr_jointNext/wf_arr[iJoint + 1];
  }
  return wf_arr;
}
/* numerical solution of 1-D Schroedinger equation in [0, joint ) + [joint, range) 
 * with an energy E and potential U_arr. We start from both sides and iterate towards the middle point.
 * Returns discrepancy of a logarithmic derivative at the joint
*/
function num_Schroedinger_joint(dx, range, E, U_arr) {
  var wf_joint_arr = new Array;
  var wf_arr = new Array();
  var iRightSide = Math.round(range/dx);
  var iJoint = iRightSide;
  wf_arr[1] = Math.exp(-Math.sqrt(2*(U_arr[0]-E))*0.0); // x coord = zero
  wf_arr[0] = Math.exp(-Math.sqrt(2*(U_arr[0]-E))*dx);  // x coord = minus one
  for (var i = 2; i <= iJoint; i++) {
    wf_arr[i] = ( 
                 2*(1-(5*dx*dx/12)*2*(E-U_arr[i-1]))*wf_arr[i-1] - 
                 (1+(dx*dx/12)*2*(E-U_arr[i-2]))*wf_arr[i-2] 
                ) / (1+(dx*dx/12)*2*(E-U_arr[i]));
    if ( (U_arr[i-2] < U_arr[i-1]) && (E < U_arr[i-1]) ) break;
//    if ( (U_arr[i-1] < U_arr[i]) || (E > U_arr[i-1]) ) break;
  }
  iJoint = (i > iRightSide) ? (iRightSide - 1) : (i - 1);
  wf_joint_arr[0] = wf_arr[iJoint];
  wf_joint_arr[1] = ( 
                 2*(1-(5*dx*dx/12)*2*(E-U_arr[iJoint]))*wf_arr[iJoint] - 
                 (1+(dx*dx/12)*2*(E-U_arr[iJoint-1]))*wf_arr[iJoint-1] 
                ) / (1+(dx*dx/12)*2*(E-U_arr[iJoint+1]));

  wf_arr[iRightSide] = Math.exp(-Math.sqrt(2*(U_arr[iRightSide]-E))*dx);
  wf_arr[iRightSide - 1] = Math.exp(-Math.sqrt(2*(U_arr[iRightSide]-E))*0.0);
  for (i = iRightSide - 2; i > iJoint; i--) {
    wf_arr[i] = ( 
                 2*(1-(5*dx*dx/12)*2*(E-U_arr[i+1]))*wf_arr[i+1] - 
                 (1+(dx*dx/12)*2*(E-U_arr[i+2]))*wf_arr[i+2] 
                ) / (1+(dx*dx/12)*2*(E-U_arr[i]));
  }
  wf_joint_arr[2] = ( 
                     2*(1-(5*dx*dx/12)*2*(E-U_arr[i+1]))*wf_arr[i+1] - 
                     (1+(dx*dx/12)*2*(E-U_arr[i+2]))*wf_arr[i+2] 
                    ) / (1+(dx*dx/12)*2*(E-U_arr[i]));
  wf_joint_arr[3] = wf_arr[iJoint + 1];
//  return wf_joint_arr;
  return ( wf_joint_arr[3] - wf_joint_arr[2] ) / wf_joint_arr[2] - ( wf_joint_arr[1] - wf_joint_arr[0] ) / wf_joint_arr[0];
}
/* Calculate energy levels. The energy loop iterates through energies 
*  from a higher (emax) to lower (emin) level with a relatively coarse 
*  interval dE/(emax-emin) = 1/250. The function num_Schroedinger_joint 
*  calculates a log derivative discrepancy for the shooting procedure,  
*  given the 1*exp(kappa*x) left-hand wavefunction and 
*  the 1*exp(-kappa*x) left-hand wavefunction. The energy of 
*  a bound state found is determined with a 36-step bisection. 
*/
function findEigenvalues(emin, emax, U_range, U_arr) {
  var egap = emax - emin;
  var eigenvalues = new Array();
  var evindex = 0;
  var dE = egap/250;
  var discrepancy_1 = num_Schroedinger_joint(0.01, U_range, emin, U_arr);
  var discrepancy_1_1 = discrepancy_1;
  var discrepancy;
  for (var E = emin + egap/250; E <= emax; E += dE) {
    discrepancy = num_Schroedinger_joint(0.01, U_range, E, U_arr);
    if ( ( (discrepancy < 0 && discrepancy_1 > 0) || (discrepancy > 0 && discrepancy_1 < 0) ) && 
         ( (discrepancy <= discrepancy_1 && discrepancy_1 <= discrepancy_1_1) || 
           (discrepancy >= discrepancy_1 && discrepancy_1 >= discrepancy_1_1) ) ) {
      // the discrepancy-vs.-energy function has changed its sign and no overshoot, the root is in between!
      var dicrepancy_ = discrepancy;
      var discrepancy_1_ = discrepancy_1;
      var eSect = 1;
      var Efine = E;
      for (var ihalf = 1; ihalf <= 36; ihalf++) {
        eSect *= 2;
        discrepancy_ = num_Schroedinger_joint(0.01, U_range, Efine - dE/eSect, U_arr);
        if ( (discrepancy_ < 0 && discrepancy_1_ > 0) || (discrepancy_ > 0 && discrepancy_1_ < 0) ) { 
          Efine -= dE/eSect;
        }
        else { 
          discrepancy_1_ = discrepancy_;
        }
      } 
      eigenvalues[evindex++] = Efine; // - (discrepancy/(discrepancy - discrepancy_1)) * (dE/eSect);
      dE = egap/250; // the root has been found; relax the iteration step
    }
    else { // the discrepancy-vs.-energy derivative may have changed its sign! If so, we may have missed roots
           // (level splitting) and need a more detailed examination of the interval.
      if ( (discrepancy < 0 && discrepancy_1_1 < 0 && discrepancy_1 >= discrepancy && discrepancy_1 >= discrepancy_1_1) || 
           (discrepancy > 0 && discrepancy_1_1 > 0 && discrepancy_1 <= discrepancy && discrepancy_1 <= discrepancy_1_1) ) {
        if (dE == egap/250 && eigenvalues[evindex] <= E - 2 * dE) {
          E -= 2 * dE;
          dE = egap/1000; 
        }
      }
    }
    if (discrepancy == 0) {
      eigenvalues[evindex++] = E;
    }
    discrepancy_1_1 = discrepancy_1;
    discrepancy_1 = discrepancy;
  }
  return eigenvalues;
}