import Collapse from './collapse'
import EventHandler from '../dom/eventHandler'
import { makeArray } from '../util/index'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('Collapse', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Collapse.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Collapse.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should allow jquery object in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const fakejQueryObject = {
        0: myCollapseEl
      }
      const collapse = new Collapse(collapseEl, {
        parent: fakejQueryObject
      })

      expect(collapse._config.parent).toEqual(fakejQueryObject)
      expect(collapse._getParent()).toEqual(myCollapseEl)
    })

    it('should allow non jquery object in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: myCollapseEl
      })

      expect(collapse._config.parent).toEqual(myCollapseEl)
    })

    it('should allow string selector in parent config', () => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-toggle="collapse" href="#">Toggle item</a>',
        '    <div class="collapse">Lorem ipsum</div>',
        '  </div>',
        '</div>'
      ].join('')

      const collapseEl = fixtureEl.querySelector('div.collapse')
      const myCollapseEl = fixtureEl.querySelector('.my-collapse')
      const collapse = new Collapse(collapseEl, {
        parent: 'div.my-collapse'
      })

      expect(collapse._config.parent).toEqual('div.my-collapse')
      expect(collapse._getParent()).toEqual(myCollapseEl)
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl)

      spyOn(collapse, 'show')

      collapse.toggle()

      expect(collapse.show).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      const collapseEl = fixtureEl.querySelector('.show')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      spyOn(collapse, 'hide')

      collapse.toggle()

      expect(collapse.hide).toHaveBeenCalled()
    })

    it('should find collapse children if they have collapse class too not only data-parent', done => {
      fixtureEl.innerHTML = [
        '<div class="my-collapse">',
        '  <div class="item">',
        '    <a data-toggle="collapse" href="#">Toggle item 1</a>',
        '    <div id="collapse1" class="collapse show">Lorem ipsum 1</div>',
        '  </div>',
        '  <div class="item">',
        '    <a id="triggerCollapse2" data-toggle="collapse" href="#">Toggle item 2</a>',
        '    <div id="collapse2" class="collapse">Lorem ipsum 2</div>',
        '  </div>',
        '</div>'
      ].join('')

      const parent = fixtureEl.querySelector('.my-collapse')
      const collapseEl1 = fixtureEl.querySelector('#collapse1')
      const collapseEl2 = fixtureEl.querySelector('#collapse2')

      const collapseList = makeArray(fixtureEl.querySelectorAll('.collapse'))
        .map(el => new Collapse(el, {
          parent,
          toggle: false
        }))

      collapseEl2.addEventListener('shown.bs.collapse', () => {
        expect(collapseEl2.classList.contains('show')).toEqual(true)
        expect(collapseEl1.classList.contains('show')).toEqual(false)
        done()
      })

      collapseList[1].toggle()
    })
  })

  describe('show', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<div></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse._isTransitioning = true
      collapse.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should show a collapsed element', done => {
      fixtureEl.innerHTML = '<div class="collapse" style="height: 0px;"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapseEl.addEventListener('show.bs.collapse', () => {
        expect(collapseEl.style.height).toEqual('0px')
      })
      collapseEl.addEventListener('shown.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(true)
        expect(collapseEl.style.height).toEqual('')
        done()
      })

      collapse.show()
    })

    it('should show a collapsed element on width', done => {
      fixtureEl.innerHTML = '<div class="collapse width" style="width: 0px;"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapseEl.addEventListener('show.bs.collapse', () => {
        expect(collapseEl.style.width).toEqual('0px')
      })
      collapseEl.addEventListener('shown.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(true)
        expect(collapseEl.style.width).toEqual('')
        done()
      })

      collapse.show()
    })

    it('should collapse only the first collapse', done => {
      fixtureEl.innerHTML = [
        '<div class="card" id="accordion1">',
        '  <div id="collapse1" class="collapse"/>',
        '</div>',
        '<div class="card" id="accordion2">',
        '  <div id="collapse2" class="collapse show"/>',
        '</div>'
      ].join('')

      const el1 = fixtureEl.querySelector('#collapse1')
      const el2 = fixtureEl.querySelector('#collapse2')
      const collapse = new Collapse(el1, {
        toggle: false
      })

      el1.addEventListener('shown.bs.collapse', () => {
        expect(el1.classList.contains('show')).toEqual(true)
        expect(el2.classList.contains('show')).toEqual(true)
        done()
      })

      collapse.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="collapse"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      const expectEnd = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 10)
      }

      collapseEl.addEventListener('show.bs.collapse', e => {
        e.preventDefault()
        expectEnd()
      })

      collapseEl.addEventListener('shown.bs.collapse', () => {
        throw new Error('should not fire shown event')
      })

      collapse.show()
    })
  })

  describe('hide', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<div></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse._isTransitioning = true
      collapse.hide()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse.hide()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should hide a collapsed element', done => {
      fixtureEl.innerHTML = '<div class="collapse show"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapseEl.addEventListener('hidden.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(false)
        expect(collapseEl.style.height).toEqual('')
        done()
      })

      collapse.hide()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = '<div class="collapse show"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      const expectEnd = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 10)
      }

      collapseEl.addEventListener('hide.bs.collapse', e => {
        e.preventDefault()
        expectEnd()
      })

      collapseEl.addEventListener('hidden.bs.collapse', () => {
        throw new Error('should not fire hidden event')
      })

      collapse.hide()
    })
  })

  describe('dispose', () => {
    it('should destroy a collapse', () => {
      fixtureEl.innerHTML = '<div class="collapse show"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      expect(Collapse._getInstance(collapseEl)).toEqual(collapse)

      collapse.dispose()

      expect(Collapse._getInstance(collapseEl)).toEqual(null)
    })
  })

  describe('data-api', () => {
    it('should show multiple collapsed elements', done => {
      fixtureEl.innerHTML = [
        '<a role="button" data-toggle="collapse" class="collapsed" href=".multi"></a>',
        '<div id="collapse1" class="collapse multi"/>',
        '<div id="collapse2" class="collapse multi"/>'
      ].join('')

      const trigger = fixtureEl.querySelector('a')
      const collapse1 = fixtureEl.querySelector('#collapse1')
      const collapse2 = fixtureEl.querySelector('#collapse2')

      collapse2.addEventListener('shown.bs.collapse', () => {
        expect(trigger.getAttribute('aria-expanded')).toEqual('true')
        expect(trigger.classList.contains('collapsed')).toEqual(false)
        expect(collapse1.classList.contains('show')).toEqual(true)
        expect(collapse1.classList.contains('show')).toEqual(true)
        done()
      })

      trigger.click()
    })

    it('should hide multiple collapsed elements', done => {
      fixtureEl.innerHTML = [
        '<a role="button" data-toggle="collapse" href=".multi"></a>',
        '<div id="collapse1" class="collapse multi show"/>',
        '<div id="collapse2" class="collapse multi show"/>'
      ].join('')

      const trigger = fixtureEl.querySelector('a')
      const collapse1 = fixtureEl.querySelector('#collapse1')
      const collapse2 = fixtureEl.querySelector('#collapse2')

      collapse2.addEventListener('hidden.bs.collapse', () => {
        expect(trigger.getAttribute('aria-expanded')).toEqual('false')
        expect(trigger.classList.contains('collapsed')).toEqual(true)
        expect(collapse1.classList.contains('show')).toEqual(false)
        expect(collapse1.classList.contains('show')).toEqual(false)
        done()
      })

      trigger.click()
    })

    it('should remove "collapsed" class from target when collapse is shown', done => {
      fixtureEl.innerHTML = [
        '<a id="link1" role="button" data-toggle="collapse" class="collapsed" href="#" data-target="#test1" />',
        '<a id="link2" role="button" data-toggle="collapse" class="collapsed" href="#" data-target="#test1" />',
        '<div id="test1"></div>'
      ].join('')

      const link1 = fixtureEl.querySelector('#link1')
      const link2 = fixtureEl.querySelector('#link2')
      const collapseTest1 = fixtureEl.querySelector('#test1')

      collapseTest1.addEventListener('shown.bs.collapse', () => {
        expect(link1.getAttribute('aria-expanded')).toEqual('true')
        expect(link2.getAttribute('aria-expanded')).toEqual('true')
        expect(link1.classList.contains('collapsed')).toEqual(false)
        expect(link2.classList.contains('collapsed')).toEqual(false)
        done()
      })

      link1.click()
    })

    it('should add "collapsed" class to target when collapse is hidden', done => {
      fixtureEl.innerHTML = [
        '<a id="link1" role="button" data-toggle="collapse" href="#" data-target="#test1" />',
        '<a id="link2" role="button" data-toggle="collapse" href="#" data-target="#test1" />',
        '<div id="test1" class="show"></div>'
      ].join('')

      const link1 = fixtureEl.querySelector('#link1')
      const link2 = fixtureEl.querySelector('#link2')
      const collapseTest1 = fixtureEl.querySelector('#test1')

      collapseTest1.addEventListener('hidden.bs.collapse', () => {
        expect(link1.getAttribute('aria-expanded')).toEqual('false')
        expect(link2.getAttribute('aria-expanded')).toEqual('false')
        expect(link1.classList.contains('collapsed')).toEqual(true)
        expect(link2.classList.contains('collapsed')).toEqual(true)
        done()
      })

      link1.click()
    })

    it('should allow accordion to use children other than card', done => {
      fixtureEl.innerHTML = [
        '<div id="accordion">',
        '  <div class="item">',
        '    <a id="linkTrigger" data-toggle="collapse" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne"></a>',
        '    <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion"></div>',
        '  </div>',
        '  <div class="item">',
        '    <a id="linkTriggerTwo" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>',
        '    <div id="collapseTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion"></div>',
        '  </div>',
        '</div>'
      ].join('')

      const trigger = fixtureEl.querySelector('#linkTrigger')
      const triggerTwo = fixtureEl.querySelector('#linkTriggerTwo')
      const collapseOne = fixtureEl.querySelector('#collapseOne')
      const collapseTwo = fixtureEl.querySelector('#collapseTwo')

      collapseOne.addEventListener('shown.bs.collapse', () => {
        expect(collapseOne.classList.contains('show')).toEqual(true)
        expect(collapseTwo.classList.contains('show')).toEqual(false)

        collapseTwo.addEventListener('shown.bs.collapse', () => {
          expect(collapseOne.classList.contains('show')).toEqual(false)
          expect(collapseTwo.classList.contains('show')).toEqual(true)
          done()
        })

        triggerTwo.click()
      })

      trigger.click()
    })

    it('should not prevent event for input', done => {
      fixtureEl.innerHTML = [
        '<input type="checkbox" data-toggle="collapse" data-target="#collapsediv1" />',
        '<div id="collapsediv1"></div>'
      ].join('')

      const target = fixtureEl.querySelector('input')
      const collapseEl = fixtureEl.querySelector('#collapsediv1')

      collapseEl.addEventListener('shown.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(true)
        expect(target.checked).toEqual(true)
        done()
      })

      target.click()
    })
  })
})
