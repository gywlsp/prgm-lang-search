import SearchInput from "./SearchInput.js";
import Suggestion from "./Suggestion.js";
import SelectedLanguage from "./SelectedLanguage.js";

import { fetchLanguages } from "../api.js";

export default function App({ $app }) {
  this.$target = document.createElement("form");
  this.$target.className = "SearchInput";
  this.timer = null;

  this.state = {
    keyword: "",
    languages: [],
    languageIndex: 0,
    selectedLanguages: [],
  };

  const selectLanguage = (language) => {
    const nextSelectedLanguages = this.state.selectedLanguages
      .filter((l) => l !== language)
      .concat(language);
    if (nextSelectedLanguages.length > 5) nextSelectedLanguages.splice(0, 1);
    this.setState({
      ...this.state,
      selectedLanguages: nextSelectedLanguages,
    });
  };

  const selectedLanguage = new SelectedLanguage({
    $app,
    initialState: {
      selectedLanguages: this.state.selectedLanguages,
    },
  });

  const searchInput = new SearchInput({
    $app,
    initialValue: this.state.keyword,
    onInput: (e) => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const keyword = e.target.value;
      if (!keyword) {
        this.setState({ ...this.state, keyword, languages: [] });
        return;
      }
      this.timer = setTimeout(async () => {
        const languages = await fetchLanguages(keyword);
        this.setState({ ...this.state, keyword, languages });
      }, 300);
    },
  });

  const suggestion = new Suggestion({
    $app,
    initialState: {
      keyword: this.state.keyword,
      languages: this.state.languages,
      languageIndex: this.state.languageIndex,
    },
    onKeyDown: (e) => {
      if (!this.state.languages.length) return;
      if (e.key === "Enter") {
        const language = this.state.languages[this.state.languageIndex];
        alert(language);
        selectLanguage(language);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const nextIndex =
          (this.state.languageIndex + (e.key === "ArrowDown" ? +1 : -1)) %
          this.state.languages.length;
        this.setState({
          ...this.state,
          languageIndex:
            nextIndex >= 0
              ? nextIndex
              : nextIndex + this.state.languages.length,
        });
      }
    },
    onClick: (e) => {
      const $li = e.target.closest("li");
      if (!$li) return;
      const language = $li.innerText;
      alert(language);
      selectLanguage(language);
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;
    selectedLanguage.setState({
      selectedLanguages: this.state.selectedLanguages,
    });
    searchInput.setState({
      keyword: this.state.keyword,
    });
    suggestion.setState({
      keyword: this.state.keyword,
      languages: this.state.languages,
      languageIndex: this.state.languageIndex,
    });
    this.saveState();
  };

  this.saveState = () => {
    localStorage.setItem("keyword", this.state.keyword);
    localStorage.setItem("languages", JSON.stringify(this.state.languages));
    localStorage.setItem("languageIndex", this.state.languageIndex.toString());
    localStorage.setItem(
      "selectedLanguages",
      JSON.stringify(this.state.selectedLanguages)
    );
  };

  this.getSavedState = () => {
    const keyword = localStorage.getItem("keyword");
    const languages = localStorage.getItem("languages");
    const languageIndex = localStorage.getItem("languageIndex");
    const selectedLanguages = localStorage.getItem("selectedLanguages");
    return { keyword, languages, languageIndex, selectedLanguages };
  };

  this.init = () => {
    const { keyword, languages, languageIndex, selectedLanguages } =
      this.getSavedState();
    this.setState({
      keyword: keyword || "",
      languages: JSON.parse(languages) || [],
      languageIndex: +languageIndex || 0,
      selectedLanguages: JSON.parse(selectedLanguages) || [],
    });
  };

  this.init();
}
