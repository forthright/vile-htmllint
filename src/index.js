let path = require("path")
let cjson = require("cjson")
let htmllint = require("htmllint")
let _ = require("lodash")
let vile = require("@brentlintner/vile")

const IS_HTML = /\.html?$/
const DEFAULT_HTMLLINT_CONFIG = ".htmllintrc"

let allowed = (ignore) => (file) =>
  IS_HTML.test(file) && !vile.ignored(file, ignore)

let load_config = (filename) =>
  cjson.load(path.join(process.cwd(), filename))

let config = (custom_config) =>
  typeof custom_config == "string" ?
    load_config(custom_config) :
      !custom_config ?
        load_config(DEFAULT_HTMLLINT_CONFIG) :
        custom_config

let into_issues = (hl_config) => (filepath, data) =>
  htmllint(data, hl_config)
    .then((issues) =>
      issues.map((issue) =>
        vile.issue({
          type: vile.STYL,
          path: filepath,
          title: `${issue.code} (${issue.rule})`,
          message: htmllint.messages.renderIssue(issue),
          signature: `htmllint::${issue.code}`,
          where: {
            start: {
              line: issue.line, character: issue.column
            }
          }
        })))

let punish = (user_config) => {
  const ignore = _.get(user_config, "ignore", [])
  const hl_config = config(_.get(user_config, "config"), {})
  const hl_plugins = _.get(hl_config, "plugins", [])

  htmllint.use(hl_plugins)

  delete hl_config["plugins"] // not actually config

  return vile.promise_each(
    process.cwd(),
    allowed(ignore),
    into_issues(hl_config)
  )
}

module.exports = {
  punish: punish
}
