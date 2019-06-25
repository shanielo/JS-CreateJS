const fs = require('fs');
const path = require('path');
const { assert } = require('chai');
const cheerio = require('cheerio');
const acorn = require("acorn");
const ASTQ  = require("astq");
const _ = require('lodash');
require('deepdash')(_);


const source = fs.readFileSync(path.join(process.cwd(), 'app.js'), 'utf8');
let ast = acorn.parse(source, { ecmaVersion: 6 })
let astq = new ASTQ()
astq.adapter("mozast")

const source_html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const $ = cheerio.load(source_html);

const flatten = (objectOrArray, sep = '.', prefix = '', formatter = (k) => (k)) => {
  const nestedFormatter = (k) => (sep + k);
  const nestElement = (prev, value, key) => (
    (value && typeof value === 'object')
      ? { ...prev, ...flatten(value, sep, `${prefix}${formatter(key)}`, nestedFormatter) }
      : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } });

  return Array.isArray(objectOrArray)
    ? objectOrArray.reduce(nestElement, {})
    : Object.keys(objectOrArray).reduce(
      (prev, element) => nestElement(prev, objectOrArray[element], element),
      {},
    );
};

Object.assign(global, {
  assert,
  astq,
  ast,
  flatten,
  $,
  _
});