/*!
 * jQuery Custom Protocol Launcher v0.0.1
 * https://github.com/sethcall/jquery-custom-protocol
 *
 * Taken and modified from:
 * https://gist.github.com/rajeshsegu/3716941
 * http://stackoverflow.com/a/22055638/834644
 *
 * Depends on:
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Modifications Copyright 2014 Seth Call
 * https://github.com/sethcall
 *
 * Released under the MIT license
 */

(function (jQuery, window, undefined) {
  "use strict";

  function launchCustomProtocol(elem, url, options) {
    var myWindow, success = false;

    if (!url) {
      throw "attribute 'href' must be specified on the element, or specified in options"
    }
    if (!options.callback) {
      throw "Specify 'callback' as an option to $.customProtocol";
    }

    var settings = $.extend({}, options);

    var callback = settings.callback;

    if ($.browser.msie) {
      return ieTest(elem, url, callback);
    }
    else if ($.browser.mozilla) {
      return iframeTest(elem, url, callback);
    }
    else if ($.browser.chrome) {
      return blurTest(elem, url, callback);
    }
  }

  function blurTest(elem, url, callback) {
    var timeout = null;
    // If focus is taken, assume a launch dialog was shown
    elem.css({"outline": 0});
    elem.attr("tabindex", "1");
    elem.focus();

    function cleanup() {
      elem.off('blur');
      elem.removeAttr("tabindex");
      if(timeout) {
        clearTimeout(timeout)
        timeout = null;
      }
    }
    elem.blur(function () {
      cleanup();
      callback(true);
    });

    location.replace(url);

    timeout = setTimeout(function () {
      timeout = null;
      cleanup();
      callback(false);
    }, 1000);

    return false;
  }

  function iframeTest(elem, url, callback) {
    var iframe, success = false;

    try {
      iframe = $("<iframe />");
      iframe.css({"display": "none"});
      iframe.appendTo("body");
      iframe[0].contentWindow.location.href = url;
      success = true;
    } catch (ex) {
      success = false;
    }

    if(iframe) iframe.remove();

    callback(success);

    return false;
  }

  function ieTest(elem, url, callback) {
    var success = false;

    if (navigator.msLaunchUri) {
      // use msLaunchUri if available. IE10+
      navigator.msLaunchUri(
        url,
        function () {
          callback(true);
        },
        function () {
          callback(false);
        }
      );
    }

    return false;
  }

  function supportedBrowser() {
    return $.browser.desktop && (navigator.msLaunchUri || $.browser.chrome || $.browser.mozilla);
  }

  $.fn.customProtocol = function (options) {
    this.each(function () {
      var $elem = $(this);

      if(supportedBrowser()) {
        $elem.click(function (e) {
          return launchCustomProtocol($elem, options.href || $elem.attr('href'), options);
        });
      }
      else {
        if(options && options.fallback) {
          options.fallback.call($elem)
          return;
        }
      }
    })

  }

})(jQuery, window);
