document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});

type MyNode = Node & {
    length: number;
};

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
    document.getSelection()?.removeAllRanges();
    if (textChange) {
        document.getSelection()?.removeAllRanges();
        textChange.style.display = "none";
    }
});

let editor = document.getElementById("editor-fields")!;

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
            textChange.style.display = "flex";
            textChange.style.position = "absolute";
            textChange.style.top = `${clientRect.y}px`;
            textChange.style.left = `${
                (clientRect.left + clientRect.right) / 2
            }px`;
            lyover.style.display = "block";
        }
    });

    p.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const parEle = this.parentNode as HTMLElement;
            let cursorPosition = getCaretCharacterOffsetWithin(this);

            let textBeforeCursor = this.textContent!.substring(
                0,
                cursorPosition
            );
            let textAfterCursor = this.textContent!.substring(cursorPosition);
            this.innerHTML = textBeforeCursor;
            addInput(parEle, textAfterCursor);
            return;
        }

        if (e.key === "Backspace") {
            const parEle = this.parentNode as HTMLElement;
            const prevEle = parEle.previousElementSibling as HTMLElement | null;
            if (prevEle === null) return;
            const prevp = prevEle.querySelector("p")!;

            if (
                editor.firstElementChild != parEle &&
                (this.innerText.length <= 0 ||
                    (this.innerText.trim().length === 0 &&
                        this.innerText.length === 1))
            ) {
                e.preventDefault();
                if (prevp.innerText.length !== 0) {
                    let textNodes = document
                        .createTreeWalker(prevp, NodeFilter.SHOW_TEXT, null)
                        .nextNode() as MyNode;

                    let range = document.createRange();
                    range.setStart(textNodes, textNodes.length);
                    range.collapse(true);
                    let sele = document.getSelection();
                    sele?.removeAllRanges();
                    sele?.addRange(range);
                }
                editor.removeChild(parEle);
                prevp.focus();
            }
            return;
        }
    });

    let toggle = document.createElement("span");
    toggle.setAttribute("class", "toogle");
    toggle.innerText = "+";
    div.appendChild(toggle);
    div.appendChild(p);

    if (parent != null) {
        if (!value) {
            parent.insertAdjacentElement("afterend", div);
        } else {
            p.innerHTML = value;
            parent.insertAdjacentElement("afterend", div);
        }
    } else {
        editor.appendChild(div);
    }
    p.focus();
}
function getCaretCharacterOffsetWithin(element: Node) {
    let caretOffset = 0;
    let sel;
    let range;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel === null) return 0;
        if (sel.rangeCount > 0) {
            range = sel.getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    }

    return caretOffset;
}
