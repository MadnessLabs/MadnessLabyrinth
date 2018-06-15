/**
 * @module Services
 */
export class HelperService {
  public getParameterByName(name) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  public async clearCache() {
    return (await caches.keys()).forEach((c) => caches.delete(c));
  }

  public formatUSD(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    return formatter.format(amount ? amount : 0);
  }

  public closestByClass(el, selector) {
    while (el.className !== selector) {
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }

    return el;
  }

  public closestByTag(el, selector) {
    while (el.tagName.toLowerCase() !== selector.toLowerCase()) {
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }

    return el;
  }

  public addOnceEventListener(element, event, func, capture) {
    function callMeOnce(e) {
      func(e);
      element.removeEventListener(event, callMeOnce, capture);
    }
    element.addEventListener(event, callMeOnce, capture);
  }

  public setByPath(obj, path, value) {
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i];
      if (!obj[elem]) { obj[elem] = {}; }
      obj = obj[elem];
    }

    obj[pList[len - 1]] = value;
  }

  public simulateClick(el) {
    let evt;
    if (document.createEvent) {
      evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
  }

  public forceBrowserResize() {
    window.dispatchEvent(new Event('resize'));
  }

}
