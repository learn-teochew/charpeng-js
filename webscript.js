import * as cd from "./dieziu_gdpi.dict.js";

function processLine(line) {
  let out = [];
  for (const c of line) {
    if ( c in cd.chardict ) {
      out.push("<ruby>" + '<a href="https://en.wiktionary.org/wiki/' + c + '">' + c + '</a>' + "<rt>" + cd.chardict[c].join("<br/>") + "</rt></ruby>");
    } else if (c.match(/\p{Script=Hani}/u)) {
      out.push('<span class="unmatched">' + '<a href="https://en.wiktionary.org/wiki/' + c + '">' + c + '</a>' + '</span>');
    } else {
      out.push( c );
    }
  }
  return out.join("");
}

// first button element
let button = document.getElementById("annotatebutton");

button.addEventListener("click", function () {
  let input = document.getElementById("input").value;
  let out = [];
  for (const l of input.split(/\n/)) {
    out.push(processLine(l));
  }
  document.getElementById("outputdiv").innerHTML = out.join("<br/>");
});
