document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/editor.html") {
        addInput();
    }
});

type MyNode = Node & {
    length: number;
};
const imgs = ["photo", "h3", "h4", "list", "code", "embed", "line"];
let isRotate = false;

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
    const div = createHTML<HTMLDivElement>(`<div class='section'></div>`);
    const p = document.createElement("p");
    const toggle = createHTML<HTMLSpanElement>(
        `<span class='toggle'><span>+</span></span>`
    );
    const plus = toggle.querySelector("span")!;
    p.setAttribute("contenteditable", "true");
    p.addEventListener("mouseup", () => mouseUp());
    p.addEventListener("keydown", (e) =>
        keyDown<HTMLParagraphElement, KeyboardEvent>(p, e)
    );

    // p.addEventListener("input", (e) => {
    //     if (p.innerText.length === 0) {
    //         plus.style.display = "flex";
    //     } else {
    //         plus.style.display = "none";
    //     }
    // });
    // p.addEventListener("focusin", () => {
    //     if (p.innerText.length === 0) {
    //         plus.style.display = "flex";
    //     } else {
    //         plus.style.display = "none";
    //     }
    // });
    // p.addEventListener("focusout", () => (plus.style.display = "none"));

    div.appendChild(toggle);
    div.appendChild(p);
    createHtmltype<HTMLDivElement>(div);

    plus.addEventListener("click", () => showRadioType(toggle, div));

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

function createHtmltype<T extends HTMLElement>(parent: T) {
    const div = createHTML<HTMLDivElement>(`<div class="radio"></div>`);
    for (let r of imgs) {
        let temp =
            createHTML(`<div><input type="radio" id=${r} name="html-type" value=${r} />
    <label for=${r} data-alt="add ${r}"></label></div>`);
        let lable = temp.querySelector("label")!;
        lable.style.backgroundImage = `url(./img/${r}.svg)`;
        div.appendChild(temp);
    }
    parent.appendChild(div);
}

function createHTML<T extends HTMLElement>(htmlString: string) {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild as T;
}

function showRadioType<T extends HTMLElement>(target: T, parent: T) {
    let span = target.querySelector("span");
    let radio = parent.querySelector(".radio") as HTMLElement;

    if (!span || !radio) return;
    if (isRotate) {
        span.style.transform = `rotate(0deg)`;
        radio.style.display = "none";
    } else {
        span.style.transform = `rotate(45deg)`;
        radio.style.display = "flex";
    }
    isRotate = !isRotate;
}

function mouseUp() {
    let selection = window.getSelection();
    if (selection === null) return;
    let sText = selection.toString();

    if (sText.length > 1 && textChange && lyover) {
        let range = selection.getRangeAt(0);
        let clientRect = range.getBoundingClientRect();
        textChange.style.display = "flex";
        textChange.style.position = "absolute";
        textChange.style.top = `${clientRect.y}px`;
        textChange.style.left = `${(clientRect.left + clientRect.right) / 2}px`;
        lyover.style.display = "block";
    }
}

function keyDown<H extends HTMLElement, E extends KeyboardEvent>(
    target: H,
    e: E
) {
    if (e.key === "Enter") {
        e.preventDefault();
        const parEle = target.parentNode as HTMLElement;
        let cursorPosition = getCaretCharacterOffsetWithin(target);

        let textBeforeCursor = target.textContent!.substring(0, cursorPosition);
        let textAfterCursor = target.textContent!.substring(cursorPosition);
        target.innerHTML = textBeforeCursor;
        addInput(parEle, textAfterCursor);
        return;
    }

    if (e.key === "Backspace") {
        const parEle = target.parentNode as HTMLElement;
        const prevEle = parEle.previousElementSibling as HTMLElement | null;
        if (prevEle === null) return;
        const prevp = prevEle.querySelector("p")!;

        if (
            editor.firstElementChild != parEle &&
            (target.innerText.length <= 0 ||
                (target.innerText.trim().length === 0 &&
                    target.innerText.length === 1))
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
}
