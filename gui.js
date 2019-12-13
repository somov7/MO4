$('#generate').click(function(){
    generate(points);
    regression(dataX, dataY);
});

$(document).on('input', '#pointsNumber', function(){
    points = $(this).val();
});

$(document).on('input', '#noiseValue', function(){
    noiseValue = $(this).val();
});

function updateOutput(){
    let a = Math.round(regrA * 10000) / 10000;
    let b = Math.round(regrB * 10000) / 10000;
    let s = Math.round(err * 10000) / 10000;
    if(b >= 0)
        $('#regressionFormula').html("Уравнение регрессионной прямой: y = " + a + "x + " + b);
    else
        $('#regressionFormula').html("Уравнение регрессионной прямой: y = " + a + "x - " + (-b));
    $('#err').html("Корень среднеквадратичной ошибки: RMSE = " + s);
    
}