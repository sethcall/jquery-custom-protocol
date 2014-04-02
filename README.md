Overview
========

Use this plugin to handle click events on *a* tags with a custom protocol URL.

These two snippets inspired the initial code:
 * https://gist.github.com/rajeshsegu/3716941
 * http://stackoverflow.com/a/22055638/834644

Requires jquery.browser.js (https://github.com/gabceb/jquery-browser-plugin)

Browsers supported (desktop only):
* Chrome
* Firefox
* IE10, IE11

Usage
=====
```
<a href="customprotocol:">Click Me</a>
```

```
$('a').customProtocol({
  callback: function(success) {
     // if success == true, then the user clicked the link, and the application had the chance to launch.
     // if success == false, the protocol is not working on the user's computer
  },
  fallback: function() {
     // called immediately if the current browser is not supported by this plugin
  }
});
```
