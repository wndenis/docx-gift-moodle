var $fileInput = $('.file-input');
var $droparea = $(".file-drop-area");


var $results = $("#results");
var $button = $("#button");
var $dragndrop = $("#dragndrop");
var $filename = $("#filename");
var $newfile = $("#new-file");
var filenameStr = "";

var $resultBg = $("#result-bg");

const separator = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

// highlight drag area
$fileInput.on('dragenter focus click', function() {
    $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
    $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
    let filesCount = $(this)[0].files.length;
    let $textContainer = $(this).prev();

    if (filesCount === 1) {
        // if single file is selected, show file name
        var fileName = $(this).val().split('\\').pop();
        if (fileName.endsWith(".docx") || fileName.endsWith(".doc")){
            $textContainer.text(fileName);
            filenameStr = fileName;
            $button.removeClass("hidden")
        }
        else{
            //todo: удалять неправильный файл
            //alert("Кажется, вам удалось прикрепить неверный файл. Ничего работать не будет. Обновите страницу.");
            $textContainer.text("Выберите файл .doc или .docx");
        }
    } else {
        // otherwise show number of files
        $textContainer.text("Выберите один документ");
    }
});



$button.click(function(e) {
    e.preventDefault();
    // validate file
    // alert("КОД КРАСНЫЙ");
    $dragndrop.addClass('hidden');
    $results.removeClass('hidden');
    $filename.removeClass('hidden');
    $button.addClass('hidden');
    $newfile.removeClass('hidden');
    $filename.text(filenameStr);
    SendFile();
});

$newfile.click(function(e) {
    e.preventDefault();
    location.reload();
    return false;
});


// ========================================================================

function SendFile() {
    // https://demo2398178.mockable.io
    var fd = new FormData(document.querySelector("form"));
    // fd.append("CustomField", "This is some extra data");
    $.ajax({
        // url: "https://6f412c5e-e568-4592-bcde-2f9f011ad67a.mock.pstmn.io",
        // url: "https://demo2398178.mockable.io/",
        url: window.location.href,
        type: "POST",
        data: fd,
        processData: false,  // tell jQuery not to process the data
        contentType: false,
        success: function (data, status, _) {
            if (typeof data === "string") {
                setTimeout(() => GetFile(data, filenameStr), 1700);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (textStatus === "BAD REQUEST" || xhr.responseText === "invalid file") {
                // TODO: сделать красивое сообщение
                alert("Отправленный вами файл не соответствует требованиям")
                setTimeout(() => TimeoutUpdate(), 500);
            } else {
                console.log(errorThrown);
                console.log(textStatus);
                alert("Ошибка. Скорее всего, это проблемы с соединением.");
            }
            //это для обновления страницы
            //location.reload(false);
            //return false;
            //============================
        },
        timeout: 15000
    });
}

function GetFile(filename, downloadName) {
    window.open (window.location.href + "getfile?name=" + filename + "&downloadName=" + downloadName);
    setTimeout(() => TimeoutUpdate(), 500);

}

function TimeoutUpdate(){
    if ($button.hasClass('hidden')){
        $newfile.click();
    }
}