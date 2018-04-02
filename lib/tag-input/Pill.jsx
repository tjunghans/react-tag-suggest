import React, { Component } from "react";
import { PropTypes } from "prop-types";

export class Pill extends Component {
  render() {
    const { cssClass, tag, onClick } = this.props;
    return (
      <span className={`pill ${cssClass}`}>
        <span className="tag">{tag}</span>
        <a className="remove" onClick={onClick}>
          {String.fromCharCode(215)}
        </a>
      </span>
    );
  }
}

Pill.propTypes = {
  cssClass: PropTypes.string,
  tag: PropTypes.string,
  onClick: PropTypes.function
};
