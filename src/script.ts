document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});

let form = document.getElementById("idform")!;
form.addEventListener("submit", (e) => {
    e.preventDefault();
});

let editor = document.getElementById("editor-fields")!;
editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const curEle = document.activeElement;
        if (curEle === null) return;
        const parEle = curEle.parentNode as HTMLElement;
        addInput(parEle);
        return;
    }

    if (e.key === "Backspace") {
        const curEle = document.activeElement as HTMLParagraphElement;
        if (curEle === null) return;
        const parEle = curEle.parentNode as HTMLElement;
        const prevEle = parEle.previousElementSibling as HTMLElement | null;
        if (prevEle === null) return;
        const prevp = prevEle.querySelector("p");
        if (prevp === null) return;
        if (
            editor.firstElementChild != parEle &&
            curEle.innerText.length <= 0
        ) {
            editor.removeChild(parEle);
            let range = document.createRange();
            range.selectNodeContents(prevp);
            range.collapse(false);

            let selection = window.getSelection();
            if (selection === null) return;
            selection.removeAllRanges();
            selection.addRange(range);
            e.preventDefault();
            prevp.focus();
        }
    }
});

function addInput(parent?: null | HTMLElement) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.setAttribute("contenteditable", "true");
    div.appendChild(p);
    p.addEventListener("mouseup", function () {
        
    });

    if (parent != null) {
        parent.insertAdjacentElement("afterend", div);
    } else editor.appendChild(div);
    p.focus();
}
