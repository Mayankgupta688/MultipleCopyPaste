$(function() {
    $("input").keyup(function() {
        $("b").text("Hi: " + $("input").val());
    })
});