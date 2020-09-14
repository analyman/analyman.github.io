(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.goto_top = exports.category_button = exports.tags_button = exports.about_button = exports.github_button = exports.archive_button = exports.home_button = exports.in_about_section = exports.in_page_seciton = exports.in_post_section = exports.in_tag_section = exports.in_home_section = exports.in_category_section = exports.in_archive_section = void 0;
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
    var goto_top_showed = false;
    var goto_top_timeout = 0;
    function hide_goto_top() {
        gl.goto_top.classList.add("hide");
        goto_top_showed = false;
        goto_top_timeout = 0;
    }
    function show_goto_top() {
        if (!goto_top_showed) {
            gl.goto_top.classList.remove("hide");
            goto_top_showed = true;
        }
        else {
            window.clearTimeout(goto_top_timeout);
        }
        goto_top_timeout = window.setTimeout(hide_goto_top, 3000);
    }
    /** goto top handler */
    utils.register_function_call(function () {
        show_goto_top();
        document.addEventListener("scroll", function (ev) {
            show_goto_top();
        });
    });
}
exports.do_misc = do_misc;

},{"./global":1,"./utils":4}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var utils = require("./utils");
var misc_1 = require("./misc");
misc_1.do_misc();
utils.call_register_functions();

},{"./misc":2,"./utils":4}],4:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.call_register_functions = exports.register_function_call = exports.assert_expr = exports.debug = void 0;
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvbWlzYy50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvc2xhbWUudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsK0JBQStCO0FBQ2xCLFFBQUEsa0JBQWtCLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN4RSxRQUFBLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDeEUsUUFBQSxlQUFlLEdBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDcEUsUUFBQSxjQUFjLEdBQVEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDbkUsUUFBQSxlQUFlLEdBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDcEUsUUFBQSxlQUFlLEdBQU8sdUJBQWUsQ0FBQztBQUN0QyxRQUFBLGdCQUFnQixHQUFNLEtBQUssQ0FBQztBQUV6QyxjQUFjO0FBQ0QsUUFBQSxXQUFXLEdBQU0sUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4RCxRQUFBLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0QsUUFBQSxhQUFhLEdBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxRQUFBLFlBQVksR0FBSyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXRFLHVCQUF1QjtBQUNW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R0FBRyxDQUFDO0FBQ2QsQ0FBQyxDQUFDLEdBQUc7QUFOTCxrQ0FNQztBQUVELElBQUksY0FBYyxHQUF3QixFQUFFLENBQUE7QUFDNUMsU0FBZ0Isc0JBQXNCLENBQUMsSUFBSTtJQUFFLGNBQU87U0FBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1FBQVAsNkJBQU87O0lBQ2hELFdBQVcsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUM7SUFDekMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFIRCx3REFHQztBQUVELFNBQWdCLHVCQUF1Qjs7SUFDbkMsT0FBTSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM3QixJQUFJLEVBQUUsR0FBRyxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUIsSUFBSTtZQUNBLENBQUEsS0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxJQUFJLDJCQUFDLE1BQU0sR0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUU7U0FDaEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEI7S0FDSjtBQUNMLENBQUM7QUFURCwwREFTQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuLyoqIGlkZW50aWZ5IGN1cnJlbnQgc2VjdGlvbiAqL1xuZXhwb3J0IGNvbnN0IGluX2FyY2hpdmVfc2VjdGlvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmVzLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fY2F0ZWdvcnlfc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcnktY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9ob21lX3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fdGFnX3NlY3Rpb24gICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFnLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcG9zdF9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3BhZ2Vfc2VjaXRvbiAgICAgPSBpbl9wb3N0X3NlY3Rpb247XG5leHBvcnQgY29uc3QgaW5fYWJvdXRfc2VjdGlvbiAgICA9IGZhbHNlO1xuXG4vKiogYnV0dG9ucyAqL1xuZXhwb3J0IGNvbnN0IGhvbWVfYnV0dG9uICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhcmNoaXZlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgZ2l0aHViX2J1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdpdGh1Yi1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYWJvdXRfYnV0dG9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFib3V0LWJ1dHRvblwiKTtcblxuLyoqIGdlbmVyYWwgZWxlbWVudHMgKi9cbmV4cG9ydCBjb25zdCB0YWdzX2J1dHRvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItdGFncy1lbGVtXCIpO1xuZXhwb3J0IGNvbnN0IGNhdGVnb3J5X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1jYXRlZ29yaWVzLWVsZW1cIik7XG5cbi8qKiBnb3RvIHRvcCAqL1xuZXhwb3J0IGNvbnN0IGdvdG9fdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb3RvLXRvcC1lbGVtXCIpO1xuXG4iLCJpbXBvcnQgKiBhcyBnbCBmcm9tICcuL2dsb2JhbCdcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnXG5cbmZ1bmN0aW9uIHNlbGVjdF9zZWN0aW9uKCkge1xuICAgIGlmIChnbC5pbl9ob21lX3NlY3Rpb24pICAgIGdsLmhvbWVfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgaWYgKGdsLmluX2FyY2hpdmVfc2VjdGlvbikgZ2wuYXJjaGl2ZV9idXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICBpZiAoZ2wuaW5fYWJvdXRfc2VjdGlvbikgICBnbC5hYm91dF9idXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvX21pc2MoKSB7XG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbChzZWxlY3Rfc2VjdGlvbik7XG5cbiAgICAvKiogdGFncyBhbmQgY2F0ZWdvcmllcyB0b2dnbGUgKi9cbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgZ2wudGFnc19idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldjogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiY2xpY2stc2hvd1wiKTtcbiAgICAgICAgfSlcbiAgICAgICAgZ2wuY2F0ZWdvcnlfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJjbGljay1zaG93XCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGxldCBnb3RvX3RvcF9zaG93ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgZ290b190b3BfdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBoaWRlX2dvdG9fdG9wKCkge1xuICAgICAgICBnbC5nb3RvX3RvcC5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgZ290b190b3Bfc2hvd2VkID0gZmFsc2U7XG4gICAgICAgIGdvdG9fdG9wX3RpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93X2dvdG9fdG9wKCkge1xuICAgICAgICBpZighZ290b190b3Bfc2hvd2VkKSB7XG4gICAgICAgICAgICBnbC5nb3RvX3RvcC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIGdvdG9fdG9wX3Nob3dlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGdvdG9fdG9wX3RpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGdvdG9fdG9wX3RpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChoaWRlX2dvdG9fdG9wLCAzMDAwKTtcbiAgICB9XG5cbiAgICAvKiogZ290byB0b3AgaGFuZGxlciAqL1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBzaG93X2dvdG9fdG9wKCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKGV2OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgc2hvd19nb3RvX3RvcCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuIiwiaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuXG5pbXBvcnQgeyBkb19taXNjIH0gZnJvbSAnLi9taXNjJztcbmRvX21pc2MoKTtcblxuXG51dGlscy5jYWxsX3JlZ2lzdGVyX2Z1bmN0aW9ucygpO1xuXG4iLCJcbmZ1bmN0aW9uIGdldENhbGxlciAoKSAvL3tcbntcbiAgICBsZXQgcmVnID0gL1xccythdCAoXFxTKykoIFxcKChbXildKylcXCkpPy9nO1xuICAgIGxldCBlZTogc3RyaW5nO1xuICAgIHRyeSB7dGhyb3cgbmV3IEVycm9yKCk7fVxuICAgIGNhdGNoIChlKSB7ZWUgPSBlLnN0YWNrO31cbiAgICByZWcuZXhlYyhlZSk7XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIGxldCBtbSA9IHJlZy5leGVjKGVlKTtcbiAgICBpZiAoIW1tKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gW21tWzNdIHx8IFwiXCIsIG1tWzFdXTtcbn07IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gZGVidWcoLi4uYXJndikgLy97XG57XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBcImRlYnVnIG1lc3NhZ2VcIjtcbiAgICBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7bXNnfV06IGA7XG4gICAgY29uc29sZS5kZWJ1Zyhtc2csIC4uLmFyZ3YpO1xufSAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF9leHByKHY6IGJvb2xlYW4sIGVyciA9IFwiYXNzZXJ0IGZhaWxcIikgLy97XG57XG4gICAgaWYgKHYpIHJldHVybjtcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHtlcnJ9XTogYDtcbiAgICB0aHJvdyBtc2c7XG59IC8vfVxuXG5sZXQgY2FsbGJhY2tfc3RhY2s6IFtGdW5jdGlvbiwgYW55W11dW10gPSBbXVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoZnVuYywgLi4uYXJncykge1xuICAgIGFzc2VydF9leHByKHR5cGVvZihmdW5jKSA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgY2FsbGJhY2tfc3RhY2sucHVzaChbZnVuYywgYXJnc10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbF9yZWdpc3Rlcl9mdW5jdGlvbnMoKSB7XG4gICAgd2hpbGUoY2FsbGJhY2tfc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZmEgPSBjYWxsYmFja19zdGFjay5wb3AoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhWzBdLmNhbGwod2luZG93LCAuLi5mYVsxXSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iXX0=
