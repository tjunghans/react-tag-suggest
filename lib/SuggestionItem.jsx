import React, { Component } from "react";
import { PropTypes } from "prop-types";

export class SuggestionItem extends Component {
  render() {
    const { label, highlighted } = this.props;

    return (
      <div className={highlighted ? "highlighted" : ""}>
        <a className="suggestion">{label}</a>
        <a className="set-input">{String.fromCharCode(8598)}</a>
      </div>
    );
  }
}

SuggestionItem.propTypes = {
  label: PropTypes.string.isRequired,
  highlighted: PropTypes.string
};
