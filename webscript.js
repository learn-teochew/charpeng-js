import * as lim from "./lim_1997_gdpi.dict.js";
import * as cd from "./dieziu_gdpi.dict.js";

function processLine(line, chardict) {
  let out = [];
  for (const c of line) {
    if (c in chardict) {
      let readings = [];
      for (const r of chardict[c]) {
        // readings.push(r[0]);
        if (r[1] && r[1].includes("文")) {
          readings.push('<span style="color:blue;">' + r[0] + '</span>');
        } else if (r[1] && r[1].includes("訓")) {
          readings.push('<span style="color:green;">' + r[0] + '</span>');
        } else {
          readings.push(r[0]);
        }
      }
      out.push(
        "<ruby>" +
          '<a href="https://en.wiktionary.org/wiki/' +
          c +
          '">' +
          c +
          "</a>" +
          "<rt>" +
          readings.join("<br/>") +
          "</rt></ruby>",
      );
    } else if (c.match(/\p{Script=Hani}/u)) {
      out.push(
        '<span class="unmatched">' +
          '<a href="https://en.wiktionary.org/wiki/' +
          c +
          '">' +
          c +
          "</a>" +
          "</span>",
      );
    } else {
      out.push(c);
    }
  }
  return out.join("");
}

// first button element
let button = document.getElementById("annotatebutton");

button.addEventListener("click", function () {
  let input = document.getElementById("input").value;
  let chooseDict = document.querySelector(
    'input[name="choose_dict"]:checked',
  ).value;
  let out = [];
  for (const l of input.split(/\n/)) {
    if (chooseDict == "ghou_1983") {
      out.push(processLine(l, cd.chardict));
    } else if (chooseDict == "lim_1997") {
      out.push(processLine(l, lim.chardict));
    }
  }
  document.getElementById("outputdiv").innerHTML = out.join("<br/>");
});
