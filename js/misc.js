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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
    console.debug.apply(console, __spreadArrays([msg], argv));
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
            (_a = fa[0]).call.apply(_a, __spreadArrays([window], fa[1]));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvbWlzYy50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSwrQkFBK0I7QUFDbEIsUUFBQSxrQkFBa0IsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3hFLFFBQUEsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN4RSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGNBQWMsR0FBUSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNuRSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGVBQWUsR0FBTyx1QkFBZSxDQUFDO0FBQ3RDLFFBQUEsZ0JBQWdCLEdBQU0sS0FBSyxDQUFDO0FBRXpDLGNBQWM7QUFDRCxRQUFBLFdBQVcsR0FBTSxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELFFBQUEsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCxRQUFBLGFBQWEsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFELFFBQUEsWUFBWSxHQUFLLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFdEUsdUJBQXVCO0FBQ1YsUUFBQSxXQUFXLEdBQU8sUUFBUSxDQUFDLGNBQWMsQ0FB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SUFBZTtJQUM5RCxJQUFJLEtBQUssR0FBWSxHQUFHLENBQUM7SUFDekIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsSUFBSTtRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDYixPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRCxTQUFTLE9BQU87UUFDWixJQUFHLEtBQUssRUFBRTtZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDakI7YUFBTTtZQUNILE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQXBCRCw4Q0FvQkM7QUFFRCxTQUFnQixTQUFTLENBQUMsR0FBVztJQUVqQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDLFVBQXlCLENBQUM7QUFDekMsQ0FBQztBQUxELDhCQUtDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vKiogaWRlbnRpZnkgY3VycmVudCBzZWN0aW9uICovXG5leHBvcnQgY29uc3QgaW5fYXJjaGl2ZV9zZWN0aW9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZXMtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9jYXRlZ29yeV9zZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yeS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2hvbWVfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl90YWdfc2VjdGlvbiAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWctY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wb3N0X3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcGFnZV9zZWNpdG9uICAgICA9IGluX3Bvc3Rfc2VjdGlvbjtcbmV4cG9ydCBjb25zdCBpbl9hYm91dF9zZWN0aW9uICAgID0gZmFsc2U7XG5cbi8qKiBidXR0b25zICovXG5leHBvcnQgY29uc3QgaG9tZV9idXR0b24gICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFyY2hpdmVfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBnaXRodWJfYnV0dG9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2l0aHViLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhYm91dF9idXR0b24gICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWJvdXQtYnV0dG9uXCIpO1xuXG4vKiogZ2VuZXJhbCBlbGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHRhZ3NfYnV0dG9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10YWdzLWVsZW1cIik7XG5leHBvcnQgY29uc3QgY2F0ZWdvcnlfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWNhdGVnb3JpZXMtZWxlbVwiKTtcblxuLyoqIGdvdG8gdG9wICovXG5leHBvcnQgY29uc3QgZ290b190b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvdG8tdG9wLWVsZW1cIik7XG5cbi8qKiB0b2MgY29udGFpbmVyICovXG5leHBvcnQgY29uc3QgdG9jX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2NcIik7XG5leHBvcnQgY29uc3QgdG9jX3N3aXRjaGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvYy1zd2l0Y2hlclwiKTtcblxuIiwiaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuXG5mdW5jdGlvbiBzZWxlY3Rfc2VjdGlvbigpIHtcbiAgICBpZiAoZ2wuaW5faG9tZV9zZWN0aW9uKSAgICBnbC5ob21lX2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGlmIChnbC5pbl9hcmNoaXZlX3NlY3Rpb24pIGdsLmFyY2hpdmVfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgaWYgKGdsLmluX2Fib3V0X3NlY3Rpb24pICAgZ2wuYWJvdXRfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb19taXNjKCkge1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoc2VsZWN0X3NlY3Rpb24pO1xuXG4gICAgLyoqIHRhZ3MgYW5kIGNhdGVnb3JpZXMgdG9nZ2xlICovXG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbCgoKSA9PiB7XG4gICAgICAgIGdsLnRhZ3NfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXY6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImNsaWNrLXNob3dcIik7XG4gICAgICAgIH0pXG4gICAgICAgIGdsLmNhdGVnb3J5X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiY2xpY2stc2hvd1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKiogZ290byB0b3AgaGFuZGxlciAqL1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICB1dGlscy50aW1lb3V0X2FkZF9jbGFzcyhnbC5nb3RvX3RvcCwgXCJoaWRlXCIsIHRydWUsIDMwMDAsIChlLCBmdW5jKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChldjogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBmdW5jKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuIiwiXG5mdW5jdGlvbiBnZXRDYWxsZXIgKCkgLy97XG57XG4gICAgbGV0IHJlZyA9IC9cXHMrYXQgKFxcUyspKCBcXCgoW14pXSspXFwpKT8vZztcbiAgICBsZXQgZWU6IHN0cmluZztcbiAgICB0cnkge3Rocm93IG5ldyBFcnJvcigpO31cbiAgICBjYXRjaCAoZSkge2VlID0gZS5zdGFjazt9XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIHJlZy5leGVjKGVlKTtcbiAgICBsZXQgbW0gPSByZWcuZXhlYyhlZSk7XG4gICAgaWYgKCFtbSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIFttbVszXSB8fCBcIlwiLCBtbVsxXV07XG59OyAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3YpIC8ve1xue1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gXCJkZWJ1ZyBtZXNzYWdlXCI7XG4gICAgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske21zZ31dOiBgO1xuICAgIGNvbnNvbGUuZGVidWcobXNnLCAuLi5hcmd2KTtcbn0gLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfZXhwcih2OiBib29sZWFuLCBlcnIgPSBcImFzc2VydCBmYWlsXCIpIC8ve1xue1xuICAgIGlmICh2KSByZXR1cm47XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7ZXJyfV06IGA7XG4gICAgdGhyb3cgbXNnO1xufSAvL31cblxubGV0IGNhbGxiYWNrX3N0YWNrOiBbRnVuY3Rpb24sIGFueVtdXVtdID0gW11cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKGZ1bmMsIC4uLmFyZ3MpIHtcbiAgICBhc3NlcnRfZXhwcih0eXBlb2YoZnVuYykgPT09ICdmdW5jdGlvbicpO1xuICAgIGNhbGxiYWNrX3N0YWNrLnB1c2goW2Z1bmMsIGFyZ3NdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxfcmVnaXN0ZXJfZnVuY3Rpb25zKCkge1xuICAgIHdoaWxlKGNhbGxiYWNrX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGZhID0gY2FsbGJhY2tfc3RhY2sucG9wKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmYVswXS5jYWxsKHdpbmRvdywgLi4uZmFbMV0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudHlwZSBob3d0b2NhbGwgPSAoZWxlbTogSFRNTEVsZW1lbnQsIGFkZF9mdW5jOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganVzdCByZW1vdmUgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9yZW1vdmVfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBzdHJpbmcsIHRpbWVfbXM6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgaWYoIWFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9yZW1vdmUsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX2FkZCk7XG59XG5cbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGpzdXQgYWRkIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfYWRkX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBjbHM6IHN0cmluZywgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX21zOiBudW1iZXIsIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgaWYoYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9hZGQsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX3JlbW92ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0Mmh0bWwoc3RyOiBzdHJpbmcpOiBIVE1MRWxlbWVudCBcbntcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyLnRyaW0oKTtcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbiJdfQ==
