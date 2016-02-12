"use strict";

var path = require("path");
var cjson = require("cjson");
var htmllint = require("htmllint");
var _ = require("lodash");
var vile = require("@forthright/vile");

var IS_HTML = /\.html?$/;
var DEFAULT_HTMLLINT_CONFIG = ".htmllintrc";

var allowed = function allowed(ignore) {
  return function (file, is_dir) {
    return (is_dir || IS_HTML.test(file)) && !vile.ignored(file, ignore);
  };
};

var load_config = function load_config(filename) {
  return cjson.load(path.join(process.cwd(), filename));
};

var config = function config(custom_config) {
  return typeof custom_config == "string" ? load_config(custom_config) : !custom_config ? load_config(DEFAULT_HTMLLINT_CONFIG) : custom_config;
};

var into_issues = function into_issues(hl_config) {
  return function (filepath, data) {
    return htmllint(data, hl_config).then(function (issues) {
      return issues.map(function (issue) {
        return vile.issue({
          type: vile.STYL,
          path: filepath,
          title: issue.code + " (" + issue.rule + ")",
          message: htmllint.messages.renderIssue(issue),
          signature: "htmllint::" + issue.code,
          where: {
            start: {
              line: issue.line, character: issue.column
            }
          }
        });
      });
    });
  };
};

var punish = function punish(user_config) {
  var ignore = _.get(user_config, "ignore", []);
  var hl_config = config(_.get(user_config, "config"), {});
  var hl_plugins = _.get(hl_config, "plugins", []);

  htmllint.use(hl_plugins);

  delete hl_config["plugins"]; // not actually config

  return vile.promise_each(process.cwd(), allowed(ignore), into_issues(hl_config));
};

module.exports = {
  punish: punish
};