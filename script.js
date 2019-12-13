let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let l = -Math.PI / 2;
let r = Math.PI / 2;
let dataX = [], dataY = [];
let regrA = 0, regrB = 0;
let points = 100;
let noiseValue = 10;

function func(x){
    return Math.sin(x) + 2;
}

let minx, maxx, miny, maxy;

function mapSegment(x, oldL, oldR, newL, newR){
    return newL + (x - oldL) / (oldR - oldL) * (newR - newL);
}

function generate(n){
    dataX = generateX(n);
    dataY = generateY(dataX);
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

function generateY(dataX){
    dataY = [];
    n = dataX.length;
    for(let i = 0; i < n; i++){
        let y = func(dataX[i]) + noise(noiseValue);
        dataY.push(y);
    }
    return dataY;
}

function average(data){
    let avg = 0;
    for(let i = 0; i < data.length; i++){
        avg += data[i];
    }
    return avg / data.length;
}

function regression(dataX, dataY){
    let a = 0, b = 0;
    if(dataX == undefined)
        return;
    let avgX = average(dataX);
    let avgY = average(dataY);
    n = dataX.length;
    for(let i = 0; i < n; i++){
        a += (dataX[i] - avgX) * (dataY[i] - avgY);
        b += (dataX[i] - avgX) * (dataX[i] - avgX);
    }
    regrA = a / b;
    regrB = avgY - regrA * avgX;
}

function draw(dataX, dataY){  
    minx = Math.min.apply(null, dataX);
    maxx = Math.max.apply(null, dataX);
    miny = Math.min.apply(null, dataY);
    maxy = Math.max.apply(null, dataY);
    if($('#drawFunction').is(':checked'))
        drawFunc();
    if($('#drawData').is(':checked'))
        drawData(dataX, dataY);
    if($('#drawRegression').is(':checked'))
        drawRegr();
}

function drawData(dataX, dataY){
    for(let i = 0; i < dataX.length; i++){
        let x = mapSegment(dataX[i], l, r, 25, 625);
        let y = mapSegment(dataY[i], func(l), func(r), 700, 100);
        ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
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