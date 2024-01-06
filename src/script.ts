document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});

let textChange = document.getElementById("dbtn");
let tcChild = textChange?.children!;
for (let i = 0; i < tcChild.length; i++) {
    let btn = tcChild[i] as HTMLElement;
    btn.addEventListener("click", function () {
        let selection = window.getSelection();
        if (selection === null) return;
        let tg = btn.dataset.tagtype;
        if (tg === undefined) return;

        let editableParagraph = selection.anchorNode;
        if (editableParagraph === null) return;

        if (
            selection.rangeCount > 0 &&
            editableParagraph.contains(selection.anchorNode)
        ) {
            let range = selection.getRangeAt(0);
            let changeEl = document.createElement(tg);
            changeEl.appendChild(range.extractContents());
            range.insertNode(changeEl);
        }
    });
}
let lyover = document.getElementById("layover");
lyover?.addEventListener("click", function () {
    this.style.display = "none";
    if (textChange) {
        textChange.style.display = "none";
    }
});

let editor = document.getElementById("editor-fields")!;
editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const curEle = document.activeElement as HTMLElement | null;
        if (curEle === null) return;
        const parEle = curEle.parentNode as HTMLElement;
        let selection = window.getSelection();
        if (!selection) return;
        let cursorPosition = selection.focusOffset;
        console.log(curEle.textContent);
        let textBeforeCursor = curEle.textContent!.substring(0, cursorPosition);
        let textAfterCursor = curEle.textContent!.substring(cursorPosition);
        curEle.innerHTML = textBeforeCursor;
        addInput(parEle, textAfterCursor);
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
        return;
    }
});

function addInput(parent?: null | HTMLElement, value?: undefined | string) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.setAttribute("contenteditable", "true");
    p.addEventListener("mouseup", function () {
        let selection = window.getSelection();
        if (selection === null) return;
        let sText = selection.toString();

        if (sText.length > 1 && textChange && lyover) {
            let range = selection.getRangeAt(0);
            let clientRect = range.getBoundingClientRect();
            console.log("clientRect", clientRect);
            textChange.style.display = "flex";
            textChange.style.position = "absolute";
            textChange.style.top = `${clientRect.y}px`;
            textChange.style.left = `${
                (clientRect.left + clientRect.right) / 2
            }px`;
            lyover.style.display = "block";
        }
    });
    div.appendChild(p);

    if (parent != null) {
        if (!value) {
            parent.insertAdjacentElement("afterend", div);
        } else {
            p.innerText = value;
            parent.insertAdjacentElement("afterend", div);
        }
    } else {
        p.innerText =
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to s have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
        editor.appendChild(div);
    }
    p.focus();
}
