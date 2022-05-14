export default function SearchInput({ $app, initialValue, onInput }) {
  this.$target = document.createElement("form");
  this.$target.className = "SearchInput";
  this.$target.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  this.$input = document.createElement("input");
  this.$input.className = "SearchInput__input";
  this.$input.type = "text";
  this.$input.placeholder = "프로그램 언어를 입력하세요.";
  this.$input.value = initialValue;
  this.$input.oninput = onInput;
  this.$input.autofocus = true;

  this.$target.appendChild(this.$input);
  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$input.value = this.state.keyword;
  };
}
