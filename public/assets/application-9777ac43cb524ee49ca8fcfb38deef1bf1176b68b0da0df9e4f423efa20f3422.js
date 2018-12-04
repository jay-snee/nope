/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var cspNonce;

      cspNonce = Rails.cspNonce = function() {
        var meta;
        meta = document.querySelector('meta[name=csp-nonce]');
        return meta && meta.content;
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.nonce = cspNonce();
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ActiveStorage=e():t.ActiveStorage=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,r){"use strict";function n(t){var e=a(document.head,'meta[name="'+t+'"]');if(e)return e.getAttribute("content")}function i(t,e){return"string"==typeof t&&(e=t,t=document),o(t.querySelectorAll(e))}function a(t,e){return"string"==typeof t&&(e=t,t=document),t.querySelector(e)}function u(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=t.disabled,i=r.bubbles,a=r.cancelable,u=r.detail,o=document.createEvent("Event");o.initEvent(e,i||!0,a||!0),o.detail=u||{};try{t.disabled=!1,t.dispatchEvent(o)}finally{t.disabled=n}return o}function o(t){return Array.isArray(t)?t:Array.from?Array.from(t):[].slice.call(t)}e.d=n,e.c=i,e.b=a,e.a=u,e.e=o},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(t&&"function"==typeof t[e]){for(var r=arguments.length,n=Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];return t[e].apply(t,n)}}r.d(e,"a",function(){return c});var a=r(6),u=r(8),o=r(9),s=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),f=0,c=function(){function t(e,r,i){n(this,t),this.id=++f,this.file=e,this.url=r,this.delegate=i}return s(t,[{key:"create",value:function(t){var e=this;a.a.create(this.file,function(r,n){if(r)return void t(r);var a=new u.a(e.file,n,e.url);i(e.delegate,"directUploadWillCreateBlobWithXHR",a.xhr),a.create(function(r){if(r)t(r);else{var n=new o.a(a);i(e.delegate,"directUploadWillStoreFileWithXHR",n.xhr),n.create(function(e){e?t(e):t(null,a.toJSON())})}})})}}]),t}()},function(t,e,r){"use strict";function n(){window.ActiveStorage&&Object(i.a)()}Object.defineProperty(e,"__esModule",{value:!0});var i=r(3),a=r(1);r.d(e,"start",function(){return i.a}),r.d(e,"DirectUpload",function(){return a.a}),setTimeout(n,1)},function(t,e,r){"use strict";function n(){d||(d=!0,document.addEventListener("submit",i),document.addEventListener("ajax:before",a))}function i(t){u(t)}function a(t){"FORM"==t.target.tagName&&u(t)}function u(t){var e=t.target;if(e.hasAttribute(l))return void t.preventDefault();var r=new c.a(e),n=r.inputs;n.length&&(t.preventDefault(),e.setAttribute(l,""),n.forEach(s),r.start(function(t){e.removeAttribute(l),t?n.forEach(f):o(e)}))}function o(t){var e=Object(h.b)(t,"input[type=submit]");if(e){var r=e,n=r.disabled;e.disabled=!1,e.focus(),e.click(),e.disabled=n}else e=document.createElement("input"),e.type="submit",e.style.display="none",t.appendChild(e),e.click(),t.removeChild(e)}function s(t){t.disabled=!0}function f(t){t.disabled=!1}e.a=n;var c=r(4),h=r(0),l="data-direct-uploads-processing",d=!1},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(5),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o="input[type=file][data-direct-upload-url]:not([disabled])",s=function(){function t(e){n(this,t),this.form=e,this.inputs=Object(a.c)(e,o).filter(function(t){return t.files.length})}return u(t,[{key:"start",value:function(t){var e=this,r=this.createDirectUploadControllers();this.dispatch("start"),function n(){var i=r.shift();i?i.start(function(r){r?(t(r),e.dispatch("end")):n()}):(t(),e.dispatch("end"))}()}},{key:"createDirectUploadControllers",value:function(){var t=[];return this.inputs.forEach(function(e){Object(a.e)(e.files).forEach(function(r){var n=new i.a(e,r);t.push(n)})}),t}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object(a.a)(this.form,"direct-uploads:"+t,{detail:e})}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return o});var i=r(1),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=function(){function t(e,r){n(this,t),this.input=e,this.file=r,this.directUpload=new i.a(this.file,this.url,this),this.dispatch("initialize")}return u(t,[{key:"start",value:function(t){var e=this,r=document.createElement("input");r.type="hidden",r.name=this.input.name,this.input.insertAdjacentElement("beforebegin",r),this.dispatch("start"),this.directUpload.create(function(n,i){n?(r.parentNode.removeChild(r),e.dispatchError(n)):r.value=i.signed_id,e.dispatch("end"),t(n)})}},{key:"uploadRequestDidProgress",value:function(t){var e=t.loaded/t.total*100;e&&this.dispatch("progress",{progress:e})}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.file=this.file,e.id=this.directUpload.id,Object(a.a)(this.input,"direct-upload:"+t,{detail:e})}},{key:"dispatchError",value:function(t){this.dispatch("error",{error:t}).defaultPrevented||alert(t)}},{key:"directUploadWillCreateBlobWithXHR",value:function(t){this.dispatch("before-blob-request",{xhr:t})}},{key:"directUploadWillStoreFileWithXHR",value:function(t){var e=this;this.dispatch("before-storage-request",{xhr:t}),t.upload.addEventListener("progress",function(t){return e.uploadRequestDidProgress(t)})}},{key:"url",get:function(){return this.input.getAttribute("data-direct-upload-url")}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(7),a=r.n(i),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=File.prototype.slice||File.prototype.mozSlice||File.prototype.webkitSlice,s=function(){function t(e){n(this,t),this.file=e,this.chunkSize=2097152,this.chunkCount=Math.ceil(this.file.size/this.chunkSize),this.chunkIndex=0}return u(t,null,[{key:"create",value:function(e,r){new t(e).create(r)}}]),u(t,[{key:"create",value:function(t){var e=this;this.callback=t,this.md5Buffer=new a.a.ArrayBuffer,this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(t){return e.fileReaderDidLoad(t)}),this.fileReader.addEventListener("error",function(t){return e.fileReaderDidError(t)}),this.readNextChunk()}},{key:"fileReaderDidLoad",value:function(t){if(this.md5Buffer.append(t.target.result),!this.readNextChunk()){var e=this.md5Buffer.end(!0),r=btoa(e);this.callback(null,r)}}},{key:"fileReaderDidError",value:function(t){this.callback("Error reading "+this.file.name)}},{key:"readNextChunk",value:function(){if(this.chunkIndex<this.chunkCount){var t=this.chunkIndex*this.chunkSize,e=Math.min(t+this.chunkSize,this.file.size),r=o.call(this.file,t,e);return this.fileReader.readAsArrayBuffer(r),this.chunkIndex++,!0}return!1}}]),t}()},function(t,e,r){!function(e){t.exports=e()}(function(t){"use strict";function e(t,e){var r=t[0],n=t[1],i=t[2],a=t[3];r+=(n&i|~n&a)+e[0]-680876936|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[1]-389564586|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[2]+606105819|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[3]-1044525330|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[4]-176418897|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[5]+1200080426|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[6]-1473231341|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[7]-45705983|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[8]+1770035416|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[9]-1958414417|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[10]-42063|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[11]-1990404162|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[12]+1804603682|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[13]-40341101|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[14]-1502002290|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[15]+1236535329|0,n=(n<<22|n>>>10)+i|0,r+=(n&a|i&~a)+e[1]-165796510|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[6]-1069501632|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[11]+643717713|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[0]-373897302|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[5]-701558691|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[10]+38016083|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[15]-660478335|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[4]-405537848|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[9]+568446438|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[14]-1019803690|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[3]-187363961|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[8]+1163531501|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[13]-1444681467|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[2]-51403784|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[7]+1735328473|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[12]-1926607734|0,n=(n<<20|n>>>12)+i|0,r+=(n^i^a)+e[5]-378558|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[8]-2022574463|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[11]+1839030562|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[14]-35309556|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[1]-1530992060|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[4]+1272893353|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[7]-155497632|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[10]-1094730640|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[13]+681279174|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[0]-358537222|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[3]-722521979|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[6]+76029189|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[9]-640364487|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[12]-421815835|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[15]+530742520|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[2]-995338651|0,n=(n<<23|n>>>9)+i|0,r+=(i^(n|~a))+e[0]-198630844|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[7]+1126891415|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[14]-1416354905|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[5]-57434055|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[12]+1700485571|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[3]-1894986606|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[10]-1051523|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[1]-2054922799|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[8]+1873313359|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[15]-30611744|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[6]-1560198380|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[13]+1309151649|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[4]-145523070|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[11]-1120210379|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[2]+718787259|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[9]-343485551|0,n=(n<<21|n>>>11)+i|0,t[0]=r+t[0]|0,t[1]=n+t[1]|0,t[2]=i+t[2]|0,t[3]=a+t[3]|0}function r(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return r}function n(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t[e]+(t[e+1]<<8)+(t[e+2]<<16)+(t[e+3]<<24);return r}function i(t){var n,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(n=64;n<=f;n+=64)e(c,r(t.substring(n-64,n)));for(t=t.substring(n-64),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],n=0;n<i;n+=1)a[n>>2]|=t.charCodeAt(n)<<(n%4<<3);if(a[n>>2]|=128<<(n%4<<3),n>55)for(e(c,a),n=0;n<16;n+=1)a[n]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function a(t){var r,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(r=64;r<=f;r+=64)e(c,n(t.subarray(r-64,r)));for(t=r-64<f?t.subarray(r-64):new Uint8Array(0),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],r=0;r<i;r+=1)a[r>>2]|=t[r]<<(r%4<<3);if(a[r>>2]|=128<<(r%4<<3),r>55)for(e(c,a),r=0;r<16;r+=1)a[r]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function u(t){var e,r="";for(e=0;e<4;e+=1)r+=p[t>>8*e+4&15]+p[t>>8*e&15];return r}function o(t){var e;for(e=0;e<t.length;e+=1)t[e]=u(t[e]);return t.join("")}function s(t){return/[\u0080-\uFFFF]/.test(t)&&(t=unescape(encodeURIComponent(t))),t}function f(t,e){var r,n=t.length,i=new ArrayBuffer(n),a=new Uint8Array(i);for(r=0;r<n;r+=1)a[r]=t.charCodeAt(r);return e?a:i}function c(t){return String.fromCharCode.apply(null,new Uint8Array(t))}function h(t,e,r){var n=new Uint8Array(t.byteLength+e.byteLength);return n.set(new Uint8Array(t)),n.set(new Uint8Array(e),t.byteLength),r?n:n.buffer}function l(t){var e,r=[],n=t.length;for(e=0;e<n-1;e+=2)r.push(parseInt(t.substr(e,2),16));return String.fromCharCode.apply(String,r)}function d(){this.reset()}var p=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];return"5d41402abc4b2a76b9719d911017c592"!==o(i("hello"))&&function(t,e){var r=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(r>>16)<<16|65535&r},"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||function(){function e(t,e){return t=0|t||0,t<0?Math.max(t+e,0):Math.min(t,e)}ArrayBuffer.prototype.slice=function(r,n){var i,a,u,o,s=this.byteLength,f=e(r,s),c=s;return n!==t&&(c=e(n,s)),f>c?new ArrayBuffer(0):(i=c-f,a=new ArrayBuffer(i),u=new Uint8Array(a),o=new Uint8Array(this,f,i),u.set(o),a)}}(),d.prototype.append=function(t){return this.appendBinary(s(t)),this},d.prototype.appendBinary=function(t){this._buff+=t,this._length+=t.length;var n,i=this._buff.length;for(n=64;n<=i;n+=64)e(this._hash,r(this._buff.substring(n-64,n)));return this._buff=this._buff.substring(n-64),this},d.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n.charCodeAt(e)<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash}},d.prototype.setState=function(t){return this._buff=t.buff,this._length=t.length,this._hash=t.hash,this},d.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},d.prototype._finish=function(t,r){var n,i,a,u=r;if(t[u>>2]|=128<<(u%4<<3),u>55)for(e(this._hash,t),u=0;u<16;u+=1)t[u]=0;n=8*this._length,n=n.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(n[2],16),a=parseInt(n[1],16)||0,t[14]=i,t[15]=a,e(this._hash,t)},d.hash=function(t,e){return d.hashBinary(s(t),e)},d.hashBinary=function(t,e){var r=i(t),n=o(r);return e?l(n):n},d.ArrayBuffer=function(){this.reset()},d.ArrayBuffer.prototype.append=function(t){var r,i=h(this._buff.buffer,t,!0),a=i.length;for(this._length+=t.byteLength,r=64;r<=a;r+=64)e(this._hash,n(i.subarray(r-64,r)));return this._buff=r-64<a?new Uint8Array(i.buffer.slice(r-64)):new Uint8Array(0),this},d.ArrayBuffer.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n[e]<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.ArrayBuffer.prototype.getState=function(){var t=d.prototype.getState.call(this);return t.buff=c(t.buff),t},d.ArrayBuffer.prototype.setState=function(t){return t.buff=f(t.buff,!0),d.prototype.setState.call(this,t)},d.ArrayBuffer.prototype.destroy=d.prototype.destroy,d.ArrayBuffer.prototype._finish=d.prototype._finish,d.ArrayBuffer.hash=function(t,e){var r=a(new Uint8Array(t)),n=o(r);return e?l(n):n},d})},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return u});var i=r(0),a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=function(){function t(e,r,a){var u=this;n(this,t),this.file=e,this.attributes={filename:e.name,content_type:e.type,byte_size:e.size,checksum:r},this.xhr=new XMLHttpRequest,this.xhr.open("POST",a,!0),this.xhr.responseType="json",this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.setRequestHeader("Accept","application/json"),this.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"),this.xhr.setRequestHeader("X-CSRF-Token",Object(i.d)("csrf-token")),this.xhr.addEventListener("load",function(t){return u.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return u.requestDidError(t)})}return a(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(JSON.stringify({blob:this.attributes}))}},{key:"requestDidLoad",value:function(t){if(this.status>=200&&this.status<300){var e=this.response,r=e.direct_upload;delete e.direct_upload,this.attributes=e,this.directUploadData=r,this.callback(null,this.toJSON())}else this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error creating Blob for "'+this.file.name+'". Status: '+this.status)}},{key:"toJSON",value:function(){var t={};for(var e in this.attributes)t[e]=this.attributes[e];return t}},{key:"status",get:function(){return this.xhr.status}},{key:"response",get:function(){var t=this.xhr,e=t.responseType,r=t.response;return"json"==e?r:JSON.parse(r)}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return a});var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),a=function(){function t(e){var r=this;n(this,t),this.blob=e,this.file=e.file;var i=e.directUploadData,a=i.url,u=i.headers;this.xhr=new XMLHttpRequest,this.xhr.open("PUT",a,!0),this.xhr.responseType="text";for(var o in u)this.xhr.setRequestHeader(o,u[o]);this.xhr.addEventListener("load",function(t){return r.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return r.requestDidError(t)})}return i(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(this.file.slice())}},{key:"requestDidLoad",value:function(t){var e=this.xhr,r=e.status,n=e.response;r>=200&&r<300?this.callback(null,n):this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error storing "'+this.file.name+'". Status: '+this.xhr.status)}}]),t}()}])});
/*
Turbolinks 5.1.0
Copyright © 2018 Basecamp, LLC
 */

(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,e){return Turbolinks.controller.visit(t,e)},clearCache:function(){return Turbolinks.controller.clearCache()},setProgressBarDelay:function(t){return Turbolinks.controller.setProgressBarDelay(t)}}}).call(this),function(){var t,e,r,n=[].slice;Turbolinks.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},Turbolinks.closest=function(e,r){return t.call(e,r)},t=function(){var t,r;return t=document.documentElement,null!=(r=t.closest)?r:function(t){var r;for(r=this;r;){if(r.nodeType===Node.ELEMENT_NODE&&e.call(r,t))return r;r=r.parentNode}}}(),Turbolinks.defer=function(t){return setTimeout(t,1)},Turbolinks.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?n.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},Turbolinks.dispatch=function(t,e){var n,o,i,s,a,u;return a=null!=e?e:{},u=a.target,n=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,n===!0),i.data=null!=o?o:{},i.cancelable&&!r&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},r=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),Turbolinks.match=function(t,r){return e.call(t,r)},e=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),Turbolinks.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}.call(this),function(){Turbolinks.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.HttpRequest=function(){function e(e,r,n){this.delegate=e,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=Turbolinks.Location.wrap(r).requestURL,this.referrer=Turbolinks.Location.wrap(n).absoluteURL,this.createXHR()}return e.NETWORK_FAILURE=0,e.TIMEOUT_FAILURE=-1,e.timeout=60,e.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},e.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},e.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},e.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},e.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},e.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},e.prototype.requestCanceled=function(){return this.endRequest()},e.prototype.notifyApplicationBeforeRequestStart=function(){return Turbolinks.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},e.prototype.notifyApplicationAfterRequestEnd=function(){return Turbolinks.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},e.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},e.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},e.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},e.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.BrowserAdapter=function(){function e(e){this.controller=e,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new Turbolinks.ProgressBar}var r,n,o;return o=Turbolinks.HttpRequest,r=o.NETWORK_FAILURE,n=o.TIMEOUT_FAILURE,e.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},e.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},e.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},e.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},e.prototype.visitRequestCompleted=function(t){return t.loadResponse()},e.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case r:case n:return this.reload();default:return t.loadResponse()}},e.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},e.prototype.visitCompleted=function(t){return t.followRedirect()},e.prototype.pageInvalidated=function(){return this.reload()},e.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},e.prototype.showProgressBar=function(){return this.progressBar.show()},e.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},e.prototype.reload=function(){return window.location.reload()},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.History=function(){function e(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return e.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},e.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},e.prototype.push=function(t,e){return t=Turbolinks.Location.wrap(t),this.update("push",t,e)},e.prototype.replace=function(t,e){return t=Turbolinks.Location.wrap(t),this.update("replace",t,e)},e.prototype.onPopState=function(t){var e,r,n,o;return this.shouldHandlePopState()&&(o=null!=(r=t.state)?r.turbolinks:void 0)?(e=Turbolinks.Location.wrap(window.location),n=o.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(e,n)):void 0},e.prototype.onPageLoad=function(t){return Turbolinks.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},e.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},e.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},e.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},e}()}.call(this),function(){Turbolinks.Snapshot=function(){function t(t){var e,r;r=t.head,e=t.body,this.head=null!=r?r:document.createElement("head"),this.body=null!=e?e:document.createElement("body")}return t.wrap=function(t){return t instanceof this?t:this.fromHTML(t)},t.fromHTML=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromElement(e)},t.fromElement=function(t){return new this({head:t.querySelector("head"),body:t.querySelector("body")})},t.prototype.clone=function(){return new t({head:this.head.cloneNode(!0),body:this.body.cloneNode(!0)})},t.prototype.getRootLocation=function(){var t,e;return e=null!=(t=this.getSetting("root"))?t:"/",new Turbolinks.Location(e)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.body.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){var e,r;return r=this.head.querySelectorAll("meta[name='turbolinks-"+t+"']"),e=r[r.length-1],null!=e?e.getAttribute("content"):void 0},t}()}.call(this),function(){var t=[].slice;Turbolinks.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){Turbolinks.HeadDetails=function(){function t(t){var e,r,i,s,a,u,l;for(this.element=t,this.elements={},l=this.element.childNodes,s=0,u=l.length;u>s;s++)i=l[s],i.nodeType===Node.ELEMENT_NODE&&(a=i.outerHTML,r=null!=(e=this.elements)[a]?e[a]:e[a]={type:o(i),tracked:n(i),elements:[]},r.elements.push(i))}var e,r,n,o;return t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},o=function(t){return e(t)?"script":r(t)?"stylesheet":void 0},n=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},e=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},r=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Turbolinks.SnapshotRenderer=function(e){function r(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=new Turbolinks.HeadDetails(this.currentSnapshot.head),this.newHeadDetails=new Turbolinks.HeadDetails(this.newSnapshot.head),this.newBody=this.newSnapshot.body}return t(r,e),r.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},r.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},r.prototype.replaceBody=function(){return this.activateBodyScriptElements(),this.importBodyPermanentElements(),this.assignNewBody()},r.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},r.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},r.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},r.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},r.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},r.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},r.prototype.importBodyPermanentElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyPermanentElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],(t=this.findCurrentBodyPermanentElement(o))?i.push(o.parentNode.replaceChild(t,o)):i.push(void 0);return i},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.assignNewBody=function(){return document.body=this.newBody},r.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.findFirstAutofocusableElement())?t.focus():void 0},r.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},r.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},r.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},r.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},r.prototype.getNewBodyPermanentElements=function(){return this.newBody.querySelectorAll("[id][data-turbolinks-permanent]")},r.prototype.findCurrentBodyPermanentElement=function(t){return document.body.querySelector("#"+t.id+"[data-turbolinks-permanent]")},r.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},r.prototype.findFirstAutofocusableElement=function(){return document.body.querySelector("[autofocus]")},r}(Turbolinks.Renderer)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Turbolinks.ErrorRenderer=function(e){function r(t){this.html=t}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceDocumentHTML(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceDocumentHTML=function(){return document.documentElement.innerHTML=this.html},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(Turbolinks.Renderer)}.call(this),function(){Turbolinks.View=function(){function t(t){this.delegate=t,this.element=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return Turbolinks.Snapshot.fromElement(this.element)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.element.setAttribute("data-turbolinks-preview",""):this.element.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,e,r){return Turbolinks.SnapshotRenderer.render(this.delegate,r,this.getSnapshot(),Turbolinks.Snapshot.wrap(t),e)},t.prototype.renderError=function(t,e){return Turbolinks.ErrorRenderer.render(this.delegate,e,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.ScrollManager=function(){function e(e){this.delegate=e,this.onScroll=t(this.onScroll,this),this.onScroll=Turbolinks.throttle(this.onScroll)}return e.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},e.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},e.prototype.scrollToElement=function(t){return t.scrollIntoView()},e.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},e.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},e.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},e}()}.call(this),function(){Turbolinks.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var e;return t.prototype.has=function(t){var r;return r=e(t),r in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var r;return r=e(t),this.snapshots[r]},t.prototype.write=function(t,r){var n;return n=e(t),this.snapshots[n]=r},t.prototype.touch=function(t){var r,n;return n=e(t),r=this.keys.indexOf(n),r>-1&&this.keys.splice(r,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},e=function(t){return Turbolinks.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.Visit=function(){function e(e,r,n){this.controller=e,this.action=n,this.performScroll=t(this.performScroll,this),this.identifier=Turbolinks.uuid(),this.location=Turbolinks.Location.wrap(r),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var r;return e.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},e.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},e.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},e.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},e.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=r(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},e.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new Turbolinks.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},e.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},e.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},e.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},e.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},e.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},e.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},e.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},e.prototype.requestCompletedWithResponse=function(t,e){return this.response=t,null!=e&&(this.redirectedToLocation=Turbolinks.Location.wrap(e)),this.adapter.visitRequestCompleted(this)},e.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},e.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},e.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},e.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},e.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},e.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},e.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},e.prototype.getTimingMetrics=function(){return Turbolinks.copyObject(this.timingMetrics)},r=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},e.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},e.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},e.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},e.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.Controller=function(){function e(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new Turbolinks.History(this),this.view=new Turbolinks.View(this),this.scrollManager=new Turbolinks.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return e.prototype.start=function(){return Turbolinks.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},e.prototype.disable=function(){return this.enabled=!1},e.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},e.prototype.clearCache=function(){return this.cache=new Turbolinks.SnapshotCache(10)},e.prototype.visit=function(t,e){var r,n;return null==e&&(e={}),t=Turbolinks.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(r=null!=(n=e.action)?n:"advance",this.adapter.visitProposedToLocationWithAction(t,r)):window.location=t:void 0},e.prototype.startVisitToLocationWithAction=function(t,e,r){var n;return Turbolinks.supported?(n=this.getRestorationDataForIdentifier(r),this.startVisit(t,e,{restorationData:n})):window.location=t},e.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},e.prototype.startHistory=function(){return this.location=Turbolinks.Location.wrap(window.location),this.restorationIdentifier=Turbolinks.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},e.prototype.stopHistory=function(){return this.history.stop()},e.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,e){return this.restorationIdentifier=e,this.location=Turbolinks.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},e.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,e){return this.restorationIdentifier=e,this.location=Turbolinks.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},e.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,e){var r;return this.restorationIdentifier=e,this.enabled?(r=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:r,historyChanged:!0}),this.location=Turbolinks.Location.wrap(t)):this.adapter.pageInvalidated()},e.prototype.getCachedSnapshotForLocation=function(t){var e;return e=this.cache.get(t),e?e.clone():void 0},e.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable()},e.prototype.cacheSnapshot=function(){var t;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),t=this.view.getSnapshot(),this.cache.put(this.lastRenderedLocation,t.clone())):void 0},e.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},e.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},e.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},e.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},e.prototype.render=function(t,e){return this.view.render(t,e)},e.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},e.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},e.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},e.prototype.pageLoaded=function(){
return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},e.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},e.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},e.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},e.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},e.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,e){return Turbolinks.dispatch("turbolinks:click",{target:t,data:{url:e.absoluteURL},cancelable:!0})},e.prototype.notifyApplicationBeforeVisitingLocation=function(t){return Turbolinks.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},e.prototype.notifyApplicationAfterVisitingLocation=function(t){return Turbolinks.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},e.prototype.notifyApplicationBeforeCachingSnapshot=function(){return Turbolinks.dispatch("turbolinks:before-cache")},e.prototype.notifyApplicationBeforeRender=function(t){return Turbolinks.dispatch("turbolinks:before-render",{data:{newBody:t}})},e.prototype.notifyApplicationAfterRender=function(){return Turbolinks.dispatch("turbolinks:render")},e.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),Turbolinks.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},e.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},e.prototype.createVisit=function(t,e,r){var n,o,i,s,a;return o=null!=r?r:{},s=o.restorationIdentifier,i=o.restorationData,n=o.historyChanged,a=new Turbolinks.Visit(this,t,e),a.restorationIdentifier=null!=s?s:Turbolinks.uuid(),a.restorationData=Turbolinks.copyObject(i),a.historyChanged=n,a.referrer=this.location,a},e.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},e.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},e.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?Turbolinks.closest(t,"a[href]:not([target]):not([download])"):void 0},e.prototype.getVisitableLocationForLink=function(t){var e;return e=new Turbolinks.Location(t.getAttribute("href")),this.locationIsVisitable(e)?e:void 0},e.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},e.prototype.nodeIsVisitable=function(t){var e;return(e=Turbolinks.closest(t,"[data-turbolinks]"))?"false"!==e.getAttribute("data-turbolinks"):!0},e.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},e.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},e.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},e}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,e,r;Turbolinks.start=function(){return e()?(null==Turbolinks.controller&&(Turbolinks.controller=t()),Turbolinks.controller.start()):void 0},e=function(){return null==window.Turbolinks&&(window.Turbolinks=Turbolinks),r()},t=function(){var t;return t=new Turbolinks.Controller,t.adapter=new Turbolinks.BrowserAdapter(t),t},r=function(){return window.Turbolinks===Turbolinks},r()&&Turbolinks.start()}.call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {
  var ready;

  ready = function() {
    if ($('#profile').length) {
      return App.cable.subscriptions.create({
        channel: "ApplicationCable::ProfilesChannel",
        id: $('#profile').data('id')
      }, {
        received: function(data) {
          return this.prependLine(data);
        },
        prependLine: function(data) {
          var div_id, html;
          html = this.createLine(data);
          div_id = "#message-" + data.id;
          if (!($(div_id).length)) {
            return $("#messages-list").prepend(html);
          }
        },
        createLine: function(data) {
          var convdt, date_string, dtcomps, dtstr, from_string, time, time_string;
          dtstr = data.created_at;
          dtstr = dtstr.replace(/\D/g, " ");
          dtcomps = dtstr.split(" ");
          dtcomps[1]--;
          convdt = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
          date_string = convdt.toLocaleDateString("en-GB");
          time = convdt.toTimeString();
          time_string = time.split(' ')[0].slice(0, -3);
          from_string = new String(data.from);
          from_string = from_string.replace('<', '&lt;');
          from_string = from_string.replace('>', '&gt;');
          return "<li id=\"message-" + data.id + "\" class=\"list-group-item message\" data-envelope='" + data.envelope + "'>\n  <a href=\"/messages/" + data.id + "\">\n    <div class=\"row\">\n      <div class=\"col-sm-12 col-md-6 p-2\">\n        " + data.subject + "\n      </div>\n      <div class=\"col-md-3 d-none d-md-block\">\n        " + from_string + "\n      </div>\n      <div class=\"col-md-3 d-none d-md-block\">\n        " + time_string + " " + date_string + "\n      </div>\n    </div>\n  </a>\n</li>";
        }
      });
    }
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
(function() {


}).call(this);
window.addEventListener("load", function(){
window.cookieconsent.initialise({
  "palette": {
    "popup": {
      "background": "#000"
    },
    "button": {
      "background": "#f1d600"
    }
  },
  "content": {
    "href": "https://beta.faircustodian.com/privacy"
  }
})});
(function() {


}).call(this);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Generated by CoffeeScript 2.1.0
(function () {
  /*
  jQuery Growl
  Copyright 2015 Kevin Sylvestre
  1.3.5
  */
  "use strict";

  var $, Animation, Growl;

  $ = jQuery;

  Animation = function () {
    var Animation = function () {
      function Animation() {
        _classCallCheck(this, Animation);
      }

      _createClass(Animation, null, [{
        key: "transition",
        value: function transition($el) {
          var el, ref, result, type;
          el = $el[0];
          ref = this.transitions;
          for (type in ref) {
            result = ref[type];
            if (el.style[type] != null) {
              return result;
            }
          }
        }
      }]);

      return Animation;
    }();

    ;

    Animation.transitions = {
      "webkitTransition": "webkitTransitionEnd",
      "mozTransition": "mozTransitionEnd",
      "oTransition": "oTransitionEnd",
      "transition": "transitionend"
    };

    return Animation;
  }();

  Growl = function () {
    var Growl = function () {
      _createClass(Growl, null, [{
        key: "growl",
        value: function growl() {
          var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          return new Growl(settings);
        }
      }]);

      function Growl() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Growl);

        this.render = this.render.bind(this);
        this.bind = this.bind.bind(this);
        this.unbind = this.unbind.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.click = this.click.bind(this);
        this.close = this.close.bind(this);
        this.cycle = this.cycle.bind(this);
        this.waitAndDismiss = this.waitAndDismiss.bind(this);
        this.present = this.present.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.remove = this.remove.bind(this);
        this.animate = this.animate.bind(this);
        this.$growls = this.$growls.bind(this);
        this.$growl = this.$growl.bind(this);
        this.html = this.html.bind(this);
        this.content = this.content.bind(this);
        this.container = this.container.bind(this);
        this.settings = $.extend({}, Growl.settings, settings);
        this.initialize(this.settings.location);
        this.render();
      }

      _createClass(Growl, [{
        key: "initialize",
        value: function initialize(location) {
          var id;
          id = 'growls-' + location;
          return $('body:not(:has(#' + id + '))').append('<div id="' + id + '" />');
        }
      }, {
        key: "render",
        value: function render() {
          var $growl;
          $growl = this.$growl();
          this.$growls(this.settings.location).append($growl);
          if (this.settings.fixed) {
            this.present();
          } else {
            this.cycle();
          }
        }
      }, {
        key: "bind",
        value: function bind() {
          var $growl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$growl();

          $growl.on("click", this.click);
          if (this.settings.delayOnHover) {
            $growl.on("mouseenter", this.mouseEnter);
            $growl.on("mouseleave", this.mouseLeave);
          }
          return $growl.on("contextmenu", this.close).find("." + this.settings.namespace + "-close").on("click", this.close);
        }
      }, {
        key: "unbind",
        value: function unbind() {
          var $growl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$growl();

          $growl.off("click", this.click);
          if (this.settings.delayOnHover) {
            $growl.off("mouseenter", this.mouseEnter);
            $growl.off("mouseleave", this.mouseLeave);
          }
          return $growl.off("contextmenu", this.close).find("." + this.settings.namespace + "-close").off("click", this.close);
        }
      }, {
        key: "mouseEnter",
        value: function mouseEnter(event) {
          var $growl;
          $growl = this.$growl();
          return $growl.stop(true, true);
        }
      }, {
        key: "mouseLeave",
        value: function mouseLeave(event) {
          return this.waitAndDismiss();
        }
      }, {
        key: "click",
        value: function click(event) {
          if (this.settings.url != null) {
            event.preventDefault();
            event.stopPropagation();
            return window.open(this.settings.url);
          }
        }
      }, {
        key: "close",
        value: function close(event) {
          var $growl;
          event.preventDefault();
          event.stopPropagation();
          $growl = this.$growl();
          return $growl.stop().queue(this.dismiss).queue(this.remove);
        }
      }, {
        key: "cycle",
        value: function cycle() {
          var $growl;
          $growl = this.$growl();
          return $growl.queue(this.present).queue(this.waitAndDismiss());
        }
      }, {
        key: "waitAndDismiss",
        value: function waitAndDismiss() {
          var $growl;
          $growl = this.$growl();
          return $growl.delay(this.settings.duration).queue(this.dismiss).queue(this.remove);
        }
      }, {
        key: "present",
        value: function present(callback) {
          var $growl;
          $growl = this.$growl();
          this.bind($growl);
          return this.animate($growl, this.settings.namespace + "-incoming", 'out', callback);
        }
      }, {
        key: "dismiss",
        value: function dismiss(callback) {
          var $growl;
          $growl = this.$growl();
          this.unbind($growl);
          return this.animate($growl, this.settings.namespace + "-outgoing", 'in', callback);
        }
      }, {
        key: "remove",
        value: function remove(callback) {
          this.$growl().remove();
          return typeof callback === "function" ? callback() : void 0;
        }
      }, {
        key: "animate",
        value: function animate($element, name) {
          var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'in';
          var callback = arguments[3];

          var transition;
          transition = Animation.transition($element);
          $element[direction === 'in' ? 'removeClass' : 'addClass'](name);
          $element.offset().position;
          $element[direction === 'in' ? 'addClass' : 'removeClass'](name);
          if (callback == null) {
            return;
          }
          if (transition != null) {
            $element.one(transition, callback);
          } else {
            callback();
          }
        }
      }, {
        key: "$growls",
        value: function $growls(location) {
          var base;
          if (this.$_growls == null) {
            this.$_growls = [];
          }
          return (base = this.$_growls)[location] != null ? base[location] : base[location] = $('#growls-' + location);
        }
      }, {
        key: "$growl",
        value: function $growl() {
          return this.$_growl != null ? this.$_growl : this.$_growl = $(this.html());
        }
      }, {
        key: "html",
        value: function html() {
          return this.container(this.content());
        }
      }, {
        key: "content",
        value: function content() {
          return "<div class='" + this.settings.namespace + "-close'>" + this.settings.close + "</div>\n<div class='" + this.settings.namespace + "-title'>" + this.settings.title + "</div>\n<div class='" + this.settings.namespace + "-message'>" + this.settings.message + "</div>";
        }
      }, {
        key: "container",
        value: function container(content) {
          return "<div class='" + this.settings.namespace + " " + this.settings.namespace + "-" + this.settings.style + " " + this.settings.namespace + "-" + this.settings.size + "'>\n  " + content + "\n</div>";
        }
      }]);

      return Growl;
    }();

    ;

    Growl.settings = {
      namespace: 'growl',
      duration: 3200,
      close: "&#215;",
      location: "default",
      style: "default",
      size: "medium",
      delayOnHover: true
    };

    return Growl;
  }();

  this.Growl = Growl;

  $.growl = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Growl.growl(options);
  };

  $.growl.error = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var settings;
    settings = {
      title: "Error!",
      style: "error"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.notice = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var settings;
    settings = {
      title: "Notice!",
      style: "notice"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.warning = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var settings;
    settings = {
      title: "Warning!",
      style: "warning"
    };
    return $.growl($.extend(settings, options));
  };
}).call(this);
(function() {


}).call(this);
(function() {
  var ready;

  ready = function() {
    $('.toggle-button').each(function(index) {
      if ($(this).data('state') === 'true') {
        $(this).removeClass('btn-outline-warning');
        return $(this).addClass('btn-outline-success');
      }
    });
    new ClipboardJS('.copy-button');
    return $('.copy-button').on('click', function() {
      return $.growl.notice({
        title: "",
        message: "Email address copied to your clipboard!"
      });
    });
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");!function(t){var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||e[0]>=4)throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(),function(){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},n=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o,s,r,a,l,h,c,u,f,d,_,p,g,m,v,y,E,T,C,I,b,w,S,A,D,N,O,k,P,L,R,x,j,W,H,M,K,U,Q,V,F,B,Y,z,G,Z,X,q,J,tt,et,nt,it,ot,st,rt,at,lt,ht,ct,ut,ft,dt,_t,pt,gt,mt,vt,yt,Et,Tt,Ct,It,bt,wt,St,At,Dt,Nt,Ot,kt,Pt,Lt,Rt,xt,jt,Wt,Ht,Mt,Kt,Ut,Qt,Vt,Ft,Bt,$t,Yt,zt,Gt,Zt,Xt,qt,Jt,te,ee,ne,ie,oe,se,re,ae,le,he,ce,ue,fe,de,_e,pe,ge,me,ve,ye,Ee,Te,Ce,Ie,be,we,Se,Ae,De,Ne,Oe,ke,Pe,Le,Re,xe,je,We,He,Me,Ke,Ue,Qe,Ve,Fe,Be,$e,Ye,ze,Ge,Ze,Xe,qe,Je,tn,en,nn,on,sn,rn,an,ln,hn,cn,un,fn,dn,_n,pn,gn,mn,vn,yn,En,Tn,Cn,In,bn,wn,Sn,An,Dn,Nn,On,kn,Pn,Ln,Rn,xn,jn,Wn,Hn,Mn,Kn,Un,Qn,Vn,Fn,Bn,$n,Yn,zn,Gn,Zn,Xn,qn,Jn,ti,ei,ni,ii,oi,si=function(t){var e=!1;function n(e){var n=this,o=!1;return t(this).one(i.TRANSITION_END,function(){o=!0}),setTimeout(function(){o||i.triggerTransitionEnd(n)},e),this}var i={TRANSITION_END:"bsTransitionEnd",getUID:function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},getSelectorFromElement:function(e){var n=e.getAttribute("data-target");n&&"#"!==n||(n=e.getAttribute("href")||"");try{return t(document).find(n).length>0?n:null}catch(t){return null}},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(n){t(n).trigger(e.end)},supportsTransitionEnd:function(){return Boolean(e)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var o in n)if(Object.prototype.hasOwnProperty.call(n,o)){var s=n[o],r=e[o],a=r&&i.isElement(r)?"element":(l=r,{}.toString.call(l).match(/\s([a-z]+)/i)[1].toLowerCase());if(!new RegExp(s).test(a))throw new Error(t.toUpperCase()+': Option "'+o+'" provided type "'+a+'" but expected type "'+s+'".')}var l}};return e=("undefined"==typeof window||!window.QUnit)&&{end:"transitionend"},t.fn.emulateTransitionEnd=n,i.supportsTransitionEnd()&&(t.event.special[i.TRANSITION_END]={bindType:e.end,delegateType:e.end,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}),i}($),ri=(o=$,s="alert",a="."+(r="bs.alert"),l=o.fn[s],h={CLOSE:"close"+a,CLOSED:"closed"+a,CLICK_DATA_API:"click"+a+".data-api"},c="alert",u="fade",f="show",d=function(){function t(e){i(this,t),this._element=e}return t.prototype.close=function(t){t=t||this._element;var e=this._getRootElement(t);this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},t.prototype.dispose=function(){o.removeData(this._element,r),this._element=null},t.prototype._getRootElement=function(t){var e=si.getSelectorFromElement(t),n=!1;return e&&(n=o(e)[0]),n||(n=o(t).closest("."+c)[0]),n},t.prototype._triggerCloseEvent=function(t){var e=o.Event(h.CLOSE);return o(t).trigger(e),e},t.prototype._removeElement=function(t){var e=this;o(t).removeClass(f),si.supportsTransitionEnd()&&o(t).hasClass(u)?o(t).one(si.TRANSITION_END,function(n){return e._destroyElement(t,n)}).emulateTransitionEnd(150):this._destroyElement(t)},t.prototype._destroyElement=function(t){o(t).detach().trigger(h.CLOSED).remove()},t._jQueryInterface=function(e){return this.each(function(){var n=o(this),i=n.data(r);i||(i=new t(this),n.data(r,i)),"close"===e&&i[e](this)})},t._handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},n(t,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),t}(),o(document).on(h.CLICK_DATA_API,'[data-dismiss="alert"]',d._handleDismiss(new d)),o.fn[s]=d._jQueryInterface,o.fn[s].Constructor=d,o.fn[s].noConflict=function(){return o.fn[s]=l,d._jQueryInterface},_=$,p="button",m="."+(g="bs.button"),v=".data-api",y=_.fn[p],E="active",T="btn",C="focus",I='[data-toggle^="button"]',b='[data-toggle="buttons"]',w="input",S=".active",A=".btn",D={CLICK_DATA_API:"click"+m+v,FOCUS_BLUR_DATA_API:"focus"+m+v+" blur"+m+v},N=function(){function t(e){i(this,t),this._element=e}return t.prototype.toggle=function(){var t=!0,e=!0,n=_(this._element).closest(b)[0];if(n){var i=_(this._element).find(w)[0];if(i){if("radio"===i.type)if(i.checked&&_(this._element).hasClass(E))t=!1;else{var o=_(n).find(S)[0];o&&_(o).removeClass(E)}if(t){if(i.hasAttribute("disabled")||n.hasAttribute("disabled")||i.classList.contains("disabled")||n.classList.contains("disabled"))return;i.checked=!_(this._element).hasClass(E),_(i).trigger("change")}i.focus(),e=!1}}e&&this._element.setAttribute("aria-pressed",!_(this._element).hasClass(E)),t&&_(this._element).toggleClass(E)},t.prototype.dispose=function(){_.removeData(this._element,g),this._element=null},t._jQueryInterface=function(e){return this.each(function(){var n=_(this).data(g);n||(n=new t(this),_(this).data(g,n)),"toggle"===e&&n[e]()})},n(t,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),t}(),_(document).on(D.CLICK_DATA_API,I,function(t){t.preventDefault();var e=t.target;_(e).hasClass(T)||(e=_(e).closest(A)),N._jQueryInterface.call(_(e),"toggle")}).on(D.FOCUS_BLUR_DATA_API,I,function(t){var e=_(t.target).closest(A)[0];_(e).toggleClass(C,/^focus(in)?$/.test(t.type))}),_.fn[p]=N._jQueryInterface,_.fn[p].Constructor=N,_.fn[p].noConflict=function(){return _.fn[p]=y,N._jQueryInterface},O=$,k="carousel",L="."+(P="bs.carousel"),R=".data-api",x=O.fn[k],j={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0},W={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean"},H="next",M="prev",K="left",U="right",Q={SLIDE:"slide"+L,SLID:"slid"+L,KEYDOWN:"keydown"+L,MOUSEENTER:"mouseenter"+L,MOUSELEAVE:"mouseleave"+L,TOUCHEND:"touchend"+L,LOAD_DATA_API:"load"+L+R,CLICK_DATA_API:"click"+L+R},V="carousel",F="active",B="slide",Y="carousel-item-right",z="carousel-item-left",G="carousel-item-next",Z="carousel-item-prev",X={ACTIVE:".active",ACTIVE_ITEM:".active.carousel-item",ITEM:".carousel-item",NEXT_PREV:".carousel-item-next, .carousel-item-prev",INDICATORS:".carousel-indicators",DATA_SLIDE:"[data-slide], [data-slide-to]",DATA_RIDE:'[data-ride="carousel"]'},q=function(){function o(t,e){i(this,o),this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this._config=this._getConfig(e),this._element=O(t)[0],this._indicatorsElement=O(this._element).find(X.INDICATORS)[0],this._addEventListeners()}return o.prototype.next=function(){this._isSliding||this._slide(H)},o.prototype.nextWhenVisible=function(){!document.hidden&&O(this._element).is(":visible")&&"hidden"!==O(this._element).css("visibility")&&this.next()},o.prototype.prev=function(){this._isSliding||this._slide(M)},o.prototype.pause=function(t){t||(this._isPaused=!0),O(this._element).find(X.NEXT_PREV)[0]&&si.supportsTransitionEnd()&&(si.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},o.prototype.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},o.prototype.to=function(t){var e=this;this._activeElement=O(this._element).find(X.ACTIVE_ITEM)[0];var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)O(this._element).one(Q.SLID,function(){return e.to(t)});else{if(n===t)return this.pause(),void this.cycle();var i=t>n?H:M;this._slide(i,this._items[t])}},o.prototype.dispose=function(){O(this._element).off(L),O.removeData(this._element,P),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},o.prototype._getConfig=function(t){return t=e({},j,t),si.typeCheckConfig(k,t,W),t},o.prototype._addEventListeners=function(){var t=this;this._config.keyboard&&O(this._element).on(Q.KEYDOWN,function(e){return t._keydown(e)}),"hover"===this._config.pause&&(O(this._element).on(Q.MOUSEENTER,function(e){return t.pause(e)}).on(Q.MOUSELEAVE,function(e){return t.cycle(e)}),"ontouchstart"in document.documentElement&&O(this._element).on(Q.TOUCHEND,function(){t.pause(),t.touchTimeout&&clearTimeout(t.touchTimeout),t.touchTimeout=setTimeout(function(e){return t.cycle(e)},500+t._config.interval)}))},o.prototype._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next()}},o.prototype._getItemIndex=function(t){return this._items=O.makeArray(O(t).parent().find(X.ITEM)),this._items.indexOf(t)},o.prototype._getItemByDirection=function(t,e){var n=t===H,i=t===M,o=this._getItemIndex(e),s=this._items.length-1;if((i&&0===o||n&&o===s)&&!this._config.wrap)return e;var r=(o+(t===M?-1:1))%this._items.length;return-1===r?this._items[this._items.length-1]:this._items[r]},o.prototype._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(O(this._element).find(X.ACTIVE_ITEM)[0]),o=O.Event(Q.SLIDE,{relatedTarget:t,direction:e,from:i,to:n});return O(this._element).trigger(o),o},o.prototype._setActiveIndicatorElement=function(t){if(this._indicatorsElement){O(this._indicatorsElement).find(X.ACTIVE).removeClass(F);var e=this._indicatorsElement.children[this._getItemIndex(t)];e&&O(e).addClass(F)}},o.prototype._slide=function(t,e){var n=this,i=O(this._element).find(X.ACTIVE_ITEM)[0],o=this._getItemIndex(i),s=e||i&&this._getItemByDirection(t,i),r=this._getItemIndex(s),a=Boolean(this._interval),l=void 0,h=void 0,c=void 0;if(t===H?(l=z,h=G,c=K):(l=Y,h=Z,c=U),s&&O(s).hasClass(F))this._isSliding=!1;else if(!this._triggerSlideEvent(s,c).isDefaultPrevented()&&i&&s){this._isSliding=!0,a&&this.pause(),this._setActiveIndicatorElement(s);var u=O.Event(Q.SLID,{relatedTarget:s,direction:c,from:o,to:r});si.supportsTransitionEnd()&&O(this._element).hasClass(B)?(O(s).addClass(h),si.reflow(s),O(i).addClass(l),O(s).addClass(l),O(i).one(si.TRANSITION_END,function(){O(s).removeClass(l+" "+h).addClass(F),O(i).removeClass(F+" "+h+" "+l),n._isSliding=!1,setTimeout(function(){return O(n._element).trigger(u)},0)}).emulateTransitionEnd(600)):(O(i).removeClass(F),O(s).addClass(F),this._isSliding=!1,O(this._element).trigger(u)),a&&this.cycle()}},o._jQueryInterface=function(n){return this.each(function(){var i=O(this).data(P),s=e({},j,O(this).data());"object"===(void 0===n?"undefined":t(n))&&(s=e({},s,n));var r="string"==typeof n?n:s.slide;if(i||(i=new o(this,s),O(this).data(P,i)),"number"==typeof n)i.to(n);else if("string"==typeof r){if(void 0===i[r])throw new TypeError('No method named "'+r+'"');i[r]()}else s.interval&&(i.pause(),i.cycle())})},o._dataApiClickHandler=function(t){var n=si.getSelectorFromElement(this);if(n){var i=O(n)[0];if(i&&O(i).hasClass(V)){var s=e({},O(i).data(),O(this).data()),r=this.getAttribute("data-slide-to");r&&(s.interval=!1),o._jQueryInterface.call(O(i),s),r&&O(i).data(P).to(r),t.preventDefault()}}},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return j}}]),o}(),O(document).on(Q.CLICK_DATA_API,X.DATA_SLIDE,q._dataApiClickHandler),O(window).on(Q.LOAD_DATA_API,function(){O(X.DATA_RIDE).each(function(){var t=O(this);q._jQueryInterface.call(t,t.data())})}),O.fn[k]=q._jQueryInterface,O.fn[k].Constructor=q,O.fn[k].noConflict=function(){return O.fn[k]=x,q._jQueryInterface},J=$,tt="collapse",nt="."+(et="bs.collapse"),it=J.fn[tt],ot={toggle:!0,parent:""},st={toggle:"boolean",parent:"(string|element)"},rt={SHOW:"show"+nt,SHOWN:"shown"+nt,HIDE:"hide"+nt,HIDDEN:"hidden"+nt,CLICK_DATA_API:"click"+nt+".data-api"},at="show",lt="collapse",ht="collapsing",ct="collapsed",ut="width",ft="height",dt={ACTIVES:".show, .collapsing",DATA_TOGGLE:'[data-toggle="collapse"]'},_t=function(){function o(t,e){i(this,o),this._isTransitioning=!1,this._element=t,this._config=this._getConfig(e),this._triggerArray=J.makeArray(J('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'));for(var n=J(dt.DATA_TOGGLE),s=0;s<n.length;s++){var r=n[s],a=si.getSelectorFromElement(r);null!==a&&J(a).filter(t).length>0&&(this._selector=a,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}return o.prototype.toggle=function(){J(this._element).hasClass(at)?this.hide():this.show()},o.prototype.show=function(){var t=this;if(!this._isTransitioning&&!J(this._element).hasClass(at)){var e=void 0,n=void 0;if(this._parent&&0===(e=J.makeArray(J(this._parent).find(dt.ACTIVES).filter('[data-parent="'+this._config.parent+'"]'))).length&&(e=null),!(e&&(n=J(e).not(this._selector).data(et))&&n._isTransitioning)){var i=J.Event(rt.SHOW);if(J(this._element).trigger(i),!i.isDefaultPrevented()){e&&(o._jQueryInterface.call(J(e).not(this._selector),"hide"),n||J(e).data(et,null));var s=this._getDimension();J(this._element).removeClass(lt).addClass(ht),this._element.style[s]=0,this._triggerArray.length>0&&J(this._triggerArray).removeClass(ct).attr("aria-expanded",!0),this.setTransitioning(!0);var r=function(){J(t._element).removeClass(ht).addClass(lt).addClass(at),t._element.style[s]="",t.setTransitioning(!1),J(t._element).trigger(rt.SHOWN)};if(si.supportsTransitionEnd()){var a="scroll"+(s[0].toUpperCase()+s.slice(1));J(this._element).one(si.TRANSITION_END,r).emulateTransitionEnd(600),this._element.style[s]=this._element[a]+"px"}else r()}}}},o.prototype.hide=function(){var t=this;if(!this._isTransitioning&&J(this._element).hasClass(at)){var e=J.Event(rt.HIDE);if(J(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._getDimension();if(this._element.style[n]=this._element.getBoundingClientRect()[n]+"px",si.reflow(this._element),J(this._element).addClass(ht).removeClass(lt).removeClass(at),this._triggerArray.length>0)for(var i=0;i<this._triggerArray.length;i++){var o=this._triggerArray[i],s=si.getSelectorFromElement(o);if(null!==s)J(s).hasClass(at)||J(o).addClass(ct).attr("aria-expanded",!1)}this.setTransitioning(!0);var r=function(){t.setTransitioning(!1),J(t._element).removeClass(ht).addClass(lt).trigger(rt.HIDDEN)};this._element.style[n]="",si.supportsTransitionEnd()?J(this._element).one(si.TRANSITION_END,r).emulateTransitionEnd(600):r()}}},o.prototype.setTransitioning=function(t){this._isTransitioning=t},o.prototype.dispose=function(){J.removeData(this._element,et),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},o.prototype._getConfig=function(t){return(t=e({},ot,t)).toggle=Boolean(t.toggle),si.typeCheckConfig(tt,t,st),t},o.prototype._getDimension=function(){return J(this._element).hasClass(ut)?ut:ft},o.prototype._getParent=function(){var t=this,e=null;si.isElement(this._config.parent)?(e=this._config.parent,void 0!==this._config.parent.jquery&&(e=this._config.parent[0])):e=J(this._config.parent)[0];var n='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]';return J(e).find(n).each(function(e,n){t._addAriaAndCollapsedClass(o._getTargetFromElement(n),[n])}),e},o.prototype._addAriaAndCollapsedClass=function(t,e){if(t){var n=J(t).hasClass(at);e.length>0&&J(e).toggleClass(ct,!n).attr("aria-expanded",n)}},o._getTargetFromElement=function(t){var e=si.getSelectorFromElement(t);return e?J(e)[0]:null},o._jQueryInterface=function(n){return this.each(function(){var i=J(this),s=i.data(et),r=e({},ot,i.data(),"object"===(void 0===n?"undefined":t(n))&&n);if(!s&&r.toggle&&/show|hide/.test(n)&&(r.toggle=!1),s||(s=new o(this,r),i.data(et,s)),"string"==typeof n){if(void 0===s[n])throw new TypeError('No method named "'+n+'"');s[n]()}})},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return ot}}]),o}(),J(document).on(rt.CLICK_DATA_API,dt.DATA_TOGGLE,function(t){"A"===t.currentTarget.tagName&&t.preventDefault();var e=J(this),n=si.getSelectorFromElement(this);J(n).each(function(){var t=J(this),n=t.data(et)?"toggle":e.data();_t._jQueryInterface.call(t,n)})}),J.fn[tt]=_t._jQueryInterface,J.fn[tt].Constructor=_t,J.fn[tt].noConflict=function(){return J.fn[tt]=it,_t._jQueryInterface},pt=$,Popper,gt="dropdown",vt="."+(mt="bs.dropdown"),yt=".data-api",Et=pt.fn[gt],Tt=new RegExp("38|40|27"),Ct={HIDE:"hide"+vt,HIDDEN:"hidden"+vt,SHOW:"show"+vt,SHOWN:"shown"+vt,CLICK:"click"+vt,CLICK_DATA_API:"click"+vt+yt,KEYDOWN_DATA_API:"keydown"+vt+yt,KEYUP_DATA_API:"keyup"+vt+yt},It="disabled",bt="show",wt="dropup",St="dropright",At="dropleft",Dt="dropdown-menu-right",Nt="position-static",Ot='[data-toggle="dropdown"]',kt=".dropdown form",Pt=".dropdown-menu",Lt=".navbar-nav",Rt=".dropdown-menu .dropdown-item:not(.disabled)",xt="top-start",jt="top-end",Wt="bottom-start",Ht="bottom-end",Mt="right-start",Kt="left-start",Ut={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle"},Qt={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)"},Vt=function(){function o(t,e){i(this,o),this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}return o.prototype.toggle=function(){if(!this._element.disabled&&!pt(this._element).hasClass(It)){var t=o._getParentFromElement(this._element),e=pt(this._menu).hasClass(bt);if(o._clearMenus(),!e){var n={relatedTarget:this._element},i=pt.Event(Ct.SHOW,n);if(pt(t).trigger(i),!i.isDefaultPrevented()){if(!this._inNavbar){if("undefined"==typeof Popper)throw new TypeError("Bootstrap dropdown require Popper.js (https://popper.js.org)");var s=this._element;"parent"===this._config.reference?s=t:si.isElement(this._config.reference)&&(s=this._config.reference,void 0!==this._config.reference.jquery&&(s=this._config.reference[0])),"scrollParent"!==this._config.boundary&&pt(t).addClass(Nt),this._popper=new Popper(s,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===pt(t).closest(Lt).length&&pt("body").children().on("mouseover",null,pt.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),pt(this._menu).toggleClass(bt),pt(t).toggleClass(bt).trigger(pt.Event(Ct.SHOWN,n))}}}},o.prototype.dispose=function(){pt.removeData(this._element,mt),pt(this._element).off(vt),this._element=null,this._menu=null,null!==this._popper&&(this._popper.destroy(),this._popper=null)},o.prototype.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},o.prototype._addEventListeners=function(){var t=this;pt(this._element).on(Ct.CLICK,function(e){e.preventDefault(),e.stopPropagation(),t.toggle()})},o.prototype._getConfig=function(t){return t=e({},this.constructor.Default,pt(this._element).data(),t),si.typeCheckConfig(gt,t,this.constructor.DefaultType),t},o.prototype._getMenuElement=function(){if(!this._menu){var t=o._getParentFromElement(this._element);this._menu=pt(t).find(Pt)[0]}return this._menu},o.prototype._getPlacement=function(){var t=pt(this._element).parent(),e=Wt;return t.hasClass(wt)?(e=xt,pt(this._menu).hasClass(Dt)&&(e=jt)):t.hasClass(St)?e=Mt:t.hasClass(At)?e=Kt:pt(this._menu).hasClass(Dt)&&(e=Ht),e},o.prototype._detectNavbar=function(){return pt(this._element).closest(".navbar").length>0},o.prototype._getPopperConfig=function(){var t=this,n={};return"function"==typeof this._config.offset?n.fn=function(n){return n.offsets=e({},n.offsets,t._config.offset(n.offsets)||{}),n}:n.offset=this._config.offset,{placement:this._getPlacement(),modifiers:{offset:n,flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}}},o._jQueryInterface=function(e){return this.each(function(){var n=pt(this).data(mt),i="object"===(void 0===e?"undefined":t(e))?e:null;if(n||(n=new o(this,i),pt(this).data(mt,n)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},o._clearMenus=function(t){if(!t||3!==t.which&&("keyup"!==t.type||9===t.which))for(var e=pt.makeArray(pt(Ot)),n=0;n<e.length;n++){var i=o._getParentFromElement(e[n]),s=pt(e[n]).data(mt),r={relatedTarget:e[n]};if(s){var a=s._menu;if(pt(i).hasClass(bt)&&!(t&&("click"===t.type&&/input|textarea/i.test(t.target.tagName)||"keyup"===t.type&&9===t.which)&&pt.contains(i,t.target))){var l=pt.Event(Ct.HIDE,r);pt(i).trigger(l),l.isDefaultPrevented()||("ontouchstart"in document.documentElement&&pt("body").children().off("mouseover",null,pt.noop),e[n].setAttribute("aria-expanded","false"),pt(a).removeClass(bt),pt(i).removeClass(bt).trigger(pt.Event(Ct.HIDDEN,r)))}}}},o._getParentFromElement=function(t){var e=void 0,n=si.getSelectorFromElement(t);return n&&(e=pt(n)[0]),e||t.parentNode},o._dataApiKeydownHandler=function(t){if((/input|textarea/i.test(t.target.tagName)?!(32===t.which||27!==t.which&&(40!==t.which&&38!==t.which||pt(t.target).closest(Pt).length)):Tt.test(t.which))&&(t.preventDefault(),t.stopPropagation(),!this.disabled&&!pt(this).hasClass(It))){var e=o._getParentFromElement(this),n=pt(e).hasClass(bt);if((n||27===t.which&&32===t.which)&&(!n||27!==t.which&&32!==t.which)){var i=pt(e).find(Rt).get();if(0!==i.length){var s=i.indexOf(t.target);38===t.which&&s>0&&s--,40===t.which&&s<i.length-1&&s++,s<0&&(s=0),i[s].focus()}}else{if(27===t.which){var r=pt(e).find(Ot)[0];pt(r).trigger("focus")}pt(this).trigger("click")}}},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return Ut}},{key:"DefaultType",get:function(){return Qt}}]),o}(),pt(document).on(Ct.KEYDOWN_DATA_API,Ot,Vt._dataApiKeydownHandler).on(Ct.KEYDOWN_DATA_API,Pt,Vt._dataApiKeydownHandler).on(Ct.CLICK_DATA_API+" "+Ct.KEYUP_DATA_API,Vt._clearMenus).on(Ct.CLICK_DATA_API,Ot,function(t){t.preventDefault(),t.stopPropagation(),Vt._jQueryInterface.call(pt(this),"toggle")}).on(Ct.CLICK_DATA_API,kt,function(t){t.stopPropagation()}),pt.fn[gt]=Vt._jQueryInterface,pt.fn[gt].Constructor=Vt,pt.fn[gt].noConflict=function(){return pt.fn[gt]=Et,Vt._jQueryInterface},Ft=$,Bt="modal",Yt="."+($t="bs.modal"),zt=Ft.fn[Bt],Gt={backdrop:!0,keyboard:!0,focus:!0,show:!0},Zt={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},Xt={HIDE:"hide"+Yt,HIDDEN:"hidden"+Yt,SHOW:"show"+Yt,SHOWN:"shown"+Yt,FOCUSIN:"focusin"+Yt,RESIZE:"resize"+Yt,CLICK_DISMISS:"click.dismiss"+Yt,KEYDOWN_DISMISS:"keydown.dismiss"+Yt,MOUSEUP_DISMISS:"mouseup.dismiss"+Yt,MOUSEDOWN_DISMISS:"mousedown.dismiss"+Yt,CLICK_DATA_API:"click"+Yt+".data-api"},qt="modal-scrollbar-measure",Jt="modal-backdrop",te="modal-open",ee="fade",ne="show",ie={DIALOG:".modal-dialog",DATA_TOGGLE:'[data-toggle="modal"]',DATA_DISMISS:'[data-dismiss="modal"]',FIXED_CONTENT:".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",STICKY_CONTENT:".sticky-top",NAVBAR_TOGGLER:".navbar-toggler"},oe=function(){function o(t,e){i(this,o),this._config=this._getConfig(e),this._element=t,this._dialog=Ft(t).find(ie.DIALOG)[0],this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._originalBodyPadding=0,this._scrollbarWidth=0}return o.prototype.toggle=function(t){return this._isShown?this.hide():this.show(t)},o.prototype.show=function(t){var e=this;if(!this._isTransitioning&&!this._isShown){si.supportsTransitionEnd()&&Ft(this._element).hasClass(ee)&&(this._isTransitioning=!0);var n=Ft.Event(Xt.SHOW,{relatedTarget:t});Ft(this._element).trigger(n),this._isShown||n.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),Ft(document.body).addClass(te),this._setEscapeEvent(),this._setResizeEvent(),Ft(this._element).on(Xt.CLICK_DISMISS,ie.DATA_DISMISS,function(t){return e.hide(t)}),Ft(this._dialog).on(Xt.MOUSEDOWN_DISMISS,function(){Ft(e._element).one(Xt.MOUSEUP_DISMISS,function(t){Ft(t.target).is(e._element)&&(e._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return e._showElement(t)}))}},o.prototype.hide=function(t){var e=this;if(t&&t.preventDefault(),!this._isTransitioning&&this._isShown){var n=Ft.Event(Xt.HIDE);if(Ft(this._element).trigger(n),this._isShown&&!n.isDefaultPrevented()){this._isShown=!1;var i=si.supportsTransitionEnd()&&Ft(this._element).hasClass(ee);i&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),Ft(document).off(Xt.FOCUSIN),Ft(this._element).removeClass(ne),Ft(this._element).off(Xt.CLICK_DISMISS),Ft(this._dialog).off(Xt.MOUSEDOWN_DISMISS),i?Ft(this._element).one(si.TRANSITION_END,function(t){return e._hideModal(t)}).emulateTransitionEnd(300):this._hideModal()}}},o.prototype.dispose=function(){Ft.removeData(this._element,$t),Ft(window,document,this._element,this._backdrop).off(Yt),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._scrollbarWidth=null},o.prototype.handleUpdate=function(){this._adjustDialog()},o.prototype._getConfig=function(t){return t=e({},Gt,t),si.typeCheckConfig(Bt,t,Zt),t},o.prototype._showElement=function(t){var e=this,n=si.supportsTransitionEnd()&&Ft(this._element).hasClass(ee);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.scrollTop=0,n&&si.reflow(this._element),Ft(this._element).addClass(ne),this._config.focus&&this._enforceFocus();var i=Ft.Event(Xt.SHOWN,{relatedTarget:t}),o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,Ft(e._element).trigger(i)};n?Ft(this._dialog).one(si.TRANSITION_END,o).emulateTransitionEnd(300):o()},o.prototype._enforceFocus=function(){var t=this;Ft(document).off(Xt.FOCUSIN).on(Xt.FOCUSIN,function(e){document!==e.target&&t._element!==e.target&&0===Ft(t._element).has(e.target).length&&t._element.focus()})},o.prototype._setEscapeEvent=function(){var t=this;this._isShown&&this._config.keyboard?Ft(this._element).on(Xt.KEYDOWN_DISMISS,function(e){27===e.which&&(e.preventDefault(),t.hide())}):this._isShown||Ft(this._element).off(Xt.KEYDOWN_DISMISS)},o.prototype._setResizeEvent=function(){var t=this;this._isShown?Ft(window).on(Xt.RESIZE,function(e){return t.handleUpdate(e)}):Ft(window).off(Xt.RESIZE)},o.prototype._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._isTransitioning=!1,this._showBackdrop(function(){Ft(document.body).removeClass(te),t._resetAdjustments(),t._resetScrollbar(),Ft(t._element).trigger(Xt.HIDDEN)})},o.prototype._removeBackdrop=function(){this._backdrop&&(Ft(this._backdrop).remove(),this._backdrop=null)},o.prototype._showBackdrop=function(t){var e=this,n=Ft(this._element).hasClass(ee)?ee:"";if(this._isShown&&this._config.backdrop){var i=si.supportsTransitionEnd()&&n;if(this._backdrop=document.createElement("div"),this._backdrop.className=Jt,n&&Ft(this._backdrop).addClass(n),Ft(this._backdrop).appendTo(document.body),Ft(this._element).on(Xt.CLICK_DISMISS,function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===e._config.backdrop?e._element.focus():e.hide())}),i&&si.reflow(this._backdrop),Ft(this._backdrop).addClass(ne),!t)return;if(!i)return void t();Ft(this._backdrop).one(si.TRANSITION_END,t).emulateTransitionEnd(150)}else if(!this._isShown&&this._backdrop){Ft(this._backdrop).removeClass(ne);var o=function(){e._removeBackdrop(),t&&t()};si.supportsTransitionEnd()&&Ft(this._element).hasClass(ee)?Ft(this._backdrop).one(si.TRANSITION_END,o).emulateTransitionEnd(150):o()}else t&&t()},o.prototype._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},o.prototype._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},o.prototype._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=t.left+t.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},o.prototype._setScrollbar=function(){var t=this;if(this._isBodyOverflowing){Ft(ie.FIXED_CONTENT).each(function(e,n){var i=Ft(n)[0].style.paddingRight,o=Ft(n).css("padding-right");Ft(n).data("padding-right",i).css("padding-right",parseFloat(o)+t._scrollbarWidth+"px")}),Ft(ie.STICKY_CONTENT).each(function(e,n){var i=Ft(n)[0].style.marginRight,o=Ft(n).css("margin-right");Ft(n).data("margin-right",i).css("margin-right",parseFloat(o)-t._scrollbarWidth+"px")}),Ft(ie.NAVBAR_TOGGLER).each(function(e,n){var i=Ft(n)[0].style.marginRight,o=Ft(n).css("margin-right");Ft(n).data("margin-right",i).css("margin-right",parseFloat(o)+t._scrollbarWidth+"px")});var e=document.body.style.paddingRight,n=Ft("body").css("padding-right");Ft("body").data("padding-right",e).css("padding-right",parseFloat(n)+this._scrollbarWidth+"px")}},o.prototype._resetScrollbar=function(){Ft(ie.FIXED_CONTENT).each(function(t,e){var n=Ft(e).data("padding-right");void 0!==n&&Ft(e).css("padding-right",n).removeData("padding-right")}),Ft(ie.STICKY_CONTENT+", "+ie.NAVBAR_TOGGLER).each(function(t,e){var n=Ft(e).data("margin-right");void 0!==n&&Ft(e).css("margin-right",n).removeData("margin-right")});var t=Ft("body").data("padding-right");void 0!==t&&Ft("body").css("padding-right",t).removeData("padding-right")},o.prototype._getScrollbarWidth=function(){var t=document.createElement("div");t.className=qt,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},o._jQueryInterface=function(n,i){return this.each(function(){var s=Ft(this).data($t),r=e({},o.Default,Ft(this).data(),"object"===(void 0===n?"undefined":t(n))&&n);if(s||(s=new o(this,r),Ft(this).data($t,s)),"string"==typeof n){if(void 0===s[n])throw new TypeError('No method named "'+n+'"');s[n](i)}else r.show&&s.show(i)})},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return Gt}}]),o}(),Ft(document).on(Xt.CLICK_DATA_API,ie.DATA_TOGGLE,function(t){var n=this,i=void 0,o=si.getSelectorFromElement(this);o&&(i=Ft(o)[0]);var s=Ft(i).data($t)?"toggle":e({},Ft(i).data(),Ft(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault();var r=Ft(i).one(Xt.SHOW,function(t){t.isDefaultPrevented()||r.one(Xt.HIDDEN,function(){Ft(n).is(":visible")&&n.focus()})});oe._jQueryInterface.call(Ft(i),s,this)}),Ft.fn[Bt]=oe._jQueryInterface,Ft.fn[Bt].Constructor=oe,Ft.fn[Bt].noConflict=function(){return Ft.fn[Bt]=zt,oe._jQueryInterface},se=$,Popper,re="tooltip",le="."+(ae="bs.tooltip"),he=se.fn[re],ce="bs-tooltip",ue=new RegExp("(^|\\s)"+ce+"\\S+","g"),fe={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)"},de={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},_e={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent"},pe="show",ge="out",me={HIDE:"hide"+le,HIDDEN:"hidden"+le,SHOW:"show"+le,SHOWN:"shown"+le,INSERTED:"inserted"+le,CLICK:"click"+le,FOCUSIN:"focusin"+le,FOCUSOUT:"focusout"+le,MOUSEENTER:"mouseenter"+le,MOUSELEAVE:"mouseleave"+le},ve="fade",ye="show",Ee=".tooltip-inner",Te=".arrow",Ce="hover",Ie="focus",be="click",we="manual",Se=function(){function o(t,e){if(i(this,o),"undefined"==typeof Popper)throw new TypeError("Bootstrap tooltips require Popper.js (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}return o.prototype.enable=function(){this._isEnabled=!0},o.prototype.disable=function(){this._isEnabled=!1},o.prototype.toggleEnabled=function(){this._isEnabled=!this._isEnabled},o.prototype.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=se(t.currentTarget).data(e);n||(n=new this.constructor(t.currentTarget,this._getDelegateConfig()),se(t.currentTarget).data(e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(se(this.getTipElement()).hasClass(ye))return void this._leave(null,this);this._enter(null,this)}},o.prototype.dispose=function(){clearTimeout(this._timeout),se.removeData(this.element,this.constructor.DATA_KEY),se(this.element).off(this.constructor.EVENT_KEY),se(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&se(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,null!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},o.prototype.show=function(){var t=this;if("none"===se(this.element).css("display"))throw new Error("Please use show on visible elements");var e=se.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){se(this.element).trigger(e);var n=se.contains(this.element.ownerDocument.documentElement,this.element);if(e.isDefaultPrevented()||!n)return;var i=this.getTipElement(),s=si.getUID(this.constructor.NAME);i.setAttribute("id",s),this.element.setAttribute("aria-describedby",s),this.setContent(),this.config.animation&&se(i).addClass(ve);var r="function"==typeof this.config.placement?this.config.placement.call(this,i,this.element):this.config.placement,a=this._getAttachment(r);this.addAttachmentClass(a);var l=!1===this.config.container?document.body:se(this.config.container);se(i).data(this.constructor.DATA_KEY,this),se.contains(this.element.ownerDocument.documentElement,this.tip)||se(i).appendTo(l),se(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new Popper(this.element,i,{placement:a,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:Te},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(e){e.originalPlacement!==e.placement&&t._handlePopperPlacementChange(e)},onUpdate:function(e){t._handlePopperPlacementChange(e)}}),se(i).addClass(ye),"ontouchstart"in document.documentElement&&se("body").children().on("mouseover",null,se.noop);var h=function(){t.config.animation&&t._fixTransition();var e=t._hoverState;t._hoverState=null,se(t.element).trigger(t.constructor.Event.SHOWN),e===ge&&t._leave(null,t)};si.supportsTransitionEnd()&&se(this.tip).hasClass(ve)?se(this.tip).one(si.TRANSITION_END,h).emulateTransitionEnd(o._TRANSITION_DURATION):h()}},o.prototype.hide=function(t){var e=this,n=this.getTipElement(),i=se.Event(this.constructor.Event.HIDE),o=function(){e._hoverState!==pe&&n.parentNode&&n.parentNode.removeChild(n),e._cleanTipClass(),e.element.removeAttribute("aria-describedby"),se(e.element).trigger(e.constructor.Event.HIDDEN),null!==e._popper&&e._popper.destroy(),t&&t()};se(this.element).trigger(i),i.isDefaultPrevented()||(se(n).removeClass(ye),"ontouchstart"in document.documentElement&&se("body").children().off("mouseover",null,se.noop),this._activeTrigger[be]=!1,this._activeTrigger[Ie]=!1,this._activeTrigger[Ce]=!1,si.supportsTransitionEnd()&&se(this.tip).hasClass(ve)?se(n).one(si.TRANSITION_END,o).emulateTransitionEnd(150):o(),this._hoverState="")},o.prototype.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},o.prototype.isWithContent=function(){return Boolean(this.getTitle())},o.prototype.addAttachmentClass=function(t){se(this.getTipElement()).addClass(ce+"-"+t)},o.prototype.getTipElement=function(){return this.tip=this.tip||se(this.config.template)[0],this.tip},o.prototype.setContent=function(){var t=se(this.getTipElement());this.setElementContent(t.find(Ee),this.getTitle()),t.removeClass(ve+" "+ye)},o.prototype.setElementContent=function(e,n){var i=this.config.html;"object"===(void 0===n?"undefined":t(n))&&(n.nodeType||n.jquery)?i?se(n).parent().is(e)||e.empty().append(n):e.text(se(n).text()):e[i?"html":"text"](n)},o.prototype.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},o.prototype._getAttachment=function(t){return de[t.toUpperCase()]},o.prototype._setListeners=function(){var t=this;this.config.trigger.split(" ").forEach(function(e){if("click"===e)se(t.element).on(t.constructor.Event.CLICK,t.config.selector,function(e){return t.toggle(e)});else if(e!==we){var n=e===Ce?t.constructor.Event.MOUSEENTER:t.constructor.Event.FOCUSIN,i=e===Ce?t.constructor.Event.MOUSELEAVE:t.constructor.Event.FOCUSOUT;se(t.element).on(n,t.config.selector,function(e){return t._enter(e)}).on(i,t.config.selector,function(e){return t._leave(e)})}se(t.element).closest(".modal").on("hide.bs.modal",function(){return t.hide()})}),this.config.selector?this.config=e({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},o.prototype._fixTitle=function(){var e=t(this.element.getAttribute("data-original-title"));(this.element.getAttribute("title")||"string"!==e)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},o.prototype._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||se(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),se(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusin"===t.type?Ie:Ce]=!0),se(e.getTipElement()).hasClass(ye)||e._hoverState===pe?e._hoverState=pe:(clearTimeout(e._timeout),e._hoverState=pe,e.config.delay&&e.config.delay.show?e._timeout=setTimeout(function(){e._hoverState===pe&&e.show()},e.config.delay.show):e.show())},o.prototype._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||se(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),se(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusout"===t.type?Ie:Ce]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=ge,e.config.delay&&e.config.delay.hide?e._timeout=setTimeout(function(){e._hoverState===ge&&e.hide()},e.config.delay.hide):e.hide())},o.prototype._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},o.prototype._getConfig=function(t){return"number"==typeof(t=e({},this.constructor.Default,se(this.element).data(),t)).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),si.typeCheckConfig(re,t,this.constructor.DefaultType),t},o.prototype._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},o.prototype._cleanTipClass=function(){var t=se(this.getTipElement()),e=t.attr("class").match(ue);null!==e&&e.length>0&&t.removeClass(e.join(""))},o.prototype._handlePopperPlacementChange=function(t){this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},o.prototype._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(se(t).removeClass(ve),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e)},o._jQueryInterface=function(e){return this.each(function(){var n=se(this).data(ae),i="object"===(void 0===e?"undefined":t(e))&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new o(this,i),se(this).data(ae,n)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return _e}},{key:"NAME",get:function(){return re}},{key:"DATA_KEY",get:function(){return ae}},{key:"Event",get:function(){return me}},{key:"EVENT_KEY",get:function(){return le}},{key:"DefaultType",get:function(){return fe}}]),o}(),se.fn[re]=Se._jQueryInterface,se.fn[re].Constructor=Se,se.fn[re].noConflict=function(){return se.fn[re]=he,Se._jQueryInterface},Se),ai=(Ae=$,De="popover",Oe="."+(Ne="bs.popover"),ke=Ae.fn[De],Pe="bs-popover",Le=new RegExp("(^|\\s)"+Pe+"\\S+","g"),Re=e({},ri.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),xe=e({},ri.DefaultType,{content:"(string|element|function)"}),je="fade",We="show",He=".popover-header",Me=".popover-body",Ke={HIDE:"hide"+Oe,HIDDEN:"hidden"+Oe,SHOW:"show"+Oe,SHOWN:"shown"+Oe,INSERTED:"inserted"+Oe,CLICK:"click"+Oe,FOCUSIN:"focusin"+Oe,FOCUSOUT:"focusout"+Oe,MOUSEENTER:"mouseenter"+Oe,MOUSELEAVE:"mouseleave"+Oe},Ue=function(e){function o(){return i(this,o),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,e.apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(o,e),o.prototype.isWithContent=function(){return this.getTitle()||this._getContent()},o.prototype.addAttachmentClass=function(t){Ae(this.getTipElement()).addClass(Pe+"-"+t)},o.prototype.getTipElement=function(){return this.tip=this.tip||Ae(this.config.template)[0],this.tip},o.prototype.setContent=function(){var t=Ae(this.getTipElement());this.setElementContent(t.find(He),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(t.find(Me),e),t.removeClass(je+" "+We)},o.prototype._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},o.prototype._cleanTipClass=function(){var t=Ae(this.getTipElement()),e=t.attr("class").match(Le);null!==e&&e.length>0&&t.removeClass(e.join(""))},o._jQueryInterface=function(e){return this.each(function(){var n=Ae(this).data(Ne),i="object"===(void 0===e?"undefined":t(e))?e:null;if((n||!/destroy|hide/.test(e))&&(n||(n=new o(this,i),Ae(this).data(Ne,n)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return Re}},{key:"NAME",get:function(){return De}},{key:"DATA_KEY",get:function(){return Ne}},{key:"Event",get:function(){return Ke}},{key:"EVENT_KEY",get:function(){return Oe}},{key:"DefaultType",get:function(){return xe}}]),o}(ri),Ae.fn[De]=Ue._jQueryInterface,Ae.fn[De].Constructor=Ue,Ae.fn[De].noConflict=function(){return Ae.fn[De]=ke,Ue._jQueryInterface},Qe=$,Ve="scrollspy",Be="."+(Fe="bs.scrollspy"),$e=Qe.fn[Ve],Ye={offset:10,method:"auto",target:""},ze={offset:"number",method:"string",target:"(string|element)"},Ge={ACTIVATE:"activate"+Be,SCROLL:"scroll"+Be,LOAD_DATA_API:"load"+Be+".data-api"},Ze="dropdown-item",Xe="active",qe={DATA_SPY:'[data-spy="scroll"]',ACTIVE:".active",NAV_LIST_GROUP:".nav, .list-group",NAV_LINKS:".nav-link",NAV_ITEMS:".nav-item",LIST_ITEMS:".list-group-item",DROPDOWN:".dropdown",DROPDOWN_ITEMS:".dropdown-item",DROPDOWN_TOGGLE:".dropdown-toggle"},Je="offset",tn="position",en=function(){function o(t,e){var n=this;i(this,o),this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" "+qe.NAV_LINKS+","+this._config.target+" "+qe.LIST_ITEMS+","+this._config.target+" "+qe.DROPDOWN_ITEMS,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,Qe(this._scrollElement).on(Ge.SCROLL,function(t){return n._process(t)}),this.refresh(),this._process()}return o.prototype.refresh=function(){var t=this,e=this._scrollElement===this._scrollElement.window?Je:tn,n="auto"===this._config.method?e:this._config.method,i=n===tn?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),Qe.makeArray(Qe(this._selector)).map(function(t){var e=void 0,o=si.getSelectorFromElement(t);if(o&&(e=Qe(o)[0]),e){var s=e.getBoundingClientRect();if(s.width||s.height)return[Qe(e)[n]().top+i,o]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(e){t._offsets.push(e[0]),t._targets.push(e[1])})},o.prototype.dispose=function(){Qe.removeData(this._element,Fe),Qe(this._scrollElement).off(Be),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},o.prototype._getConfig=function(t){if("string"!=typeof(t=e({},Ye,t)).target){var n=Qe(t.target).attr("id");n||(n=si.getUID(Ve),Qe(t.target).attr("id",n)),t.target="#"+n}return si.typeCheckConfig(Ve,t,ze),t},o.prototype._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},o.prototype._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},o.prototype._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},o.prototype._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&(void 0===this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}}},o.prototype._activate=function(t){this._activeTarget=t,this._clear();var e=this._selector.split(",");e=e.map(function(e){return e+'[data-target="'+t+'"],'+e+'[href="'+t+'"]'});var n=Qe(e.join(","));n.hasClass(Ze)?(n.closest(qe.DROPDOWN).find(qe.DROPDOWN_TOGGLE).addClass(Xe),n.addClass(Xe)):(n.addClass(Xe),n.parents(qe.NAV_LIST_GROUP).prev(qe.NAV_LINKS+", "+qe.LIST_ITEMS).addClass(Xe),n.parents(qe.NAV_LIST_GROUP).prev(qe.NAV_ITEMS).children(qe.NAV_LINKS).addClass(Xe)),Qe(this._scrollElement).trigger(Ge.ACTIVATE,{relatedTarget:t})},o.prototype._clear=function(){Qe(this._selector).filter(qe.ACTIVE).removeClass(Xe)},o._jQueryInterface=function(e){return this.each(function(){var n=Qe(this).data(Fe),i="object"===(void 0===e?"undefined":t(e))&&e;if(n||(n=new o(this,i),Qe(this).data(Fe,n)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]()}})},n(o,null,[{key:"VERSION",get:function(){return"4.0.0"}},{key:"Default",get:function(){return Ye}}]),o}(),Qe(window).on(Ge.LOAD_DATA_API,function(){for(var t=Qe.makeArray(Qe(qe.DATA_SPY)),e=t.length;e--;){var n=Qe(t[e]);en._jQueryInterface.call(n,n.data())}}),Qe.fn[Ve]=en._jQueryInterface,Qe.fn[Ve].Constructor=en,Qe.fn[Ve].noConflict=function(){return Qe.fn[Ve]=$e,en._jQueryInterface},nn=$,sn="."+(on="bs.tab"),rn=nn.fn.tab,an={HIDE:"hide"+sn,HIDDEN:"hidden"+sn,SHOW:"show"+sn,SHOWN:"shown"+sn,CLICK_DATA_API:"click"+sn+".data-api"},ln="dropdown-menu",hn="active",cn="disabled",un="fade",fn="show",dn=".dropdown",_n=".nav, .list-group",pn=".active",gn="> li > .active",mn='[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',vn=".dropdown-toggle",yn="> .dropdown-menu .active",En=function(){function t(e){i(this,t),this._element=e}return t.prototype.show=function(){var t=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&nn(this._element).hasClass(hn)||nn(this._element).hasClass(cn))){var e=void 0,n=void 0,i=nn(this._element).closest(_n)[0],o=si.getSelectorFromElement(this._element);if(i){var s="UL"===i.nodeName?gn:pn;n=(n=nn.makeArray(nn(i).find(s)))[n.length-1]}var r=nn.Event(an.HIDE,{relatedTarget:this._element}),a=nn.Event(an.SHOW,{relatedTarget:n});if(n&&nn(n).trigger(r),nn(this._element).trigger(a),!a.isDefaultPrevented()&&!r.isDefaultPrevented()){o&&(e=nn(o)[0]),this._activate(this._element,i);var l=function(){var e=nn.Event(an.HIDDEN,{relatedTarget:t._element}),i=nn.Event(an.SHOWN,{relatedTarget:n});nn(n).trigger(e),nn(t._element).trigger(i)};e?this._activate(e,e.parentNode,l):l()}}},t.prototype.dispose=function(){nn.removeData(this._element,on),this._element=null},t.prototype._activate=function(t,e,n){var i=this,o=("UL"===e.nodeName?nn(e).find(gn):nn(e).children(pn))[0],s=n&&si.supportsTransitionEnd()&&o&&nn(o).hasClass(un),r=function(){return i._transitionComplete(t,o,n)};o&&s?nn(o).one(si.TRANSITION_END,r).emulateTransitionEnd(150):r()},t.prototype._transitionComplete=function(t,e,n){if(e){nn(e).removeClass(fn+" "+hn);var i=nn(e.parentNode).find(yn)[0];i&&nn(i).removeClass(hn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}if(nn(t).addClass(hn),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),si.reflow(t),nn(t).addClass(fn),t.parentNode&&nn(t.parentNode).hasClass(ln)){var o=nn(t).closest(dn)[0];o&&nn(o).find(vn).addClass(hn),t.setAttribute("aria-expanded",!0)}n&&n()},t._jQueryInterface=function(e){return this.each(function(){var n=nn(this),i=n.data(on);if(i||(i=new t(this),n.data(on,i)),"string"==typeof e){if(void 0===i[e])throw new TypeError('No method named "'+e+'"');i[e]()}})},n(t,null,[{key:"VERSION",get:function(){return"4.0.0"}}]),t}(),nn(document).on(an.CLICK_DATA_API,mn,function(t){t.preventDefault(),En._jQueryInterface.call(nn(this),"show")}),nn.fn.tab=En._jQueryInterface,nn.fn.tab.Constructor=En,nn.fn.tab.noConflict=function(){return nn.fn.tab=rn,En._jQueryInterface},function(e){var n=function t(n,i){this.options=e.extend({},t.DEFAULTS,i),this.$target=e(this.options.target).on("scroll.bs.affix.data-api",e.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",e.proxy(this.checkPositionWithEventLoop,this)),this.$element=e(n),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};function i(i){return this.each(function(){var o=e(this),s=o.data("bs.affix"),r="object"==(void 0===i?"undefined":t(i))&&i;s||o.data("bs.affix",s=new n(this,r)),"string"==typeof i&&s[i]()})}n.VERSION="3.3.6",n.RESET="affix affix-top affix-bottom",n.DEFAULTS={offset:0,target:window},n.prototype.getState=function(t,e,n,i){var o=this.$target.scrollTop(),s=this.$element.offset(),r=this.$target.height();if(null!=n&&"top"==this.affixed)return o<n&&"top";if("bottom"==this.affixed)return null!=n?!(o+this.unpin<=s.top)&&"bottom":!(o+r<=t-i)&&"bottom";var a=null==this.affixed,l=a?o:s.top;return null!=n&&o<=n?"top":null!=i&&l+(a?r:e)>=t-i&&"bottom"},n.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(n.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},n.prototype.checkPositionWithEventLoop=function(){setTimeout(e.proxy(this.checkPosition,this),1)},n.prototype.checkPosition=function(){if(this.$element.is(":visible")){var i=this.$element.height(),o=this.options.offset,s=o.top,r=o.bottom,a=Math.max(e(document).height(),e(document.body).height());"object"!=(void 0===o?"undefined":t(o))&&(r=s=o),"function"==typeof s&&(s=o.top(this.$element)),"function"==typeof r&&(r=o.bottom(this.$element));var l=this.getState(a,i,s,r);if(this.affixed!=l){null!=this.unpin&&this.$element.css("top","");var h="affix"+(l?"-"+l:""),c=e.Event(h+".bs.affix");if(this.$element.trigger(c),c.isDefaultPrevented())return;this.affixed=l,this.unpin="bottom"==l?this.getPinnedOffset():null,this.$element.removeClass(n.RESET).addClass(h).trigger(h.replace("affix","affixed")+".bs.affix")}"bottom"==l&&this.$element.offset({top:a-i-r})}};var o=e.fn.affix;e.fn.affix=i,e.fn.affix.Constructor=n,e.fn.affix.noConflict=function(){return e.fn.affix=o,this},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},null!=n.offsetBottom&&(n.offset.bottom=n.offsetBottom),null!=n.offsetTop&&(n.offset.top=n.offsetTop),i.call(t,n)})})}(jQuery),Tn=jQuery,Cn="enter",bn="."+(In="bs.enter"),wn=Tn.fn[Cn],Sn={SCROLL:"scroll"+bn,ENTER:"enter"+bn},An={easing:"cubic-bezier(.2,.7,.5,1)",duration:1200,delay:0},Dn=function(){function e(t,n){i(this,e),si.supportsTransitionEnd()&&(this._element=t,this._config=n,this._handler=null,this._listener=null,this._addEventListeners())}return e.prototype.dispose=function(){Tn(this._element).off(bn),Tn.removeData(this._element,In),this._element=null,this._config=null,this._handler=null,this._listener=null},e.prototype._addEventListeners=function(){var t=Tn.proxy(this._checkForEnter,this);this._handler=function(){window.requestAnimationFrame(t)},this._listener=Tn(window).on(Sn.SCROLL,this._handler),this._checkForEnter()},e.prototype._removeEventListeners=function(){Tn(window).off(Sn.SCROLL,this._handler)},e.prototype._checkForEnter=function(){window.innerHeight-this._element.getBoundingClientRect().top>=0&&setTimeout(Tn.proxy(this._triggerEntrance,this),this._config.delay)},e.prototype._triggerEntrance=function(){this._removeEventListeners(),Tn(this._element).css({"-webkit-transition":"-webkit-transform "+this._config.duration+"ms "+this._config.easing,"-ms-transition":"-ms-transform "+this._config.duration+"ms "+this._config.easing,transition:"transform "+this._config.duration+"ms "+this._config.easing}).css({"-webkit-transform":"none","-ms-transform":"none",transform:"none"}).trigger(Sn.ENTER)},e._jQueryInterface=function(n){return this.each(function(){var i=Tn(this),o=i.data(In),s=Tn.extend({},An,i.data(),"object"==(void 0===n?"undefined":t(n))&&n);o||i.data(In,o=new e(this,s)),"string"==typeof n&&o[n]()})},n(e,null,[{key:"VERSION",get:function(){return"v4.0.0"}},{key:"Default",get:function(){return An}}]),e}(),Tn.fn[Cn]=Dn._jQueryInterface,Tn.fn[Cn].Constructor=Dn,Tn.fn[Cn].noConflict=function(){return Tn.fn[Cn]=wn,Dn._jQueryInterface},Tn(function(){Tn('[data-transition="entrance"]').enter()}),Dn);Nn=jQuery,On="imageGrid",Pn="."+(kn="bs.image-grid"),Ln=Nn.fn[On],Rn={padding:10,targetHeight:300,display:"inline-block"},xn={RESIZE:"resize"+Pn},jn=function(){function e(t,n){i(this,e),this._cleanWhitespace(t),this._row=0,this._rownum=1,this._elements=[],this._element=t,this._albumWidth=Nn(t).width(),this._images=Nn(t).children(),this._config=Nn.extend({},Rn,n),Nn(window).on(xn.RESIZE,Nn.proxy(this._handleResize,this)),this._processImages()}return e.prototype.dispose=function(){Nn(window).off(Pn),Nn.removeData(this._element,kn),this._row=null,this._rownum=null,this._elements=null,this._element=null,this._albumWidth=null,this._images=null,this._config=null},e.prototype._handleResize=function(){this._row=0,this._rownum=1,this._elements=[],this._albumWidth=Nn(this._element).width(),this._images=Nn(this._element).children(),this._processImages()},e.prototype._processImages=function(){var t=this;this._images.each(function(e){var n=Nn(this),i=n.is("img")?n:n.find("img"),o=void 0!==i.data("width")?i.data("width"):i.width(),s=void 0!==i.data("height")?i.data("height"):i.height();i.data("width",o),i.data("height",s);var r=Math.ceil(o/s*t._config.targetHeight),a=Math.ceil(t._config.targetHeight);t._elements.push([this,r,a]),t._row+=r+t._config.padding,t._row>t._albumWidth&&t._elements.length&&(t._resizeRow(t._row-t._config.padding),t._row=0,t._elements=[],t._rownum+=1),t._images.length-1==e&&t._elements.length&&(t._resizeRow(t._row),t._row=0,t._elements=[],t._rownum+=1)})},e.prototype._resizeRow=function(t){for(var e=this._config.padding*(this._elements.length-1),n=(this._albumWidth-e)/(t-e),i=e,o=(this._albumWidth,0);o<this._elements.length;o++){var s=Nn(this._elements[o][0]),r=Math.floor(this._elements[o][1]*n),a=Math.floor(this._elements[o][2]*n),l=o<this._elements.length-1;i+=r,!l&&i<this._albumWidth&&(r+=this._albumWidth-i),r--;var h=s.is("img")?s:s.find("img");h.width(r),h.height(a),this._applyModifications(s,l)}},e.prototype._applyModifications=function(t,e){var n={"margin-bottom":this._config.padding+"px","margin-right":e?this._config.padding+"px":0,display:this._config.display,"vertical-align":"bottom"};t.css(n)},e.prototype._cleanWhitespace=function(t){Nn(t).contents().filter(function(){return 3==this.nodeType&&!/\S/.test(this.nodeValue)}).remove()},e._jQueryInterface=function(n){return this.each(function(){var n=Nn(this),i=n.data(kn),o=Nn.extend({},Rn,n.data(),"object"===(void 0===o?"undefined":t(o))&&o);i||n.data(kn,i=new e(this,o)),"string"==typeof o&&i[o].call(n)})},e}(),Nn.fn[On]=jn._jQueryInterface,Nn.fn[On].Constructor=jn,Nn.fn[On].noConflict=function(){return Nn.fn[On]=Ln,ai._jQueryInterface},Nn(function(){Nn('[data-grid="images"]').imageGrid()}),Wn=jQuery,Hn="stage",Kn="."+(Mn="bs.stage"),Un=Wn.fn[Hn],Qn={easing:"cubic-bezier(.2,.7,.5,1)",duration:300,delay:0,distance:250,hiddenElements:"#sidebar"},Vn={TOUCHMOVE:"touchmove"+Kn,KEYDOWN:"keydown"+Kn,OPEN:"open"+Kn,OPENED:"opened"+Kn,CLOSE:"close"+Kn,CLOSED:"closed"+Kn,CLICK:"click"+Kn,CLICK_DATA_API:"click"+Kn+".data-api"},Fn="stage-open",Bn="hidden",$n=function(){function e(t,n){i(this,e),si.supportsTransitionEnd()&&(this._element=t,this._config=n)}return e.prototype._isOpen=function(){return Wn(this._element).hasClass(Fn)},e.prototype._complete=function(){Wn(document.body).css("overflow","auto"),"ontouchstart"in document.documentElement&&Wn(document).off(Vn.TOUCHMOVE),Wn(this._config.hiddenElements).addClass(Bn),Wn(this._element).removeClass(Fn).css({"-webkit-transition":"","-ms-transition":"",transition:""}).css({"-webkit-transform":"","-ms-transform":"",transform:""}).trigger(Vn.CLOSED)},e.prototype.toggle=function(){this._isOpen()?this.close():this.open()},e.prototype.open=function(){var t=this;Wn(document.body).css("overflow","hidden"),"ontouchstart"in document.documentElement&&Wn(document).on(Vn.TOUCHMOVE,function(t){t.preventDefault()}),Wn(this._config.hiddenElements).removeClass(Bn),Wn(window).one(Vn.KEYDOWN,Wn.proxy(function(t){27==t.which&&this.close()},this)),Wn(this._element).on(Vn.CLICK,Wn.proxy(this.close,this)).trigger(Vn.OPEN).addClass(Fn),si.supportsTransitionEnd()?(Wn(this._element).css({"-webkit-transition":"-webkit-transform "+this._config.duration+"ms "+this._config.easing,"-ms-transition":"-ms-transform "+this._config.duration+"ms "+this._config.easing,transition:"transform "+this._config.duration+"ms "+this._config.easing}),this._element.offsetWidth,Wn(this._element).css({"-webkit-transform":"translateX("+this._config.distance+"px)","-ms-transform":"translateX("+this._config.distance+"px)",transform:"translateX("+this._config.distance+"px)"}).one(si.TRANSITION_END,function(){Wn(t._element).trigger(Vn.OPENED)}).emulateTransitionEnd(this._config.duration)):Wn(this._element).css({left:this._config.distance+"px",position:"relative"}).trigger(Vn.OPENED)},e.prototype.close=function(){if(Wn(window).off(Vn.KEYDOWN),!si.supportsTransitionEnd())return Wn(this._element).trigger(Vn.CLOSE).css({left:"",position:""}).off(Vn.CLICK),this._complete();Wn(this._element).trigger(Vn.CLOSE).off(Vn.CLICK).css({"-webkit-transform":"none","-ms-transform":"none",transform:"none"}).one(si.TRANSITION_END,Wn.proxy(this._complete,this)).emulateTransitionEnd(this._config.duration)},e._jQueryInterface=function(n){return this.each(function(){var i=Wn(this),o=i.data(Mn),s=Wn.extend({},Qn,i.data(),"object"===(void 0===n?"undefined":t(n))&&n);o||i.data(Mn,o=new e(this,s)),"string"==typeof n&&o[n]()})},n(e,null,[{key:"VERSION",get:function(){return"v4.0.0"}},{key:"Default",get:function(){return Qn}}]),e}(),Wn.fn[Hn]=$n._jQueryInterface,Wn.fn[Hn].Constructor=$n,Wn.fn[Hn].noConflict=function(){return Wn.fn[Hn]=Un,$n._jQueryInterface},Wn(document).on(Vn.CLICK_DATA_API,'[data-toggle="stage"]',function(){var t=Wn(this).data(),e=Wn(this.getAttribute("data-target"));e.data(Mn)||e.stage(t),e.stage("toggle")}),Yn=jQuery,zn=".bs.zoom",Yn.fn.zoom,Gn={CLICK:"click"+zn,SCROLL:"scroll"+zn,KEYUP:"keyup"+zn,TOUCHSTART:"touchstart"+zn,TOUCHMOVE:"touchmove"+zn},Zn="zoom-overlay-open",Xn="zoom-overlay-transitioning",qn="zoom-overlay",Jn="zoom-img-wrap",ti="zoom-img",ei="zoom",ni="zoom-out",ii=function(){function t(e,n){i(this,t),this._activeZoom=null,this._initialScrollPosition=null,this._initialTouchPosition=null,this._touchMoveListener=null,this._$document=Yn(document),this._$window=Yn(window),this._$body=Yn(document.body),this._boundClick=Yn.proxy(this._clickHandler,this)}return t.prototype._zoom=function(t){var e=t.target;if(e&&"IMG"===e.tagName&&!this._$body.hasClass(Zn))return t.metaKey||t.ctrlKey?window.open(t.target.getAttribute("data-original")||t.target.src,"_blank"):void(e.width>=Yn(window).width()-80||(this._activeZoomClose(!0),this._activeZoom=new oi(e),this._activeZoom.zoomImage(),this._$window.on(Gn.SCROLL,Yn.proxy(this._scrollHandler,this)),this._$document.on(Gn.KEYUP,Yn.proxy(this._keyHandler,this)),this._$document.on(Gn.TOUCHSTART,Yn.proxy(this._touchStart,this)),document.addEventListener?document.addEventListener("click",this._boundClick,!0):document.attachEvent("onclick",this._boundClick,!0),"bubbles"in t?t.bubbles&&t.stopPropagation():t.cancelBubble=!0))},t.prototype._activeZoomClose=function(t){this._activeZoom&&(t?this._activeZoom.dispose():this._activeZoom.close(),this._$window.off(zn),this._$document.off(zn),document.removeEventListener("click",this._boundClick,!0),this._activeZoom=null)},t.prototype._scrollHandler=function(t){null===this._initialScrollPosition&&(this._initialScrollPosition=Yn(window).scrollTop());var e=this._initialScrollPosition-Yn(window).scrollTop();Math.abs(e)>=40&&this._activeZoomClose()},t.prototype._keyHandler=function(t){27===t.keyCode&&this._activeZoomClose()},t.prototype._clickHandler=function(t){t.preventDefault?t.preventDefault():event.returnValue=!1,"bubbles"in t?t.bubbles&&t.stopPropagation():t.cancelBubble=!0,this._activeZoomClose()},t.prototype._touchStart=function(t){this._initialTouchPosition=t.touches[0].pageY,Yn(t.target).on(Gn.TOUCHMOVE,Yn.proxy(this._touchMove,this))},t.prototype._touchMove=function(t){Math.abs(t.touches[0].pageY-this._initialTouchPosition)>10&&(this._activeZoomClose(),Yn(t.target).off(Gn.TOUCHMOVE))},t.prototype.listen=function(){this._$body.on(Gn.CLICK,'[data-action="zoom"]',Yn.proxy(this._zoom,this))},n(t,null,[{key:"VERSION",get:function(){return"v4.0.0"}},{key:"Default",get:function(){return Default}}]),t}(),oi=function(){function t(e){i(this,t),this._fullHeight=null,this._fullWidth=null,this._overlay=null,this._targetImageWrap=null,this._targetImage=e,this._$body=Yn(document.body)}return t.prototype.zoomImage=function(){var t=document.createElement("img");t.onload=Yn.proxy(function(){this._fullHeight=Number(t.height),this._fullWidth=Number(t.width),this._zoomOriginal()},this),t.src=this._targetImage.src},t.prototype._zoomOriginal=function(){this._targetImageWrap=document.createElement("div"),this._targetImageWrap.className=Jn,this._targetImage.parentNode.insertBefore(this._targetImageWrap,this._targetImage),this._targetImageWrap.appendChild(this._targetImage),Yn(this._targetImage).addClass(ti).attr("data-action",ni),this._overlay=document.createElement("div"),this._overlay.className=qn,document.body.appendChild(this._overlay),this._calculateZoom(),this._triggerAnimation()},t.prototype._calculateZoom=function(){this._targetImage.offsetWidth;var t=this._fullWidth,e=this._fullHeight,n=(Yn(window).scrollTop(),t/this._targetImage.width),i=Yn(window).height()-80,o=Yn(window).width()-80,s=t/e,r=o/i;this._imgScaleFactor=t<o&&e<i?n:s<r?i/e*n:o/t*n},t.prototype._triggerAnimation=function(){this._targetImage.offsetWidth;var t=Yn(this._targetImage).offset(),e=Yn(window).scrollTop()+Yn(window).height()/2,n=Yn(window).width()/2,i=t.top+this._targetImage.height/2,o=t.left+this._targetImage.width/2;this._translateY=e-i,this._translateX=n-o;var s="scale("+this._imgScaleFactor+")",r="translate("+this._translateX+"px, "+this._translateY+"px)";si.supportsTransitionEnd()||(r+=" translateZ(0)"),Yn(this._targetImage).css({"-webkit-transform":s,"-ms-transform":s,transform:s}),Yn(this._targetImageWrap).css({"-webkit-transform":r,"-ms-transform":r,transform:r}),this._$body.addClass(Zn)},t.prototype.close=function(){if(this._$body.removeClass(Zn).addClass(Xn),Yn(this._targetImage).css({"-webkit-transform":"","-ms-transform":"",transform:""}),Yn(this._targetImageWrap).css({"-webkit-transform":"","-ms-transform":"",transform:""}),!si.supportsTransitionEnd())return this.dispose();Yn(this._targetImage).one(si.TRANSITION_END,Yn.proxy(this.dispose,this)).emulateTransitionEnd(300)},t.prototype.dispose=function(){this._targetImageWrap&&this._targetImageWrap.parentNode&&(Yn(this._targetImage).removeClass(ti).attr("data-action",ei),this._targetImageWrap.parentNode.replaceChild(this._targetImage,this._targetImageWrap),this._overlay.parentNode.removeChild(this._overlay),this._$body.removeClass(Xn))},t}(),Yn(function(){(new ii).listen()})}();
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//






$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
;
