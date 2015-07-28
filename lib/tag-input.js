'use strict';

var React = require('react/addons');
var pill = require('./pill');

function resetInput() {
  this.setState({
    userInput: ''
  });
  this._focusInput();
}

function calculateInputWidth() {
  var input = React.findDOMNode(this.refs.newTag);
  input.style.width = (React.findDOMNode(this.refs.newTagSize)
    .clientWidth + 8) + 'px';
}

function sanitized(tag) {
  return tag.trim().toLowerCase();
}

function addTag(tag) {
  var existingTags = this.state.tags;
  var sanitizedTag = sanitized(tag);
  var duplicateIndex = existingTags.indexOf(sanitizedTag);
  clearTimeout(this._highlightTimer);
  if (duplicateIndex !== -1) {
    this.setState({
      existingTagIndex: duplicateIndex
    });
    var self = this;
    this._highlightTimer = setTimeout(function () {
      self.setState({ existingTagIndex: -1 });
    }, 100);
    return false;
  }
  var newTags = this.state.tags.slice();
  newTags.push(sanitizedTag);
  this.setState({ tags: newTags  });
  this.onTagChange(newTags);
}

function removeTag(index) {
  var newTags = this.state.tags.slice();
  newTags.splice(index, 1);
  this.setState({ tags: newTags });
  this.onTagChange(newTags);
  this._focusInput();
}

function validateTag(tag) {
  if (typeof tag !== 'string') {
    return false;
  }
  var sanitizedTag = tag.trim();
  if (sanitizedTag.length < this.props.minTagLength) {
    return false;
  }
  return true;
}

module.exports = React.createClass({
  displayName: 'tag-input',
  propTypes: {
    cssClass: React.PropTypes.string,
    onTagsChange: React.PropTypes.func,
    onInputKeyUp: React.PropTypes.func,
    minTagLength: React.PropTypes.number
  },
  getDefaultProps: function () {
    return {
      minTagLength: 3
    };
  },
  getInitialState: function () {
    return {
      tags: [],
      userInput: '',
      existingTagIndex: -1
    };
  },
  render: function () {
    var cssClassNames = ['new-tag'];
    if (this.props.cssClass) {
      cssClassNames.push(this.props.cssClass);
    }
    var tagItems = this.state.tags.map(function (tag, i) {
      var highlightCssClass = this.state.existingTagIndex === i ?
          ' highlight' : '';
      return React.createElement(pill, {
        key: i,
        cssClass: highlightCssClass,
        tag: tag,
        onClick: this._onRemoveTag.bind(this, i)
      });
    }, this);
    return (
      React.DOM.div({
        className: 'tag-input',
        onClick: this._focusInput
      },
        tagItems,
        React.DOM.input({
          type: 'text',
          onChange: this._onInputChange,
          onKeyUp: this._onInputKeyUp,
          onKeyDown: this._onInputKeyDown,
          className: cssClassNames.join(' '),
          ref: 'newTag',
          value: this.state.userInput
        }),
        React.DOM.span({
          className: 'new-tag-size',
          ref: 'newTagSize'
        }, this.state.userInput))
    );
  },
  componentDidMount: function () {
    this._focusInput();
  },
  componentDidUpdate: function () {
    calculateInputWidth.bind(this)();
  },
  onTagChange: function (tags) {
    if (this.props.onTagChange) {
      this.props.onTagChange(tags);
    }
  },
  setInput: function (value) {
    this.setState({userInput: value});
    this._focusInput();
  },
  _highlightTimer: null,
  _focusInput: function () {
    React.findDOMNode(this.refs.newTag).focus();
  },
  _onRemoveTag: function (index) {
    removeTag.bind(this)(index);
  },
  _onInputChange: function (event) {
    var userInput = event.target.value;
    this.setState({userInput: userInput});
    var newTag;
    if (this.props.onInputChange) {
      this.props.onInputChange(userInput);
    }
    if (userInput.indexOf(',') > 0) {
      newTag = userInput.split(',')[0];
      if (validateTag.bind(this)(newTag)) {
        addTag.bind(this)(newTag);
        resetInput.bind(this)();
      }
    }
  },
  _onInputKeyDown: function (event) {
    if (event.keyCode === 8 && event.target.value === '') {
      // Backspace key
      if (this.state.tags.length) {
        removeTag.bind(this)(this.state.tags.length - 1);
      }
    }
  },
  _onInputKeyUp: function (event) {
    if (this.props.onInputKeyUp) {
      this.props.onInputKeyUp(event);
      return;
    }
    var userInput = event.target.value;
    this.setState({userInput: userInput});
    if (event.keyCode === 13) {
      // Enter key
      if (validateTag.bind(this)(userInput)) {
        addTag.bind(this)(userInput);
      }
      resetInput.bind(this)();
    }
  }
});
