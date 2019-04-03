$(function () {
  'use strict'

  QUnit.test('should remove "collapsed" class from active accordion target', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div id="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1" />').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2" />').appendTo($groups.eq(1))

    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3" />').appendTo($groups.eq(2))

    $('<div id="body3" data-parent="#accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should allow dots in data-parent', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div class="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" href="#body1"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent=".accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body2"/>').appendTo($groups.eq(1))

    $('<div id="body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" role="button" href="#body3"/>').appendTo($groups.eq(2))

    $('<div id="body3" data-parent=".accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should change aria-expanded from active accordion trigger/control to "false" and set the trigger/control for the newly active one to "true"', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var accordionHTML = '<div id="accordion">' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '<div class="card"/>' +
        '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.card')

    var $target1 = $('<a role="button" data-toggle="collapse" aria-expanded="true" href="#body1"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="show" data-parent="#accordion"/>').appendTo($groups.eq(0))

    var $target2 = $('<a role="button" data-toggle="collapse" aria-expanded="false" href="#body2" class="collapsed" aria-expanded="false" />').appendTo($groups.eq(1))

    $('<div id="body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" aria-expanded="false" role="button" href="#body3"/>').appendTo($groups.eq(2))

    $('<div id="body3" data-parent="#accordion"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target1.attr('aria-expanded'), 'false', 'inactive trigger/control 1 has aria-expanded="false"')
        assert.strictEqual($target2.attr('aria-expanded'), 'false', 'inactive trigger/control 2 has aria-expanded="false"')
        assert.strictEqual($target3.attr('aria-expanded'), 'true', 'active trigger/control 3 has aria-expanded="true"')

        done()
      })

    $target3[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should allow accordion to contain nested elements', function (assert) {
    assert.expect(4)
    var done = assert.async()
    var accordionHTML = '<div id="accordion">' +
        '<div class="row">' +
        '<div class="col-lg-6">' +
        '<div class="item">' +
        '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
        '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>' +
        '</div>' +
        '</div>' +
        '<div class="col-lg-6">' +
        '<div class="item">' +
        '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
        '<div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'

    $(accordionHTML).appendTo('#qunit-fixture')
    var $trigger = $('#linkTrigger')
    var $triggerTwo = $('#linkTriggerTwo')
    var $collapseOne = $('#collapseOne')
    var $collapseTwo = $('#collapseTwo')

    $collapseOne.on('shown.bs.collapse', function () {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')

      $collapseTwo.on('shown.bs.collapse', function () {
        assert.ok(!$collapseOne.hasClass('show'), '#collapseOne is not shown')
        assert.ok($collapseTwo.hasClass('show'), '#collapseTwo is shown')
        done()
      })
      $triggerTwo[0].dispatchEvent(new Event('click'))
    })
    $trigger[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should allow accordion to target multiple elements', function (assert) {
    assert.expect(8)
    var done = assert.async()
    var accordionHTML = '<div id="accordion">' +
      '<a id="linkTriggerOne" data-toggle="collapse" data-target=".collapseOne" href="#" aria-expanded="false" aria-controls="collapseOne"></a>' +
      '<a id="linkTriggerTwo" data-toggle="collapse" data-target=".collapseTwo" href="#" aria-expanded="false" aria-controls="collapseTwo"></a>' +
      '<div id="collapseOneOne" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseOneTwo" class="collapse collapseOne" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseTwoOne" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
      '<div id="collapseTwoTwo" class="collapse collapseTwo" role="tabpanel" data-parent="#accordion"></div>' +
      '</div>'

    $(accordionHTML).appendTo('#qunit-fixture')
    var $trigger = $('#linkTriggerOne')
    var $triggerTwo = $('#linkTriggerTwo')
    var $collapseOneOne = $('#collapseOneOne')
    var $collapseOneTwo = $('#collapseOneTwo')
    var $collapseTwoOne = $('#collapseTwoOne')
    var $collapseTwoTwo = $('#collapseTwoTwo')
    var collapsedElements = {
      one: false,
      two: false
    }

    function firstTest() {
      assert.ok($collapseOneOne.hasClass('show'), '#collapseOneOne is shown')
      assert.ok($collapseOneTwo.hasClass('show'), '#collapseOneTwo is shown')
      assert.ok(!$collapseTwoOne.hasClass('show'), '#collapseTwoOne is not shown')
      assert.ok(!$collapseTwoTwo.hasClass('show'), '#collapseTwoTwo is not shown')
      $triggerTwo[0].dispatchEvent(new Event('click'))
    }

    function secondTest() {
      assert.ok(!$collapseOneOne.hasClass('show'), '#collapseOneOne is not shown')
      assert.ok(!$collapseOneTwo.hasClass('show'), '#collapseOneTwo is not shown')
      assert.ok($collapseTwoOne.hasClass('show'), '#collapseTwoOne is shown')
      assert.ok($collapseTwoTwo.hasClass('show'), '#collapseTwoTwo is shown')
      done()
    }

    $collapseOneOne.on('shown.bs.collapse', function () {
      if (collapsedElements.one) {
        firstTest()
      } else {
        collapsedElements.one = true
      }
    })

    $collapseOneTwo.on('shown.bs.collapse', function () {
      if (collapsedElements.one) {
        firstTest()
      } else {
        collapsedElements.one = true
      }
    })

    $collapseTwoOne.on('shown.bs.collapse', function () {
      if (collapsedElements.two) {
        secondTest()
      } else {
        collapsedElements.two = true
      }
    })

    $collapseTwoTwo.on('shown.bs.collapse', function () {
      if (collapsedElements.two) {
        secondTest()
      } else {
        collapsedElements.two = true
      }
    })

    $trigger[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should collapse accordion children but not nested accordion children', function (assert) {
    assert.expect(9)
    var done = assert.async()
    $('<div id="accordion">' +
        '<div class="item">' +
        '<a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>' +
        '<div id="collapseOne" data-parent="#accordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
        '<div id="nestedAccordion">' +
        '<div class="item">' +
        '<a id="nestedLinkTrigger" data-toggle="collapse" href="#nestedCollapseOne" aria-expanded="false" aria-controls="nestedCollapseOne"></a>' +
        '<div id="nestedCollapseOne" data-parent="#nestedAccordion" class="collapse" role="tabpanel" aria-labelledby="headingThree">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="item">' +
        '<a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' +
        '<div id="collapseTwo" data-parent="#accordion" class="collapse show" role="tabpanel" aria-labelledby="headingTwo"></div>' +
        '</div>' +
        '</div>').appendTo('#qunit-fixture')
    var $trigger = $('#linkTrigger')
    var $triggerTwo = $('#linkTriggerTwo')
    var $nestedTrigger = $('#nestedLinkTrigger')
    var $collapseOne = $('#collapseOne')
    var $collapseTwo = $('#collapseTwo')
    var $nestedCollapseOne = $('#nestedCollapseOne')

    function handlerCollapseOne() {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')
      assert.ok(!$('#nestedCollapseOne').hasClass('show'), '#nestedCollapseOne is not shown')

      $nestedCollapseOne[0].addEventListener('shown.bs.collapse', handlerNestedCollapseOne)
      $nestedTrigger[0].dispatchEvent(new Event('click'))
      $collapseOne[0].removeEventListener('shown.bs.collapse', handlerCollapseOne)
    }

    function handlerNestedCollapseOne() {
      assert.ok($collapseOne.hasClass('show'), '#collapseOne is shown')
      assert.ok(!$collapseTwo.hasClass('show'), '#collapseTwo is not shown')
      assert.ok($nestedCollapseOne.hasClass('show'), '#nestedCollapseOne is shown')

      $collapseTwo[0].addEventListener('shown.bs.collapse', function () {
        assert.ok(!$collapseOne.hasClass('show'), '#collapseOne is not shown')
        assert.ok($collapseTwo.hasClass('show'), '#collapseTwo is shown')
        assert.ok($nestedCollapseOne.hasClass('show'), '#nestedCollapseOne is shown')
        done()
      })
      $triggerTwo[0].dispatchEvent(new Event('click'))
      $nestedCollapseOne[0].removeEventListener('shown.bs.collapse', handlerNestedCollapseOne)
    }

    $collapseOne[0].addEventListener('shown.bs.collapse', handlerCollapseOne)
    $trigger[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should add "collapsed" class to triggers only when all the targeted collapse are hidden', function (assert) {
    assert.expect(9)
    var done = assert.async()

    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')

    var $target1 = $('<div id="test1" class="multi"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi"/>').appendTo('#qunit-fixture')

    $target2.one('shown.bs.collapse', function () {
      assert.ok(!$trigger1.hasClass('collapsed'), 'trigger1 does not have collapsed class')
      assert.ok(!$trigger2.hasClass('collapsed'), 'trigger2 does not have collapsed class')
      assert.ok(!$trigger3.hasClass('collapsed'), 'trigger3 does not have collapsed class')
      $target2.one('hidden.bs.collapse', function () {
        assert.ok(!$trigger1.hasClass('collapsed'), 'trigger1 does not have collapsed class')
        assert.ok($trigger2.hasClass('collapsed'), 'trigger2 has collapsed class')
        assert.ok(!$trigger3.hasClass('collapsed'), 'trigger3 does not have collapsed class')
        $target1.one('hidden.bs.collapse', function () {
          assert.ok($trigger1.hasClass('collapsed'), 'trigger1 has collapsed class')
          assert.ok($trigger2.hasClass('collapsed'), 'trigger2 has collapsed class')
          assert.ok($trigger3.hasClass('collapsed'), 'trigger3 has collapsed class')
          done()
        })
        $trigger1[0].click()
      })
      $trigger2[0].click()
    })
    $trigger3[0].click()
  })

  QUnit.test('should set aria-expanded="true" to triggers targeting shown collaspe and aria-expanded="false" only when all the targeted collapses are shown', function (assert) {
    assert.expect(9)
    var done = assert.async()

    var $trigger1 = $('<a role="button" data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')
    var $trigger2 = $('<a role="button" data-toggle="collapse" href="#test2"/>').appendTo('#qunit-fixture')
    var $trigger3 = $('<a role="button" data-toggle="collapse" href=".multi"/>').appendTo('#qunit-fixture')

    var $target1 = $('<div id="test1" class="multi collapse"/>').appendTo('#qunit-fixture')
    var $target2 = $('<div id="test2" class="multi collapse"/>').appendTo('#qunit-fixture')

    $target2.one('shown.bs.collapse', function () {
      assert.strictEqual($trigger1.attr('aria-expanded'), 'true', 'aria-expanded on trigger1 is "true"')
      assert.strictEqual($trigger2.attr('aria-expanded'), 'true', 'aria-expanded on trigger2 is "true"')
      assert.strictEqual($trigger3.attr('aria-expanded'), 'true', 'aria-expanded on trigger3 is "true"')
      $target2.one('hidden.bs.collapse', function () {
        assert.strictEqual($trigger1.attr('aria-expanded'), 'true', 'aria-expanded on trigger1 is "true"')
        assert.strictEqual($trigger2.attr('aria-expanded'), 'false', 'aria-expanded on trigger2 is "false"')
        assert.strictEqual($trigger3.attr('aria-expanded'), 'true', 'aria-expanded on trigger3 is "true"')
        $target1.one('hidden.bs.collapse', function () {
          assert.strictEqual($trigger1.attr('aria-expanded'), 'false', 'aria-expanded on trigger1 is "fasle"')
          assert.strictEqual($trigger2.attr('aria-expanded'), 'false', 'aria-expanded on trigger2 is "false"')
          assert.strictEqual($trigger3.attr('aria-expanded'), 'false', 'aria-expanded on trigger3 is "false"')
          done()
        })
        $trigger1[0].click()
      })
      $trigger2[0].click()
    })
    $trigger3[0].click()
  })
})
