let articleSelected = false;
let participants = $("#participants");
let selectedArticle = {}
let dummyParticipants = [];

///Perform get articles operation here
$.get("http://localhost:9000/api/v1/getArticles", function (data, status) {
    dummyParticipants = [...data];
    dummyParticipants.forEach(item => {
        participants.append("<div class=\"participant\" id=" + item.id + ">" + item.name + "<button style=\"float:right; cursor:pointer;\" onclick=\"deleteArticle(" + item.id + ")\">Delete</button></div>");
    });
});



if (!articleSelected) {
    articleSelected = true;
    $(".articleBoard").hide();
    $('#newArticle').hide();
}

function selectArticle(articalNumber) {
    $('#newArticle').hide();
    $('#previewArticle').show();
    dummyParticipants.forEach((el, index) => {
        if (el.id == articalNumber) {
            $(".ArticleTitle")[0].innerHTML = el.title;
            $('#ArticleBodyStatic')[0].innerHTML = el.html;
            $('#ArticleBodyEditable').val(el.html);
            selectedArticle.id = articalNumber;
            selectedArticle.title = el.title;
            selectedArticle.html = el.html;
            selectedArticle.name = el.name;
        }
    })
}

function createArticle() {
    $(".articleBoard").show();
    $('#previewArticle').hide();
    $('#newArticle').show();
    $('.hiddenActionsNew').show();
}

function createNewArticle() {
    selectedArticle.id = dummyParticipants[dummyParticipants.length - 1].id + 1;
    selectedArticle.name = $('#name').val();
    selectedArticle.title = $('#newTitle').val();
    selectedArticle.html = $('#newArticleBody').val();
    dummyParticipants.push(selectedArticle);
    participants.empty();
    participants.append("<div class=\"participantsHeader\">ARTICLES</div>");
    dummyParticipants.forEach(item => {
        participants.append("<div class=\"participant\" id=" + item.id + ">" + item.name + "<button style=\"float:right; cursor:pointer;\" onclick=\"deleteArticle(" + item.id + ")\">Delete</button></div>");
    });


    ///Perform create operation here
    $.ajax({
        type: "POST",
        url: "http://localhost:9000/api/v1/addArticle",
        data: selectedArticle,
        success: function (data) {
            console.log(data);
        }
    });


}

function cancelNewArticle() {
    $(".articleBoard").hide();
    $('#previewArticle').show();
    $('#newArticle').hide();
    $('.hiddenActionsNew').hide();
}

function deleteArticle(articalNumber) {
    let index = dummyParticipants.findIndex(el => el.id == articalNumber);
    if (index != -1) {
        dummyParticipants.splice(index, 1)
    }
    participants.empty();
    participants.append("<div class=\"participantsHeader\">ARTICLES</div>");
    dummyParticipants.forEach(item => {
        participants.append("<div class=\"participant\" id=" + item.id + ">" + item.name + "<button style=\"float:right; cursor:pointer;\" onclick=\"deleteArticle(" + item.id + ")\">Delete</button></div>");
    });
    $.ajax({
        type: "post",
        url: "http://localhost:9000/api/v1/deleteArticle",
        data: {
            "id": articalNumber
        },
        success: function (data) {
            console.log(data);
        }
    });
    location.reload();
}

function saveChanges() {
    $('#ArticleBodyEditable').hide();
    $('#ArticleBodyStatic').show();
    $('.hiddenActions').hide();
    var newText = $('#ArticleBodyEditable').val();
    $('#ArticleBodyStatic')[0].innerHTML = $('#ArticleBodyEditable').val();
    selectedArticle.html = newText;

    ///Perform update call here
    $.ajax({
        type: "post",
        url: "http://localhost:9000/api/v1/editArticle",
        data: selectedArticle,
        success: function (data) {
            console.log(data);
        }
    });
    location.reload();
}

function cancelChanges() {
    $('#ArticleBodyEditable').hide();
    $('#ArticleBodyStatic').show();
    $('.hiddenActions').hide();
    $('.ArticleBody')[0].innerHTML = selectedArticle.html;
}

$(document).ready(function () {
    $('.participant').on('click', function () {
        $('.participant').removeClass('selected');
        $(this).addClass('selected');
        if (articleSelected) {
            $(".articleBoard").show();
            selectArticle(this.id);
        }
    });
    $('.ArticleBody').on('click', function () {
        $('#ArticleBodyEditable').show();
        $('#ArticleBodyStatic').hide();
        $(".hiddenActions").css("display", "flex")
    });
});