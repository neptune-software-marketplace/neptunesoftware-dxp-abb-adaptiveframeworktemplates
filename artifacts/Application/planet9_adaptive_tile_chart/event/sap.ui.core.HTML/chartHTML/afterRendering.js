var runtime = true;
if (localAppID === "ADAPTIVEDESIGNER") runtime = false;

// LOAD 3D LIBRARY, IF NOT LOADED
if (Highcharts._modules && Highcharts._modules["Core/Chart/Chart3D.js"]) return;

const sep = isCordova() ? '' : '/';

const paths = [
    'public/highsuite/highcharts-3d.js',
].map(function (path) {
    return report.loadLibrary(`${sep}${path}`);
});

Promise.all(paths).then(function (_vals) {
    report.libLoaded = true;
});
