import * as lim from "./lim_1997_gdpi.dict.js";
import * as cd from "./dieziu_gdpi.dict.js";
import * as wd from "./wiktionary.dict.js";

function processLine(line, chardict) {
  let out = [];
  for (const c of line) {
    if (c in chardict) {
      let readings = [];
      for (const r of chardict[c]) {
        // readings.push(r[0]);
        if (r[1] && r[1].includes("文")) {
          readings.push('<span style="color:blue;">' + r[0] + "</span>");
        } else if (r[1] && r[1].includes("訓")) {
          readings.push('<span style="color:green;">' + r[0] + "</span>");
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

function scan_input(text, n, dictionary) {
  let indices = [];
  let num_chunks = text.length - n + 1;
  for (let i = 0; i < num_chunks; i++) {
    let slice = text.slice(i, i + n);
    if (slice in dictionary) {
      let pron = dictionary[slice].map((x) => x[0]);
      indices.push([i, slice, pron]);
    }
  }
  return indices;
}

function scan_input_range(text, dictionary, n_min = 2, n_max = 5) {
  let all_output = [];

  for (let i = n_max; i >= n_min; i--) {
    all_output.push(...scan_input(text, i, dictionary));
  }
  all_output.sort((a, b) => a[0] - b[0]);
  return all_output;
}

function annotate_words(text, dictionary, n_max = 5) {
  let raw = scan_input_range(text, dictionary, 2, n_max);
  let odict = {};
  let out = [];
  for (var elem of raw) {
    // remove duplicates
    if (!(elem[1] in odict)) {
      odict[elem[1]] = true;
      out.push(
        '<li><a href="https://en.wiktionary.org/wiki/' +
          elem[1] +
          '">' +
          elem[1] +
          "</a> : " +
          elem[2].join(" / ") +
          "</li>\n",
      );
    }
  }
  return out;
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
    } else if (chooseDict == "wiktionary") {
      out.push(processLine(l, wd.chardict));
    }
  }
  document.getElementById("outputdiv").innerHTML = "<p>Individual character readings • 單字注音</p><p>" + out.join("<br/>") + "</p>";
  let out2 = annotate_words(input, wd.chardict, 5);
  document.getElementById("outputdiv2").innerHTML =
    "<p>Polysyllabic words • 複詞</p><ul>" + out2.join("") + "</ul>";
});
