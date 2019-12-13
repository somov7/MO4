$('#generate').click(function(){
    generate(points);
    regression(dataX, dataY);
});

$(document).on('input', '#pointsNumber', function(){
    points = $(this).val();
    $('#pointsText').html("Количетво точек: " + points);
});

$(document).on('input', '#noiseValue', function(){
    noiseValue = $(this).val();
    $('#noiseText').html("Уровень шума: " + noiseValue);
});
