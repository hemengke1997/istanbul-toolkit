import { isArray } from 'es-toolkit/compat'

const $ = {
  one(selector: string, contextElement: Element | Document = document) {
    try {
      return <HTMLElement>contextElement.querySelector(selector) || undefined
    } catch {
      return undefined
    }
  },

  queryEl(selector: string | HTMLElement, defaultEl?: HTMLElement) {
    let target!: HTMLElement
    if (typeof selector === 'string') {
      target = document.querySelector(selector)! || defaultEl
    } else if (selector instanceof HTMLElement) {
      target = selector
    }
    return target
  },

  all(selector: string, contextElement: Element | Document = document) {
    try {
      const nodeList = <NodeListOf<HTMLElement>>contextElement.querySelectorAll(selector)
      return <HTMLElement[]>[].slice.call(nodeList)
    } catch {
      return <HTMLElement[]>[]
    }
  },

  addClass(el: Element | Element[], className: string) {
    if (!el) {
      return
    }
    const els = isArray(el) ? <Element[]>el : [<Element>el]
    for (let i = 0; i < els.length; i++) {
      const name = els[i].className || ''
      const arr = name.split(' ')
      if (arr.indexOf(className) > -1) {
        continue
      }
      arr.push(className)
      els[i].className = arr.join(' ')
    }
  },

  removeClass(el: Element | Element[], className: string) {
    if (!el) {
      return
    }
    const els = isArray(el) ? <Element[]>el : [<Element>el]
    for (let i = 0; i < els.length; i++) {
      const arr = els[i].className.split(' ')
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] === className) {
          arr[j] = ''
        }
      }
      els[i].className = arr.join(' ').trim()
    }
  },

  hasClass(el: Element, className: string) {
    if (!el || !el.classList) {
      return false
    }
    return el.classList.contains(className)
  },

  bind(el: Element | Element[] | Window, eventType: any, fn: any, useCapture: boolean = false) {
    if (!el) {
      return
    }
    const els = isArray(el) ? <Element[]>el : [<Element>el]
    els.forEach((elm) => {
      elm.addEventListener(eventType, fn, !!useCapture)
    })
  },

  delegate(el: Element, eventType: string, selector: string, fn: (event: Event, $target: HTMLElement) => void) {
    if (!el) {
      return
    }
    el.addEventListener(
      eventType,
      (e) => {
        const targets = $.all(selector, el)
        if (!targets) {
          return
        }
        findTarget: for (let i = 0; i < targets.length; i++) {
          let node = <Node>e.target
          while (node) {
            if (node === targets[i]) {
              fn.call(node, e, node as HTMLElement)
              break findTarget
            }
            node = node.parentNode!
            if (node === el) {
              break
            }
          }
        }
      },
      false,
    )
  },

  removeChildren(el: Element) {
    while (el.firstChild) {
      el.removeChild(el.lastChild!)
    }
    return el
  },
}

export { $ }
