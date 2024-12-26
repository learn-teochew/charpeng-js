#!/usr/bin/env node
// Convert TSV formatted dictionary table to JSON format

const fs = require("fs");
const readline = require("readline");

// main ----------------------------------------------------------------------

// read in dictionary data
let chardict = {};
const dicttsv = fs.readFileSync("lim_1997_gdpi.dict.tsv", "utf-8");
dicttsv.split(/\r?\n/).forEach((line) => {
  try {
    let [han, pengim, annot] = line.split(/\t/);
    if (han in chardict) {
      chardict[han].push([pengim, annot]);
    } else {
      chardict[han] = [[pengim, annot]];
    }
  } catch (err) {
    console.error(err);
  }
});

fs.writeFile("lim_1997_gdpi.dict.json", JSON.stringify(chardict), (err) => {
  console.log(err);
});
