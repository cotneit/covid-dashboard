/**
 *
 * @param {number} caseValue - selected status value
 * @param {number} populationValue - population for selected country
 */
function indexPerPopulation(caseValue, populationValue) {
  return Math.round((caseValue / populationValue) * 100000);
}
/**
 *
 * @param {number} value - current value
 * @param {number} prevValue - previous value
 */
function increasePerDay(value, prevValue) {
  return value - prevValue;
}

function getChartColors(status, type) {
  if (type === 'background') {
    if (status === 'cases') {
      return '#c8354e';
    }
    if (status === 'recovered') {
      return '#33b349';
    }
    if (status === 'deaths') {
      return '#888888';
    }
  }
  if (type === 'border') {
    if (status === 'cases') {
      return '#902039';
    }
    if (status === 'recovered') {
      return '#278040';
    }
    if (status === 'deaths') {
      return '#888888';
    }
  }
  if (type === 'chart') {
    if (status === 'gridLine') {
      return '#666666';
    }
    if (status === 'font') {
      return '#1c1c22';
    }
  }
  return '#eeeeee';
}

function getNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export {
  indexPerPopulation,
  getChartColors,
  increasePerDay,
  getNumberWithCommas,
};
