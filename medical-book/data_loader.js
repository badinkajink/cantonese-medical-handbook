function load_data(sn) {
    console.log("hello")
    var myData = [];

    const sheetId = "1o5w3Hqk-s7hBLSgaOdow-1h0wW2xamoJvn8STS6PZek"
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`
    // const sheetName = 'introductions'
    const sheetName = sn
    const api_key = "AIzaSyBJndqCORTBY92weU2Ia7uSUqqRnP9Mx7E"
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
            sheetId + '/values/' + sheetName +
            '?alt=json&key=' + api_key;

    ($.getJSON(url, 'callback=?')).done(function(data) {
    myData = []; // reset whenever data loads
    var sheetData = data.values;
    var i;
    header = ('<div class="row" style="background-color: #f0f0f0;">' +
    '<div class="col-1"><b>Audio</b></div>'+
    '<div class="col-3"><b>English</b></div>'+
    '<div class="col-4"><b>Jyutping</b></div>'+
    '<div class="col-3"><b>Characters</b></div>'+
    '<div class="col-1"><b>See More</b> </div>'+
    '</div>')
    document.getElementById(`${sheetName}`).innerHTML += header
    for (i = 2; i < sheetData.length; i++) {
        bgcolor = i%2 == 0 ? "#ffffff" : "#f0f0f0"
        var dataPoint = {
        id: sheetData[i][0],
        english: sheetData[i][1],
        cantonese: sheetData[i][2],
        characters: sheetData[i][3],
        see_more: sheetData[i][4],
        audio: "Play"
        };
        myData.push(dataPoint);
        fn = `(function(){var music = new Audio('./${sheetName}_audio/${dataPoint.id}.mp3'); music.play();})();`
        
        document.getElementById(`${sheetName}`).innerHTML +=
        (`<div class="row p-2" style="background-color: ${bgcolor}">` +
        '<div class="col-1 my-auto">' +
        `<input class="btn btn-primary" type="button" value="Play" onclick="${fn}">` +
        '</div>' +

        `<div class="col-3 my-auto">${dataPoint.english}</div>` +
        `<div class="col-4 my-auto">${(dataPoint.cantonese).toLowerCase()}</div>` +
        `<div class="col-3 my-auto">${dataPoint.characters}</div>` +

        '<div class="col-1 my-auto" scope="row">' +
        "<button class='btn btn-primary' type='btn' data-toggle='collapse'" + 
        `data-bs-toggle="collapse" data-bs-target="#r${dataPoint.id}"` + 
        `data-target='#collapse${dataPoint.id}'> + </button>` + 
        '</div>' +

        `<div class="collapse accordion-collapse" id="r${dataPoint.id}" data-bs-parent=".table">` +
        `<td colspan="5">${dataPoint.see_more}</td>` +
        '</div>'
        );
    }

    });
}