const parseTime = d3.timeParse("%d/%m/%Y");
const formatTime = d3.timeFormat("%d/%m/%Y");

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const intersection = (arr1, arr2) => {
  const res = [];
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      continue;
    }
    res.push(arr1[i]);
  }
  return res;
};

const intersectMany = (...arrs) => {
  let res = arrs[0].slice();
  for (let i = 1; i < arrs.length; i++) {
    res = intersection(res, arrs[i]);
  }
  return res;
};
