import React, { Component, createElement } from "react";
import { PropTypes } from "prop-types";

export class List extends Component {
  render() {
    const { items = [], onItemClick, cssClass } = this.props;

    return (
      <ul className={cssClass}>
        {items.map((item, i) => {
          return (
            <li
              key={`item${i}`}
              onClick={event => {
                onItemClick(event, item, i);
              }}
              className={item.cssClass}
            >
              {this._makeItem(item)}
            </li>
          );
        })}
      </ul>
    );
  }

  _filterItem(item) {
    if (this.props.formatItem) {
      return this.props.formatItem(item);
    }
    if (item.value) {
      return item.value;
    }
    if (typeof item.value === "string") {
      return { item: item };
    }
    return item;
  }

  _makeItem(item) {
    item = this._filterItem(item);
    if (this.props.itemComponent) {
      return createElement(this.props.itemComponent, item);
    }
    return item;
  }
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.function,
  formatItem: PropTypes.function,
  cssClass: PropTypes.string,
  itemComponent: PropTypes.function
};
