"use strict";
let inputCount = 1;
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        const cinput = document.createElement("input");
        let count = inputCount++;
        cinput.setAttribute("type", "text");
        cinput.setAttribute("placeholder", "title");
        cinput.setAttribute("data-input-idx", count.toString());
        editor.appendChild(cinput);
        cinput.focus();
    }
});
let form = document.getElementById("idform");
form.addEventListener("submit", (e) => {
    e.preventDefault();
});
let editor = document.getElementById("editor-fields");
editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const nextEl = `<input type="text" placeholder="write" data-input-idx=${inputCount++} />`;
        const cur = document.activeElement;
        cur.insertAdjacentHTML("afterend", nextEl);
        const next = cur.nextElementSibling;
        if (next)
            next.focus();
        return;
    }
    if (e.key === "Backspace") {
        const curEle = document.activeElement;
        if (curEle === null)
            return;
        if (curEle.tagName.toLowerCase() === "input") {
            const cur = curEle;
            const parNode = cur.parentNode;
            const prevNode = cur.previousSibling;
            if (cur.value.length <= 0 && parNode.children.length > 1) {
                parNode.removeChild(cur);
                prevNode.focus();
            }
        }
    }
});
const s = document.getElementById("smc");
s.addEventListener("change", (e) => {
    console.log(e.target);
});
