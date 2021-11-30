const parseTime = d3.timeParse("%d/%m/%Y");

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const parseCityName = (string) => {
  // "San Francisco, CA"
  return string.split(",")[0];
};

// https://www.tutorialspoint.com/finding-intersection-of-multiple-arrays-javascript
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

// https://www.tutorialspoint.com/finding-intersection-of-multiple-arrays-javascript
const intersectMany = (...arrs) => {
  let res = arrs[0].slice();
  for (let i = 1; i < arrs.length; i++) {
    res = intersection(res, arrs[i]);
  }
  return res;
};
