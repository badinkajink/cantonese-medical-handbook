// function insertDictData(data) {
//     fetch('/insert_dict_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.text())
//     .then(responseText => {
//         console.log(responseText); // Should display 'Data inserted successfully'
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// function insertDictData(data) {
//     fetch('/insert_html_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.text())
//     .then(responseText => {
//         console.log(responseText); // Should display 'Data inserted successfully'
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

const sheetId = "1o5w3Hqk-s7hBLSgaOdow-1h0wW2xamoJvn8STS6PZek"
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`
// const sheetName = 'introductions'
// const api_key = "AIzaSyBJndqCORTBY92weU2Ia7uSUqqRnP9Mx7E"
// development API key
const api_key = "AIzaSyBYpORJpEgNr3ZmsCMqjPSmtufx-DJX1Oo"

function load_data(sn) {
    console.log("Checking the 'reload' sheet...");
    const sheetName = sn;
    const reload_name = "reload"; // Name of the "reload" sheet
    const url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
        sheetId + '/values/' + reload_name +
        '?alt=json&key=' + api_key;

    // Fetch the "reload" sheet data
    ($.getJSON(url, 'callback=?')).done(function (data) {
        const sheetData = data.values;
        if (sheetData.length >= 1 && sheetData[0].length >= 1) {
            const reloadValue = sheetData[0][0]; // Assuming the checkbox value is in cell A1

            // Check the value of the checkbox
            if (reloadValue === "TRUE") {
                console.log("Checkbox value is TRUE. Proceeding with data loading.");
                reload(sn);
            } else {
                console.log("Checkbox value is FALSE. Loading HTML from Flask.");
                document.getElementById(`${sheetName}`).innerHTML = content
            }
        } else {
            console.log("No data found in the 'reload' sheet.");
            // Handle the case when there's no data in the "reload" sheet
        }
    });
}

function reload(sn) {
    // console.log("hello")
    var myData = [];

    const sheetName = sn
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
        category: sheetName,
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
        // insertDictData(dataPoint)
    }

    console.log("storing data")
    // if new data is loaded, rewrite stored HTML
    var blob = new Blob([document.getElementById(`${sheetName}`).innerHTML], {type: 'text/html'});
    var html_data = {}

    });
}