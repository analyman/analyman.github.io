(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.toc_switcher = exports.toc_container = exports.goto_top = exports.category_button = exports.tags_button = exports.about_button = exports.github_button = exports.archive_button = exports.home_button = exports.in_about_section = exports.in_page_seciton = exports.in_post_section = exports.in_tag_section = exports.in_home_section = exports.in_category_section = exports.in_archive_section = void 0;
/** identify current section */
exports.in_archive_section = document.getElementById("archives-click") != null;
exports.in_category_section = document.getElementById("category-click") != null;
exports.in_home_section = document.getElementById("home-click") != null;
exports.in_tag_section = document.getElementById("tag-click") != null;
exports.in_post_section = document.getElementById("post-click") != null;
exports.in_page_seciton = exports.in_post_section;
exports.in_about_section = false;
/** buttons */
exports.home_button = document.getElementById("home-button");
exports.archive_button = document.getElementById("archive-button");
exports.github_button = document.getElementById("github-button");
exports.about_button = document.getElementById("about-button");
/** general elements */
exports.tags_button = document.getElementById("sidebar-tags-elem");
exports.category_button = document.getElementById("sidebar-categories-elem");
/** goto top */
exports.goto_top = document.getElementById("goto-top-elem");
/** toc container */
exports.toc_container = document.getElementById("post-toc");
exports.toc_switcher = document.getElementById("post-toc-switcher");

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.do_misc = void 0;
var gl = require("./global");
var utils = require("./utils");
function select_section() {
    if (gl.in_home_section)
        gl.home_button.classList.add("active");
    if (gl.in_archive_section)
        gl.archive_button.classList.add("active");
    if (gl.in_about_section)
        gl.about_button.classList.add("active");
}
function do_misc() {
    utils.register_function_call(select_section);
    /** tags and categories toggle */
    utils.register_function_call(function () {
        gl.tags_button.addEventListener("click", function (ev) {
            this.classList.toggle("click-show");
        });
        gl.category_button.addEventListener("click", function () {
            this.classList.toggle("click-show");
        });
    });
    /** goto top handler */
    utils.register_function_call(function () {
        utils.timeout_add_class(gl.goto_top, "hide", true, 3000, function (e, func) {
            document.addEventListener("scroll", function (ev) {
                func();
            });
        });
    });
}
exports.do_misc = do_misc;

},{"./global":1,"./utils":3}],3:[function(require,module,exports){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.text2html = exports.timeout_add_class = exports.timeout_remove_class = exports.call_register_functions = exports.register_function_call = exports.assert_expr = exports.debug = void 0;
function getCaller() {
    var reg = /\s+at (\S+)( \(([^)]+)\))?/g;
    var ee;
    try {
        throw new Error();
    }
    catch (e) {
        ee = e.stack;
    }
    reg.exec(ee);
    reg.exec(ee);
    var mm = reg.exec(ee);
    if (!mm)
        return null;
    return [mm[3] || "", mm[1]];
}
; //}
function debug() {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    var caller = getCaller();
    var msg = "debug message";
    msg = caller ? "[" + caller[1] + " (" + caller[0] + ")]: " : "[" + msg + "]: ";
    console.debug.apply(console, __spreadArray([msg], argv));
} //}
exports.debug = debug;
function assert_expr(v, err) {
    if (err === void 0) { err = "assert fail"; }
    if (v)
        return;
    var caller = getCaller();
    var msg = caller ? "[" + caller[1] + " (" + caller[0] + ")]: " : "[" + err + "]: ";
    throw msg;
} //}
exports.assert_expr = assert_expr;
var callback_stack = [];
function register_function_call(func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    assert_expr(typeof (func) === 'function');
    callback_stack.push([func, args]);
}
exports.register_function_call = register_function_call;
function call_register_functions() {
    var _a;
    while (callback_stack.length > 0) {
        var fa = callback_stack.pop();
        try {
            (_a = fa[0]).call.apply(_a, __spreadArray([window], fa[1]));
        }
        catch (err) {
            console.error(err);
        }
    }
}
exports.call_register_functions = call_register_functions;
/** when the timer expires just remove the class */
function timeout_remove_class(elem, has, cls, time_ms, when) {
    var added = has;
    var timeout = 0;
    function _remove() {
        elem.classList.remove(cls);
        added = false;
        timeout = 0;
    }
    function _add() {
        if (!added) {
            elem.classList.add(cls);
            added = true;
        }
        else {
            window.clearTimeout(timeout);
        }
        timeout = window.setTimeout(_remove, time_ms);
    }
    when(elem, _add);
}
exports.timeout_remove_class = timeout_remove_class;
/** when the timer expires jsut add the class */
function timeout_add_class(elem, cls, has, time_ms, when) {
    var added = has;
    var timeout = 0;
    function _add() {
        elem.classList.add(cls);
        added = true;
        timeout = 0;
    }
    function _remove() {
        if (added) {
            elem.classList.remove(cls);
            added = false;
        }
        else {
            window.clearTimeout(timeout);
        }
        timeout = window.setTimeout(_add, time_ms);
    }
    when(elem, _remove);
}
exports.timeout_add_class = timeout_add_class;
function text2html(str) {
    var div = document.createElement("div");
    div.innerHTML = str.trim();
    return div.firstChild;
}
exports.text2html = text2html;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvbWlzYy50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSwrQkFBK0I7QUFDbEIsUUFBQSxrQkFBa0IsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3hFLFFBQUEsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN4RSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGNBQWMsR0FBUSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNuRSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGVBQWUsR0FBTyx1QkFBZSxDQUFDO0FBQ3RDLFFBQUEsZ0JBQWdCLEdBQU0sS0FBSyxDQUFDO0FBRXpDLGNBQWM7QUFDRCxRQUFBLFdBQVcsR0FBTSxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELFFBQUEsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCxRQUFBLGFBQWEsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFELFFBQUEsWUFBWSxHQUFLLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFdEUsdUJBQXVCO0FBQ1YsUUFBQSxXQUFXLEdBQU8sUUFBUSxDQUFDLGNBQWMsQ0FB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QWU7SUFDOUQsSUFBSSxLQUFLLEdBQVksR0FBRyxDQUFDO0lBQ3pCLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztJQUN4QixTQUFTLElBQUk7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsU0FBUyxPQUFPO1FBQ1osSUFBRyxLQUFLLEVBQUU7WUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2pCO2FBQU07WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFwQkQsOENBb0JDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLEdBQVc7SUFFakMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixPQUFPLEdBQUcsQ0FBQyxVQUF5QixDQUFDO0FBQ3pDLENBQUM7QUFMRCw4QkFLQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuLyoqIGlkZW50aWZ5IGN1cnJlbnQgc2VjdGlvbiAqL1xuZXhwb3J0IGNvbnN0IGluX2FyY2hpdmVfc2VjdGlvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmVzLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fY2F0ZWdvcnlfc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcnktY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9ob21lX3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fdGFnX3NlY3Rpb24gICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFnLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcG9zdF9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3BhZ2Vfc2VjaXRvbiAgICAgPSBpbl9wb3N0X3NlY3Rpb247XG5leHBvcnQgY29uc3QgaW5fYWJvdXRfc2VjdGlvbiAgICA9IGZhbHNlO1xuXG4vKiogYnV0dG9ucyAqL1xuZXhwb3J0IGNvbnN0IGhvbWVfYnV0dG9uICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhcmNoaXZlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgZ2l0aHViX2J1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdpdGh1Yi1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYWJvdXRfYnV0dG9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFib3V0LWJ1dHRvblwiKTtcblxuLyoqIGdlbmVyYWwgZWxlbWVudHMgKi9cbmV4cG9ydCBjb25zdCB0YWdzX2J1dHRvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItdGFncy1lbGVtXCIpO1xuZXhwb3J0IGNvbnN0IGNhdGVnb3J5X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1jYXRlZ29yaWVzLWVsZW1cIik7XG5cbi8qKiBnb3RvIHRvcCAqL1xuZXhwb3J0IGNvbnN0IGdvdG9fdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb3RvLXRvcC1lbGVtXCIpO1xuXG4vKiogdG9jIGNvbnRhaW5lciAqL1xuZXhwb3J0IGNvbnN0IHRvY19jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtdG9jXCIpO1xuZXhwb3J0IGNvbnN0IHRvY19zd2l0Y2hlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2Mtc3dpdGNoZXJcIik7XG5cbiIsImltcG9ydCAqIGFzIGdsIGZyb20gJy4vZ2xvYmFsJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscydcblxuZnVuY3Rpb24gc2VsZWN0X3NlY3Rpb24oKSB7XG4gICAgaWYgKGdsLmluX2hvbWVfc2VjdGlvbikgICAgZ2wuaG9tZV9idXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICBpZiAoZ2wuaW5fYXJjaGl2ZV9zZWN0aW9uKSBnbC5hcmNoaXZlX2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGlmIChnbC5pbl9hYm91dF9zZWN0aW9uKSAgIGdsLmFib3V0X2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9fbWlzYygpIHtcbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKHNlbGVjdF9zZWN0aW9uKTtcblxuICAgIC8qKiB0YWdzIGFuZCBjYXRlZ29yaWVzIHRvZ2dsZSAqL1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBnbC50YWdzX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJjbGljay1zaG93XCIpO1xuICAgICAgICB9KVxuICAgICAgICBnbC5jYXRlZ29yeV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImNsaWNrLXNob3dcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqIGdvdG8gdG9wIGhhbmRsZXIgKi9cbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgdXRpbHMudGltZW91dF9hZGRfY2xhc3MoZ2wuZ290b190b3AsIFwiaGlkZVwiLCB0cnVlLCAzMDAwLCAoZSwgZnVuYykgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoZXY6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVuYygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbiIsIlxuZnVuY3Rpb24gZ2V0Q2FsbGVyICgpIC8ve1xue1xuICAgIGxldCByZWcgPSAvXFxzK2F0IChcXFMrKSggXFwoKFteKV0rKVxcKSk/L2c7XG4gICAgbGV0IGVlOiBzdHJpbmc7XG4gICAgdHJ5IHt0aHJvdyBuZXcgRXJyb3IoKTt9XG4gICAgY2F0Y2ggKGUpIHtlZSA9IGUuc3RhY2s7fVxuICAgIHJlZy5leGVjKGVlKTtcbiAgICByZWcuZXhlYyhlZSk7XG4gICAgbGV0IG1tID0gcmVnLmV4ZWMoZWUpO1xuICAgIGlmICghbW0pIHJldHVybiBudWxsO1xuICAgIHJldHVybiBbbW1bM10gfHwgXCJcIiwgbW1bMV1dO1xufTsgLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5hcmd2KSAvL3tcbntcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IFwiZGVidWcgbWVzc2FnZVwiO1xuICAgIG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHttc2d9XTogYDtcbiAgICBjb25zb2xlLmRlYnVnKG1zZywgLi4uYXJndik7XG59IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0X2V4cHIodjogYm9vbGVhbiwgZXJyID0gXCJhc3NlcnQgZmFpbFwiKSAvL3tcbntcbiAgICBpZiAodikgcmV0dXJuO1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske2Vycn1dOiBgO1xuICAgIHRocm93IG1zZztcbn0gLy99XG5cbmxldCBjYWxsYmFja19zdGFjazogW0Z1bmN0aW9uLCBhbnlbXV1bXSA9IFtdXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJfZnVuY3Rpb25fY2FsbChmdW5jLCAuLi5hcmdzKSB7XG4gICAgYXNzZXJ0X2V4cHIodHlwZW9mKGZ1bmMpID09PSAnZnVuY3Rpb24nKTtcbiAgICBjYWxsYmFja19zdGFjay5wdXNoKFtmdW5jLCBhcmdzXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsX3JlZ2lzdGVyX2Z1bmN0aW9ucygpIHtcbiAgICB3aGlsZShjYWxsYmFja19zdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBmYSA9IGNhbGxiYWNrX3N0YWNrLnBvcCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmFbMF0uY2FsbCh3aW5kb3csIC4uLmZhWzFdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnR5cGUgaG93dG9jYWxsID0gKGVsZW06IEhUTUxFbGVtZW50LCBhZGRfZnVuYzogKCkgPT4gdm9pZCkgPT4gdm9pZDtcbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGp1c3QgcmVtb3ZlIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfcmVtb3ZlX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogc3RyaW5nLCB0aW1lX21zOiBudW1iZXIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGlmKCFhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfcmVtb3ZlLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9hZGQpO1xufVxuXG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqc3V0IGFkZCB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X2FkZF9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZV9tczogbnVtYmVyLCB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGlmKGFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfYWRkLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9yZW1vdmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dDJodG1sKHN0cjogc3RyaW5nKTogSFRNTEVsZW1lbnQgXG57XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmlubmVySFRNTCA9IHN0ci50cmltKCk7XG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50O1xufVxuXG4iXX0=
