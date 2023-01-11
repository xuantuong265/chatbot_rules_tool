(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

window.extAsyncInit = function() {
    // the Messenger Extensions JS SDK is done loading s

    MessengerExtensions.getContext('1825120007841958',
        function success(thread_context) {
            $("#psid").val(thread_context.psid);
            handleClickButtonScoreTable();
        },
        function error(err) {
            // error
            console.log('Lỗi bot', err);

            $("#psid").val(senderID);
            handleClickButtonScoreTable();
        }
    );
};

//validate inputs
function validateInputFields() {

    let masv = $("#masv");

    if (masv.val() === "") {
        masv.addClass("is-invalid");
        return true;
    } else {
        masv.removeClass("is-invalid");
    }

    return false;
}


function handleClickButtonScoreTable() {
    $("#btnScoreTable").on("click", function(e) {
        let check = validateInputFields(); //return true or false

        let data = {
            psid: $("#psid").val(),
            masv: $("#masv").val()
        };

        if (!check) {
            //close webview

            if (!check) {
                //close webview

                MessengerExtensions.requestCloseBrowser(function success() {

                    // webview closed
                }, function error(err) {
                    // an error occurred
                    console.log(err);

                });
                $.ajax({
                    url: `${window.location.origin}/debt-courses`,
                    method: "POST",
                    data: data,
                    success: function(data) {

                    },
                    error: function(error) {
                        console.log(error);
                    }
                })

                $(".handler-error").css("display", "block");
                $(".content-webview").css("display", "none");
            }


            //send data to node.js server 

        }
    });
}