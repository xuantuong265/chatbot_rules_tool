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
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");
    let masv = $("#masv");

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        return true;
    } else {
        email.removeClass("is-invalid");
    }

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
            email: $("#email").val(),
            masv: $("#masv").val()
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                console.log("dduf mas ay");
                // webview closed
            }, function error(err) {});

            $(".handler-error").css("display", "block");
            $(".content-webview").css("display", "none");

            //send data to node.js server 
            $.ajax({
                url: `${window.location.origin}/score-table`,
                method: "POST",
                data: data,
                success: function(data) {
                    location.requestCloseBrowser()
                },
                error: function(error) {
                    console.log(error);
                }
            })
        }
    });
}