var myData = [];

// an example function that will get the data by index so it can be used however you want
function showDetails(index) {
   var selectedData = myData[index];
   alert(JSON.stringify(selectedData, null, 2));
}

const sheetId = "1o5w3Hqk-s7hBLSgaOdow-1h0wW2xamoJvn8STS6PZek"
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`
var sheetName = 'medications'
const api_key = "AIzaSyBJndqCORTBY92weU2Ia7uSUqqRnP9Mx7E"
var url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
           sheetId + '/values/' + sheetName +
           '?alt=json&key=' + api_key;
($.getJSON(url, 'callback=?')).done(function(data) {
// $.getJSON("https://spreadsheets.google.com/feeds/list/1XaFRnQfNPRP86UPNcdgQuCCH6AeVe5FZOxBHaIPZDpM/od6/public/values?alt=json", function(data) {
            console.log(data.values)
            console.log(data)
            myData = []; // reset whenever data loads
            var sheetData = data.values;

            var i;
            // for (i = 0; i < sheetData.length; i++) {
            for (i = 2; i < sheetData.length; i++) {
                bgcolor = ""
                if (i%2 == 0) {
                  bgcolor = "#ffffff"
                }
                else {
                  bgcolor = "#f0f0f0"
                }

                var dataPoint = {
                  id: sheetData[i][0],
                  english: sheetData[i][1],
                  cantonese: sheetData[i][2],
                  characters: sheetData[i][3],
                  audio: "Play"
                //   audio: sheetData[i][4]
                //   id: data.feed.entry[i]['gsx$id']['$t'],
                //   english: data.feed.entry[i]['gsx$English']['$t'],
                //   cantonese: data.feed.entry[i]['gsx$Cantonese']['$t'],
                //   characters: data.feed.entry[i]['gsx$Characters']['$t'],
                //   audio: data.feed.entry[i]['gsx$Audio']['$t']
                };
                myData.push(dataPoint);
                fn = "(function(){var music = new Audio('./medications_audio/" + dataPoint.id + ".mp3'); music.play();})();"
                document.getElementById('medications').innerHTML +=
                    (` <tr style="background-color: ${bgcolor}">` +
                    '<td>' +
                    `<input class="btn btn-primary" type="button" value="Play" onclick="${fn}">` +
                    '</td>' +
                        '<td>' +
                        " <span id='" + 't' + dataPoint.id + "'>" + dataPoint.english + '</span>' + 
                        '</td>' +
                        '<td>' +
                        '<span>' + dataPoint.cantonese + '</span>' +
                        '</td>' +
                        '<td>' +
                        '<span>' + dataPoint.characters + '</span>' +
                        '</td>' +
                        // '<td>' +
                        // '<span>' + "See More" + 
                        // '</span>' +
                        // "<div class='collapse' id='collapse" + dataPoint.id + "'>" + "placeholder text" +
                        // "</div>" +
                        // '</td>' +
                        // '<td>' +
                        // '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse' data-target='#collapse" + dataPoint.id + "'> See More </button>" + 
                        // '</span>' +
                        // "<div class='collapse' id='collapse" + dataPoint.id + "'>" + "placeholder text" +
                        // "</div>" +
                        // '</td>' +
                        '<th scope="row">' +
                        // '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse' data-target='#collapse" + dataPoint.id + "'> + </button>" + 
                        '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse'" + 'data-bs-toggle="collapse" data-bs-target="#r' + dataPoint.id + '"' + "data-target='#collapse" + dataPoint.id + "'> + </button>" + 
                        '</span>' +
                        ' <i class="bi bi-chevron-down"></i></th>' +
                        '</tr>' +
                        '<tr class="collapse accordion-collapse" id="r' + dataPoint.id + '"' + ' data-bs-parent=".table">' +
                        '<td colspan="5">test \n test \n test</td>' +
                        '</tr>'

                        );
            }
        });

sheetName = 'allergies'
var url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
            sheetId + '/values/' + sheetName +
            '?alt=json&key=' + api_key;
($.getJSON(url, 'callback=?')).done(function(data) {
// $.getJSON("https://spreadsheets.google.com/feeds/list/1XaFRnQfNPRP86UPNcdgQuCCH6AeVe5FZOxBHaIPZDpM/od6/public/values?alt=json", function(data) {
            console.log(data.values)
            console.log(data)
            myData = []; // reset whenever data loads
            var sheetData = data.values;

            var i;
            // for (i = 0; i < sheetData.length; i++) {
            for (i = 2; i < sheetData.length; i++) {
                bgcolor = ""
                if (i%2 == 0) {
                    bgcolor = "#ffffff"
                }
                else {
                    bgcolor = "#f0f0f0"
                }

                var dataPoint = {
                    id: sheetData[i][0],
                    english: sheetData[i][1],
                    cantonese: sheetData[i][2],
                    characters: sheetData[i][3],
                    audio: "Play"
                //   audio: sheetData[i][4]
                //   id: data.feed.entry[i]['gsx$id']['$t'],
                //   english: data.feed.entry[i]['gsx$English']['$t'],
                //   cantonese: data.feed.entry[i]['gsx$Cantonese']['$t'],
                //   characters: data.feed.entry[i]['gsx$Characters']['$t'],
                //   audio: data.feed.entry[i]['gsx$Audio']['$t']
                };
                myData.push(dataPoint);
                fn = "(function(){var music = new Audio('./allergies_audio/" + dataPoint.id + ".mp3'); music.play();})();"
                document.getElementById('allergies').innerHTML +=
                    // ('<tr class="dd d-flex justify-content-around">' +
                    // (' <tr data-bs-toggle="collapse" data-bs-target="#r' + dataPoint.id +'">' +
                    (` <tr style="background-color: ${bgcolor}">` +
                    '<td>' +
                    // '<span class="cn" onclick="showDetails(' + i + ');">' +
                    // '<span>' + "<button class='btn btn-primary' type='btn'>" + dataPoint.audio + "<span class='glyphicon glyphicon-play'></span> </button>" + 
                    // '</span>' +
                    // '</span>' +
                    `<input class="btn btn-primary" type="button" value="Play" onclick="${fn}">` +
                    '</td>' +
                        '<td>' +
                        " <span id='" + 't' + dataPoint.id + "'>" + dataPoint.english + '</span>' + 
                        '</td>' +
                        '<td>' +
                        '<span>' + dataPoint.cantonese + '</span>' +
                        '</td>' +
                        '<td>' +
                        '<span>' + dataPoint.characters + '</span>' +
                        '</td>' +
                        // '<td>' +
                        // '<span>' + "See More" + 
                        // '</span>' +
                        // "<div class='collapse' id='collapse" + dataPoint.id + "'>" + "placeholder text" +
                        // "</div>" +
                        // '</td>' +
                        // '<td>' +
                        // '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse' data-target='#collapse" + dataPoint.id + "'> See More </button>" + 
                        // '</span>' +
                        // "<div class='collapse' id='collapse" + dataPoint.id + "'>" + "placeholder text" +
                        // "</div>" +
                        // '</td>' +
                        '<th scope="row">' +
                        // '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse' data-target='#collapse" + dataPoint.id + "'> + </button>" + 
                        '<span>' + "<button class='btn btn-primary' type='btn' data-toggle='collapse'" + 'data-bs-toggle="collapse" data-bs-target="#r' + dataPoint.id + '"' + "data-target='#collapse" + dataPoint.id + "'> + </button>" + 
                        '</span>' +
                        ' <i class="bi bi-chevron-down"></i></th>' +
                        '</tr>' +
                        '<tr class="collapse accordion-collapse" id="r' + dataPoint.id + '"' + ' data-bs-parent=".table">' +
                        '<td colspan="5">test \n test \n test</td>' +
                        '</tr>'

                        );
            }
        });