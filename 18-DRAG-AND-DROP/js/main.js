/* eslint-env browser */
// ========================
// Polyfills
// ========================
/**
 * Element.before
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/before
 */
(function (arr) {
  arr.forEach(function (item) {
    /* eslint-disable */
    if (item.hasOwnProperty("before")) return;
    /* eslint-enable */

    Object.defineProperty(item, "before", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function before() {
        var argArr = Array.prototype.slice.call(arguments);
        var docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(
            isNode ? argItem : document.createTextNode(String(argItem))
          );
        });

        this.parentNode.insertBefore(docFrag, this);
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/**
 * Element.after polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/after
 */
(function (arr) {
  arr.forEach(function (item) {
    /* eslint-disable */
    if (item.hasOwnProperty("after")) return;
    /* eslint-enable */

    Object.defineProperty(item, "after", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        var argArr = Array.prototype.slice.call(arguments);
        var docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(
            isNode ? argItem : document.createTextNode(String(argItem))
          );
        });

        this.parentNode.insertBefore(docFrag, this.nextSibling);
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// ========================
// Variables
// ========================
const draggables = document.querySelectorAll("[data-draggable]");

// ========================
// Execution
// ========================
draggables.forEach((draggable) => {
  draggable.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    const target = event.target;
    const box = target.getBoundingClientRect();
    let prevScreenX = event.screenX;
    let prevScreenY = event.screenY;

    const preview = target.cloneNode();
    preview.classList.add("preview");
    target.before(preview);
    target.remove();

    document.body.append(target);
    target.style.position = "absolute";
    target.style.transform = "rotate(-5deg)";
    target.style.left = `${box.left}px`;
    target.style.top = `${box.top}px`;
    target.style.width = `${box.width}px`;
    target.style.height = `${box.height}px`;

    target.setPointerCapture(event.pointerId);
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);

    function move(event) {
      // Get movementX and movementY to calculate amount the mouse moves
      // Need this because Safari doesn't support movementX and movementY
      const movementX = event.screenX - prevScreenX;
      const movementY = event.screenY - prevScreenY;
      prevScreenX = event.screenX;
      prevScreenY = event.screenY;

      // Change position of target element
      const left = parseFloat(target.style.left);
      const top = parseFloat(target.style.top);
      target.style.left = `${left + movementX}px`;
      target.style.top = `${top + movementY}px`;

      const hitTest = document.elementFromPoint(left, top);
      const dropzone = hitTest.closest("[data-dropzone]");
      if (!dropzone) return;

      const previewExists = [...dropzone.children].find((element) => {
        return element === preview;
      });

      if (!previewExists) {
        dropzone.append(preview);
      }

      const positions = [...dropzone.children].map((element) => {
        return element.getBoundingClientRect();
      });

      const position = positions.findIndex((pos) => {
        return (
          pos.left < left &&
          left < pos.right &&
          pos.top < top &&
          top < pos.bottom
        );
      });

      const previewPos = [...dropzone.children].findIndex((element) => {
        return element === preview;
      });

      if (position === -1) return;

      const elem = dropzone.children[position];
      if (position > previewPos) {
        elem.after(preview);
      } else {
        elem.before(preview);
      }
    }

    function up(event) {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.releasePointerCapture(event.pointerId);

      target.style.position = "static";
      target.style.transform = "";
      target.style.pointerEvents = "auto";

      preview.before(target);
      preview.remove();
    }
  });
});
