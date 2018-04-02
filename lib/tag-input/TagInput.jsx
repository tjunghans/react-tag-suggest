import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Pill } from "./Pill.jsx";

function addTag(tag) {
  var existingTags = this.props.tags;
  var sanitizedTag = tag.trim();
  var duplicateIndex = existingTags.indexOf(sanitizedTag);
  clearTimeout(this._highlightTimer);
  if (duplicateIndex !== -1) {
    this.setState({
      existingTagIndex: duplicateIndex
    });
    var self = this;
    this._highlightTimer = window.setTimeout(function() {
      self.setState({ existingTagIndex: -1 });
    }, 100);
    return false;
  }
  var newTags = existingTags.slice();
  newTags.push(sanitizedTag);
  this._onTagChange(newTags);
}

function validate(cmp, tag) {
  if (typeof tag !== "string") {
    return false;
  }
  var sanitizedTag = tag.trim();
  if (sanitizedTag.length < cmp.props.minTagLength) {
    return false;
  }
  return true;
}

export class TagInput extends Component {
  constructor(props) {
    super(props);
    this._highlightTimer = null;
    this.state = {
      existingTagIndex: -1
    };
    this.tagInput = null;
    this.newTagSize = null;
  }

  render() {
    const { cssClass, userInput = "", tags = [] } = this.props;
    var cssClassNames = ["new-tag"];
    if (cssClass) {
      cssClassNames.push(cssClass);
    }

    var parsedTags = [];
    if (userInput !== "") {
      parsedTags = this._extractTags(userInput).filter(
        tag => tags.indexOf(tag) === -1
      );
    }

    if (parsedTags.length) {
      this.tags = this.props.tags.concat(parsedTags);
      this._onTagChange(this.tags);
      this._onInputChange("");
    } else {
      this.tags = this.props.tags;
    }

    return (
      <div
        className="tag-input"
        onClick={() => {
          this._focusInput();
        }}
      >
        {this.tags.map((tag, i) => {
          const highlightCssClass =
            this.state.existingTagIndex === i ? " highlight" : "";
          return (
            <Pill
              key={`pill${i}`}
              cssClass={highlightCssClass}
              tag={tag}
              onClick={this._removeTag.bind(this, i)}
            />
          );
        })}
        <input
          type="text"
          onChange={evt => {
            this._onChange(evt);
          }}
          onKeyUp={evt => {
            this._onInputKeyUp(evt);
          }}
          onKeyDown={evt => {
            this._onInputKeyDown(evt);
          }}
          className={cssClassNames.join(" ")}
          ref={input => {
            this.tagInput = input;
          }}
          value={userInput}
        />
        <span
          className="new-tag-size"
          ref={newTagSizeSpan => {
            this.newTagSize = newTagSizeSpan;
          }}
        >
          {userInput}
        </span>
      </div>
    );
  }

  componentDidMount() {
    this._focusInput();
  }

  componentDidUpdate() {
    this.tagInput.style.width = this.newTagSize.clientWidth + 8 + "px";
  }

  _onTagChange(tags) {
    if (this.props.onTagChange) {
      this.props.onTagChange(tags);
    }
  }

  _addTags(tags) {
    var newTags = this.props.tags.slice();
    var self = this;
    tags.forEach(function(tag) {
      if (newTags.indexOf(tag) === -1) {
        newTags.push(tag);
        self._onTagChange(newTags);
      }
    });
    this._resetInput();
  }

  _focusInput() {
    if (this.tagInput) {
      this.tagInput.focus();
    }
  }

  _resetInput() {
    this._onInputChange("");
    this._focusInput();
  }

  _onInputChange(userInput) {
    if (this.props.onInputChange) {
      this.props.onInputChange(userInput);
    }
  }

  _removeTag(index) {
    var newTags = this.tags.slice();
    newTags.splice(index, 1);
    this._onTagChange(newTags);
    this._focusInput();
  }

  _extractTags(userInput) {
    if (userInput.indexOf(",") === -1) {
      return [];
    }

    var tags = {};
    return userInput
      .trim()
      .split(",")
      .filter(function(tag) {
        tag = tag.trim();
        if (tags[tag]) {
          return false;
        }
        tags[tag] = true;
        return tag.length >= this.props.minTagLength;
      }, this)
      .map(function(tag) {
        return tag.trim();
      });
  }

  _onChange(event) {
    var userInput = event.target.value;
    this._onInputChange(userInput);
    var tags = this._extractTags(userInput);
    if (tags.length === 0) {
      return;
    }

    if (tags.length > 1) {
      this._addTags(tags);
    } else {
      var tag = tags[0];
      if (validate(this, tag)) {
        addTag.bind(this)(tag);
        this._resetInput();
      }
    }
  }

  _onInputKeyDown(event) {
    if (event.keyCode === 8 && event.target.value === "") {
      // Backspace key
      if (this.tags.length) {
        this._removeTag(this.tags.length - 1);
      }
    }
  }

  _onInputKeyUp(event) {
    if (event.keyCode === 13) {
      // Enter key
      var userInput = this.props.userInput;
      if (validate(this, userInput)) {
        addTag.bind(this)(userInput);
      }
      this._resetInput();
    }
  }
}

TagInput.propTypes = {
  tags: PropTypes.array,
  cssClass: PropTypes.string,
  userInput: PropTypes.string,
  minTagLength: PropTypes.number,
  tag: PropTypes.string,
  onClick: PropTypes.function,
  onInputChange: PropTypes.function,
  onTagChange: PropTypes.function
};
