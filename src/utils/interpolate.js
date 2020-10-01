export  function closestInterpolate(x, y, data, target='temperature', corx='longitude', cory='latitude') {
  let max = Number.POSITIVE_INFINITY;
  let best;
  for (let i=0; i<data.length; i++) {
    let d = data[i];
    let distance = Math.pow(x-d[corx],2) + Math.pow(y-d[cory],2);
    if (distance<max){
      best = d[target];
      max = distance;
    }
  }
  return best;
}

export  function inverseDistanceInterpolate(x, y, data, target='temperature', corx='longitude', cory='latitude') {
  let ans = 0;
  let tot = 0
  for (let i=0; i<data.length; i++) {
    let d = data[i];
    // let invdistance = 1/(Math.pow(x-d[corx],2) + Math.pow(y-d[cory],2));
    let invdistance = 1/(Math.abs(x-d[corx]) + Math.abs(y-d[cory]));
    ans = ans + invdistance*d[target];
    tot = tot + invdistance;
  }
  ans = ans/tot;
  return ans;
}