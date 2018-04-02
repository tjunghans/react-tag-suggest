import React from "react";
import { render } from "react-dom";
import { TagSuggest } from "../lib/TagSuggest.jsx";

// DEV START
var items = ['Java', 'Java Flash', 'JavaScript', 'Html', 'Java Script',
  'css', 'photoshop', 'project management', 'sales', 'photography',
  'football', 'dj', 'video editing', 'mac os x', 'Adobe Photoshop', 'Testing',
  'Flash', 'Sales Support', 'Hardware Support', 'Strategic planning'];

function findSuggestions(query, callback) {
  // Some async action will happen here
  var res;
  if (!query || query.length < 2) {
    callback(null, []);
    return;
  }

  res = items.filter(item => {
    return item.toLowerCase().indexOf(query.toLowerCase().trim()) > -1;
  });

  callback(null, res);
}
// DEV END

const elem = <TagSuggest 
  suggester={findSuggestions}
  onClick={() => console.log("click")}
  onInputChange={() => console.log("inputChange")}
  onTagChange={() => console.log("tag change")}
  />;
  
render(elem, 
  document.querySelector('#content'));

