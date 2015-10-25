let path = require("path")
let cjson = require("cjson")
let htmllint = require("htmllint")
let _ = require("lodash")
let vile = require("@brentlintner/vile")

const IS_HTML = /\.html?$/
const DEFAULT_HTMLLINT_CONFIG = ".htmllintrc"

let allowed = (ignore) => (file) => {
  return IS_HTML.test(file) && !vile.ignored(file, ignore)
}

let load_config = (filename) => {
  return cjson.load(path.join(process.cwd(), filename))
}

let config = (custom_config) => {
  if (typeof custom_config == "string") {
    return load_config(custom_config)
  } else if (!custom_config) {
    return load_config(DEFAULT_HTMLLINT_CONFIG)
  } else {
    return custom_config
  }
}

let into_issues = (hl_config) => (filepath, data) => {
  return htmllint(data, hl_config)
    .then((issues) => {
      if (issues.length > 0) {
        return issues.map((issue) => {
          return vile.issue(
            vile.ERROR,
            filepath,
            htmllint.messages.renderIssue(issue),
            { line: issue.line, character: issue.column }
          )
        })
      } else {
        return [ vile.issue(vile.OK, filepath) ]
      }
    })
}

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
