function search(name="") {
    if (name.length > 0){
        console.log(name)
    }
    let search = document.getElementById("sb")

    let s_len = search.value.length
    let s_blank = $.trim($('#sb').val()) == ''

    if (s_len == 0 || s_blank) {
        // $('#sb').empty()
        search.value = ""
        search.focus()
        console.log("empty search string, doing nothing")
    }
    else {
        console.log(search.value)
        data_to_save = search.value

        $.ajax({
            type: "POST",
            url: "/search",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(data_to_save),
            success: function(result){
                search_results = result["search_results"]
                // search_term = result["search_term"]
                // window.location.href= '/'
                window.location.href= '/search_results'
                // console.log(search_results)
                // display_districts(search_results)
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }
}


$(document).ready(function(){
    $("#sb").autocomplete({
        source: ["test"]
    })

    // $("#target").submit(function(e) {
    //     // console.log("navbar search")
    //     // e.preventDefault()
    //     search()
    // })

    $("#sb").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            search()
        }
    });
})