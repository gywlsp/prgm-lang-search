export default function Suggestion({ $app, initialState, onKeyDown, onClick }) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "Suggestion";
  this.$target.style.display = this.state.keyword ? "block" : "none";
  $app.appendChild(this.$target);

  this.onKeyDown = onKeyDown;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.renderMatchedItem = (keyword, item) => {
    const regex = new RegExp(keyword, "gi");
    const matchedText = item.match(regex)[0];
    return matchedText
      ? item.replace(
          regex,
          `<span class="Suggestion__item--matched">${matchedText}</span>`
        )
      : item;
  };

  this.render = () => {
    this.$target.style.display = this.state.keyword ? "block" : "none";
    const ul = `<ul>${this.state.languages
      .map((language, index) => {
        const li = `<li class="${
          index === this.state.languageIndex ? "Suggestion__item--selected" : ""
        }">${this.renderMatchedItem(this.state.keyword, language)}</li>`;
        return li;
      })
      .join("")}</ul>`;
    this.$target.innerHTML = ul;
  };

  window.addEventListener("keydown", onKeyDown);

  this.$target.addEventListener("click", onClick);
}
