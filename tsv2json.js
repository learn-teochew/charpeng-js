#!/usr/bin/env node
// Convert TSV formatted dictionary table to JSON format

const fs = require("fs");
const readline = require("readline");

// main ----------------------------------------------------------------------

// read in dictionary data
let chardict = {};
const dicttsv = fs.readFileSync("dieziu_gdpi.dict.tsv", "utf-8");
dicttsv.split(/\r?\n/).forEach((line) => {
  try {
    let [han, pengim] = line.split(/\t/);
    if (han in chardict) {
      chardict[han].push(pengim);
    } else {
      chardict[han] = [pengim];
    }
  } catch (err) {
    console.error(err);
  }
});

fs.writeFile("dieziu_gdpi.dict.json", JSON.stringify(chardict), (err) => {
  console.log(err);
});
