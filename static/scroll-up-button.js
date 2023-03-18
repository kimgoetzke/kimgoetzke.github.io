let button = document.getElementById("scroll-up-button");

window.onscroll = function () { showHideButton() };

function showHideButton() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function scrollUp() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
