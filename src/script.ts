document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});

type MyNode = Node & {
    length : number;
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
    if (textChange) {
        window.getSelection()?.removeAllRanges();
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
            let selection = document.getSelection();
            if (!selection) return;
            let cursorPosition = selection.focusOffset;
            console.log("cursorPosition", cursorPosition);
            let textBeforeCursor = this.textContent!.substring(
                0,
                cursorPosition
            );
            let textAfterCursor = this.textContent!.substring(cursorPosition);
            this.innerText = textBeforeCursor;
            addInput(parEle, textAfterCursor);
            return;
        }

        if (e.key === "Backspace") {
            const parEle = this.parentNode as HTMLElement;
            const prevEle = parEle.previousElementSibling as HTMLElement | null;
            if (prevEle === null) return;
            const prevp = prevEle.querySelector("p")!;
            let textNodes = getTextNodes(prevp);

            if (prevp === null) return;
            if (
                editor.firstElementChild != parEle &&
                this.innerText.length <= 0
            ) {
                e.preventDefault();
                var lastTextNode = textNodes[textNodes.length - 1] as MyNode;
                editor.removeChild(parEle);
                let range = document.createRange();
                range.setStart(lastTextNode, lastTextNode.length);
                range.collapse(true);
                console.log(range);
                let sele = document.getSelection();
                sele?.removeAllRanges();
                sele?.addRange(range);
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
            p.innerText = value;
            parent.insertAdjacentElement("afterend", div);
        }
    } else {
        p.innerText =
            "It is a long established fact t of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to s ";
        editor.appendChild(div);
    }
    p.focus();
}

function getTextNodes(node: HTMLParagraphElement) {
    var textNodes = [];
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    return textNodes;
}
