let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let l = 0;
let r = 3;
let dataX = [], dataY = [];
let regrA = 0, regrB = 0;
let points = 500;
let noiseValue = 3;
let err = 0;

function func(x){
    return Math.pow(1.1, x) - 2;
}

let minx, maxx, miny, maxy;

function mapSegment(x, oldL, oldR, newL, newR){
    return newL + (x - oldL) / (oldR - oldL) * (newR - newL);
}

function generate(n){
    dataX = generateX(n);
    dataY = generateY();
}

function generateX(n){
    dataX = [];
    for(let i = 0; i < n; i++){
        let x = mapSegment(Math.random(), 0, 1, l, r);
        dataX.push(x);
    }
    return dataX;
}

function noise(width){
    let v = 0;
    for(let i = 0; i < 1000; i++)
        v += Math.random();
    return (v / 1000 - 0.5) * width;
}   

function generateY(){
    n = dataX.length;
    dataY = [];
    for(let i = 0; i < n; i++){
        let y = func(dataX[i]) + noise(noiseValue);
        dataY.push(y);
    }
    return dataY;
}

/*
function average(data){
    let avg = 0;
    for(let i = 0; i < data.length; i++){
        avg += data[i];
    }
    return avg / data.length;
}
*/

function regression(){
    let xx = 0, xy = 0, x = 0, y = 0;
    if(dataX.length == 0)
        return; 
    let k = parseInt(Math.round(dataX.length * 0.8));
    //let avgX = average(dataX);
    //let avgY = average(dataY);
    n = dataX.length;
    for(let i = 0; i < k; i++){
        xx += dataX[i] * dataX[i];
        x += dataX[i];
        xy += dataX[i] * dataY[i];
        y += dataY[i];
    }
    regrA = (k * xy - x * y) / (k * xx - x * x);
    regrB = (y - regrA * x) / k;
    err = 0;
    for(let i = k; i < n; i++){
        let e = dataY[i] - (regrA * dataX[i] + regrB);
        err += e * e;
    }
    err = Math.sqrt(err / (n - k))
    updateOutput();
}

function draw(dataX, dataY){  
    minx = Math.min.apply(null, dataX);
    maxx = Math.max.apply(null, dataX);
    miny = Math.min.apply(null, dataY);
    maxy = Math.max.apply(null, dataY);
    if($('#drawGrid').is(':checked'))
        drawGrid();
    if($('#drawFunction').is(':checked'))
        drawFunc();
    drawData(dataX, dataY);
    if($('#drawRegression').is(':checked'))
        drawRegr();
}

function drawData(dataX, dataY){
    let k = parseInt(Math.round(dataX.length * 0.8));
    if($('#drawData').is(':checked'))
        for(let i = 0; i < k; i++){
            let x = mapSegment(dataX[i], l, r, 25, 625);
            let y = mapSegment(dataY[i], func(l), func(r), 700, 100);
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    if($('#drawTestData').is(':checked'))
        for(let i = k; i < dataX.length; i++){
            let x = mapSegment(dataX[i], l, r, 25, 625);
            let y = mapSegment(dataY[i], func(l), func(r), 700, 100);
            ctx.fillStyle = "rgba(220, 0, 255, 0.5)";
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    
}

function drawFunc(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 700);
    for(let i = l; i <= r; i += 0.001){
        ctx.lineTo(mapSegment(i, l, r, 25, 625), mapSegment(func(i), func(l), func(r), 700, 100));
    }700
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawGrid(){
    ctx.font = "14px Arial";
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(100, 100, 100, 1)";
    ctx.fillStyle = "black";
    for(let i = -5; i <= 5; i++){
        let x = mapSegment(i, l, r, 25, 625);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 800);
        ctx.stroke();
        ctx.fillText(i, x + 1, 12);
    }
    for(let i = -10; i <= 10; i += 0.1){
        let y = mapSegment(i, func(l), func(r), 700, 100);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(650, y);
        ctx.stroke();
        ctx.fillText(Math.round(i * 10) / 10, 1, y - 2)
    }
}

function drawRegr(){
    ctx.strokeStyle = "rgba(0, 160, 0, 1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    let s = mapSegment(regrA * (l - 0.0417 * (r - l)) + regrB, func(l), func(r), 700, 100);
    let t = mapSegment(regrA * (r + 0.0417 * (r - l)) + regrB, func(l), func(r), 700, 100);
    ctx.moveTo(0, s);
    ctx.lineTo(650, t);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function cycle(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(dataX, dataY);
    window.requestAnimationFrame(cycle)
}

cycle();