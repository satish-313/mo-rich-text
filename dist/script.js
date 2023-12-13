"use strict";
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});
let form = document.getElementById("idform");
form.addEventListener("submit", (e) => {
    e.preventDefault();
});
let editor = document.getElementById("editor-fields");
editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const curEle = document.activeElement;
        if (curEle === null)
            return;
        const parEle = curEle.parentNode;
        addInput(parEle);
        return;
    }
    if (e.key === "Backspace") {
        const curEle = document.activeElement;
        if (curEle === null)
            return;
        const parEle = curEle.parentNode;
        const prevEle = parEle.previousElementSibling;
        if (prevEle === null)
            return;
        const prevTa = prevEle.querySelector("textarea");
        if (prevTa === null)
            return;
        if (curEle.value.length <= 0 && editor.firstElementChild != parEle) {
            editor.removeChild(parEle);
            e.preventDefault();
            prevTa.focus();
        }
    }
});
function addInput(parent) {
    const div = document.createElement("div");
    const ta = document.createElement("textarea");
    div.appendChild(ta);
    ta.rows = 1;
    ta.addEventListener("input", function () {
        this.style.height = this.scrollHeight + "px";
    });
    if (parent != null) {
        parent.insertAdjacentElement("afterend", div);
    }
    else
        editor.appendChild(div);
    ta.focus();
}
