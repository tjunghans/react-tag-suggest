import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { SuggestionItem } from "./SuggestionItem.jsx";
import { TagInput } from "./tag-input/TagInput.jsx";
import { List } from "./List.jsx";
const bean = require("bean");

export class TagSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      highlighted: -1,
      userInput: "",
      tags: []
    };
    this.tagSuggestion = null;
  }

  render() {
    const { className = "", suggester } = this.props;
    const { userInput, tags, suggestions } = this.state;

    return (
      <div
        className={`tag-suggest ${className}`}
        ref={elem => {
          this.tagSuggestion = elem;
        }}
      >
        <TagInput
          userInput={userInput}
          tags={tags}
          onInputChange={input => {
            this.setState({
              userInput: input,
              highlighted: -1
            });
            if (suggester) {
              suggester(input, (err, items) => {
                this.setState({
                  suggestions: items.map(item => {
                    return { label: item, highlighted: false };
                  })
                });
              });
            }
          }}
          onTagChange={tags => {
            this.setState({
              tags: tags
            });
          }}
        />
        {suggestions.length > 0 && (
          <List
            items={suggestions}
            itemComponent={SuggestionItem}
            onItemClick={(event, item) => {
              if (event.target.classList.contains("set-input")) {
                var userInput = item.label;
                this.setState({
                  userInput: userInput,
                  highlighted: -1,
                  suggestions: []
                });
              } else if (event.target.classList.contains("suggestion")) {
                if (this.state.tags.indexOf(item.label) === -1) {
                  var newTags = this.state.tags.slice();
                  newTags.push(item.label);
                  this.setState({
                    tags: newTags,
                    userInput: "",
                    highlighted: -1,
                    suggestions: []
                  });
                }
              }
            }}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    bean.on(document, "keyup", () => {
      this._onDocumentKeyUp();
    });
  }

  componentWillUnmount() {
    bean.off(document, "keyup", () => {
      this._onDocumentKeyUp();
    });
  }

  componentDidUpdate() {
    var c = this.tagSuggestion;
    var input = c.querySelector(".new-tag");
    var suggestions = c.querySelector("ul");
    if (suggestions) {
      var left;
      if (c.offsetWidth < suggestions.offsetWidth + input.offsetLeft) {
        left = c.offsetWidth - suggestions.offsetWidth;
      } else {
        left = input.offsetLeft;
      }
      suggestions.style.left = left + "px";
    }
  }

  selectHighlighted(state, highlighted) {
    var suggestions = state.suggestions.slice();
    if (state.highlighted !== -1) {
      suggestions[state.highlighted].cssClass = "";
    }
    suggestions[highlighted].cssClass = "highlight";
    return {
      highlighted: highlighted,
      suggestions: suggestions,
      userInput: suggestions[highlighted].label
    };
  }

  _onDocumentKeyUp(event) {
    if (this.state.suggestions.length === 0) {
      return;
    }

    if (event.keyCode === 40) {
      // down arrow
      // next
      this.setState(prev => {
        var highlighted =
          prev.highlighted === prev.suggestions.length - 1
            ? 0
            : prev.highlighted + 1;

        return this.selectHighlighted(prev, highlighted);
      });
    } else if (event.keyCode === 38) {
      // down arrow
      // prev
      this.setState(prev => {
        var highlighted =
          prev.highlighted === -1 || prev.highlighted === 0
            ? prev.suggestions.length - 1
            : prev.highlighted - 1;

        return this.selectHighlighted(prev, highlighted);
      });
    } else if (event.keyCode === 13) {
      // enter
      // select
      this.setState({
        suggestions: []
      });
    }
  }
}

TagSuggest.propTypes = {
  className: PropTypes.string,
  userInput: PropTypes.string,
  minTagLength: PropTypes.number,
  onClick: PropTypes.function,
  suggester: PropTypes.function
};
