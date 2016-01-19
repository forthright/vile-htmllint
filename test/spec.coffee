path = require "path"
_ = require "lodash"
sinon_chai = require "./helpers/sinon_chai"
Promise = require "bluebird"
util = require "./helpers/util"
mimus = require "mimus"
sinon = require "sinon"
chai = require "chai"
expect = chai.expect
lib = mimus.require "../lib/index", __dirname, [ "vile" ]
cjson = mimus.get lib, "cjson"
vile = mimus.get lib, "vile"
htmllint_old = undefined
htmllint = undefined
htmllint_plugins = [ "foo" ]
htmllint_config =
  config:
    "indent-style": "spaces"
    plugins: []

expected_bad_issues = [{
  type: "style",
  path: "bad.html",
  title: "E027 (page-title)",
  message: "the <head> tag must contain a title",
  signature: "htmllint::E027"
  where: { start: { line: 2, character: 3 } }
}]

mimic_htmllint_resolve = ->
  beforeEach ->
    htmllint_old = mimus.get lib, "htmllint"
    htmllint = mimus.stub().returns new Promise (resolve) -> resolve([])
    htmllint.use = mimus.stub()
    mimus.set lib, "htmllint", htmllint

  afterEach -> mimus.set lib, "htmllint", htmllint_old

describe "vile-htmllint", ->
  util.change_into_system_test_dir_on_each()

  afterEach mimus.reset

  describe "punishing html", ->
    describe "with an erroneous file", ->

      it "finds issues", ->
        config = config: ".htmllintrc", ignore: [ "good.html" ]
        lib.punish(config).should.become expected_bad_issues

    describe "with an errorless file", ->
      it "finds no issues", ->
        config = config: ".htmllintrc", ignore: [ "bad.html" ]
        lib.punish(config).should.become []

  describe "loading config", ->
    mimic_htmllint_resolve()

    describe "passing plugins", ->
      it "works when present", (done) ->
        lib.punish(config: plugins: htmllint_plugins)
          .should.be.fulfilled
          .then ->
            htmllint.use.should.have.been
              .calledWith htmllint_plugins
          .should.notify done

      it "works when not present", (done) ->
        lib.punish().should.be.fulfilled
          .then ->
            htmllint.use.should.have.been.calledWith []
          .should.notify done

    describe "with nothing given", ->
      beforeEach -> mimus.stub(cjson, "load").returns {}

      it "attempts to use '.htmllintrc'", (done) ->
        lib.punish().should.be.fulfilled
          .then ->
            cjson.load.should.have.been
              .calledWith util.config_path ".htmllintrc"
          .should.notify done

    describe "with an inline object config", ->
      beforeEach -> mimus.stub cjson, "load"

      it "uses that", (done) ->
        lib.punish(htmllint_config).should.be.fulfilled
          .then ->
            cjson.load.should.not.have.been.called
          .should.notify done
