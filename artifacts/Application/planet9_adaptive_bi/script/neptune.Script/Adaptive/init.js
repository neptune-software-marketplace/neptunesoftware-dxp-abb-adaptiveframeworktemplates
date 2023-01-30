let currObj;
const dataSet = 'Adaptive';

const pivotGridId = `pivotRun${ModelData.genID()}`;

function getPivotGridEl() {
    return document.getElementById(pivotGridId);
}

modelDataReports.setSizeLimit(10000);
modelDataPivot.setSizeLimit(10000);
