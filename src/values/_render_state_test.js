// Copyright (c) 2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var assert = require("../util/assert.js");
	var RenderState = require("./render_state.js");
	var Value = require("./value.js");

	describe("VALUE: RenderState", function() {

		var displayed = RenderState.displayed();
		var notDisplayed = RenderState.notDisplayed();
		var displayNone = RenderState.displayNone();
		var detached = RenderState.detached();

		it("is a value object", function() {
			assert.implements(displayed, Value);
		});

		it("has multiple states reflecting ways elements can be displayed or not", function() {
			assert.objEqual(RenderState.displayed(), displayed, "displayed");
			assert.objEqual(RenderState.notDisplayed(), notDisplayed, "not displayed, details unspecified");
			assert.objEqual(RenderState.displayNone(), displayNone, "not displayed, display:none property");
			assert.objEqual(RenderState.detached(), detached, "not displayed, detached from DOM");
		});

		it("describes difference", function() {
			var EQUAL = "";
			var EXPECT_NON_DISPLAY = "different than expected";
			var EXPECT_DISPLAY = "different than expected";
			var EXPECT_DIFFERENT_NON_DISPLAY = "achieved differently than expected";

			assert.equal(displayed.diff(displayed), EQUAL);
			assert.equal(displayed.diff(notDisplayed), EXPECT_NON_DISPLAY);
			assert.equal(displayed.diff(displayNone), EXPECT_NON_DISPLAY);
			assert.equal(displayed.diff(detached), EXPECT_NON_DISPLAY);

			assert.equal(notDisplayed.diff(displayed), EXPECT_DISPLAY);
			assert.equal(notDisplayed.diff(notDisplayed), EQUAL);
			assert.equal(notDisplayed.diff(displayNone), EQUAL);
			assert.equal(notDisplayed.diff(detached), EQUAL);

			assert.equal(displayNone.diff(displayed), EXPECT_DISPLAY);
			assert.equal(displayNone.diff(notDisplayed), EQUAL);
			assert.equal(displayNone.diff(displayNone), EQUAL);
			assert.equal(displayNone.diff(detached), EXPECT_DIFFERENT_NON_DISPLAY);

			assert.equal(detached.diff(displayed), EXPECT_DISPLAY);
			assert.equal(detached.diff(notDisplayed), EQUAL);
			assert.equal(detached.diff(detached), EQUAL);
			assert.equal(detached.diff(displayNone), EXPECT_DIFFERENT_NON_DISPLAY);
		});

		it("converts to string", function() {
			assert.equal(displayed.toString(), "rendered");
			assert.equal(notDisplayed.toString(), "not rendered");
			assert.equal(displayNone.toString(), "not rendered due to display:none property");
			assert.equal(detached.toString(), "not rendered due to being detached from DOM");
		});

	});

}());