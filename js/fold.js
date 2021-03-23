(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.do_fold = exports.show = exports.showAll = exports.hideAll = exports.refresh = void 0;
var utils = require("./utils");
var utils_1 = require("./utils");
var gl = require("./global");
/** fold section */
/** TODO reconstruct code, currently that seem's ugly */
/** TODO */
var save_sym = "sub_elements";
var parent_sym = "parent_head";
var fold_expr = "<span class='fold-button'>\n                       <i class='fas fa-angle-down show'></i>\n                       <i class='fas fa-angle-right hide'></i>\n                   </span>";
var valid_tag = /[hH]([123456])/;
var hide_elem = "--hide--";
var markdown_body_children = [];
var show_all = null;
var hide_all = null;
var show_a_elem = null;
function ignored_element(elem) {
    /** skip bibliography */
    if (elem.classList.contains("bibliography"))
        return true;
    return false;
}
function insert_fold_button_to_h(elem) {
    var all_h = [];
    markdown_body_children = [];
    show_all = null;
    hide_all = null;
    show_a_elem = null;
    function get_level_by_tag(tag) {
        var m = tag.match(valid_tag);
        if (m == null)
            return 7;
        return parseInt(m[1]);
    }
    var s = [];
    for (var i = 0; i < elem.children.length; i++) {
        var c = elem.children[i];
        /** skip elements */
        if (ignored_element(c))
            continue;
        markdown_body_children.push(c);
        var m = c.tagName.match(valid_tag);
        /** skip unnecessary elements */
        if (s.length == 0 && m == null)
            continue;
        var nl = get_level_by_tag(c.tagName);
        while (s.length > 0) {
            var ol = get_level_by_tag(s[s.length - 1].tagName);
            if (nl <= ol)
                s.pop();
            else
                break;
        }
        for (var j = 0; j < s.length; j++) {
            var x = s[j];
            x[save_sym] = x[save_sym] || [];
            x[save_sym].push(c);
        }
        if (s.length > 0)
            c[parent_sym] = s[s.length - 1];
        if (m) {
            all_h.push(c);
            s.push(c);
        }
    }
    function show__(elem__) {
        elem__.classList.remove("hide");
        var head = [];
        if (elem__[save_sym] != null) {
            for (var _i = 0, _a = elem__[save_sym]; _i < _a.length; _i++) {
                var xyz = _a[_i];
                var is_head = valid_tag.test(xyz.tagName);
                if (is_head) {
                    var show_1 = !xyz.classList.contains("hide");
                    head.push([xyz, show_1]);
                }
                xyz.classList.remove(hide_elem);
            }
        }
        for (var _b = 0, head_1 = head; _b < head_1.length; _b++) {
            var _c = head_1[_b], e = _c[0], show_2 = _c[1];
            if (show_2)
                show__(e);
            else
                hide__(e);
        }
    }
    function hide__(elem__) {
        elem__.classList.add("hide");
        if (elem__[save_sym] != null) {
            for (var _i = 0, _a = elem__[save_sym]; _i < _a.length; _i++) {
                var xyz = _a[_i];
                xyz.classList.add(hide_elem);
            }
        }
    }
    function uninstall() {
        for (var _i = 0, all_h_2 = all_h; _i < all_h_2.length; _i++) {
            var c = all_h_2[_i];
            show__(c);
            c[save_sym] = undefined;
            var bt = c.querySelector(".fold-button");
            if (bt != null && bt.parentElement == c)
                c.removeChild(bt);
        }
    }
    function show_all__() {
        for (var _i = 0, all_h_3 = all_h; _i < all_h_3.length; _i++) {
            var bb = all_h_3[_i];
            show__(bb);
        }
    }
    function hide_all__() {
        for (var _i = 0, all_h_4 = all_h; _i < all_h_4.length; _i++) {
            var bb = all_h_4[_i];
            hide__(bb);
        }
    }
    function show_a_elem__(elem) {
        var idx = all_h.indexOf(elem);
        if (idx < 0)
            return;
        while (elem != null) {
            show__(elem);
            elem = elem[parent_sym];
        }
    }
    show_all = show_all__;
    hide_all = hide_all__;
    show_a_elem = show_a_elem__;
    for (var _i = 0, all_h_1 = all_h; _i < all_h_1.length; _i++) {
        var button = all_h_1[_i];
        if (Array.isArray(button[save_sym]) && button[save_sym].length > 0)
            button.appendChild(utils.text2html(fold_expr));
        var x = button.querySelector(".fold-button");
        if (x == null)
            continue;
        x.addEventListener("click", function (ev) {
            var n = ev.target;
            while (n != null && !n.tagName.toLowerCase().match(valid_tag))
                n = n.parentElement;
            if (n != null) {
                var show_3 = !n.classList.contains("hide");
                if (show_3)
                    hide__(n);
                else
                    show__(n);
            }
            ev.stopPropagation();
            ev.preventDefault();
        });
    }
    return uninstall;
}
function need_update() {
    var m = document.querySelector(".markdown-body");
    if (m == null) {
        console.error("bad selector");
        return false;
    }
    if (m.children.length < markdown_body_children.length)
        return true;
    var j = 0;
    for (var i = 0; i < markdown_body_children.length; i++) {
        /** skip ignored elements */
        if (ignored_element(m.children[i]))
            continue;
        if (m.children[i] != markdown_body_children[j])
            return true;
        j++;
    }
    if (j != markdown_body_children.length)
        return true;
    return false;
}
var ins = function () {
    var m = document.querySelector(".markdown-body");
    if (m == null) {
        console.error("bad selector");
        return;
    }
    return insert_fold_button_to_h(m);
};
var unins = null;
function refresh() {
    unins && unins();
    unins = ins();
}
exports.refresh = refresh;
function hideAll() {
    if (hide_all)
        hide_all();
}
exports.hideAll = hideAll;
function showAll() {
    if (show_all)
        show_all();
}
exports.showAll = showAll;
function show(elem) {
    utils_1.assert_expr(elem && elem.tagName && valid_tag.test(elem.tagName));
    if (show_a_elem)
        show_a_elem(elem);
}
exports.show = show;
function do_fold() {
    var m = false;
    if (m)
        return;
    utils.register_function_call(function () {
        if (!gl.in_post_section)
            return;
        refresh();
        window.setInterval(function () {
            if (need_update())
                refresh();
        }, 1000);
    });
}
exports.do_fold = do_fold;

},{"./global":2,"./utils":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrQkFBaUM7QUFDakMsaUNBQXNDO0FBQ3RDLDZCQUErQjtBQUUvQixtQkFBbUI7QUFFbkIsd0RBQXdEO0FBRXhELFdBQVc7QUFDWCxJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7QUFDaEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBRWpDLElBQU0sU0FBUyxHQUFHLHVMQUdTLENBQUM7QUFDNUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLElBQUksc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBRXZCLFNBQVMsZUFBZSxDQUFDLElBQUk7SUFDekIsd0JBQXdCO0lBQ3hCLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFeEQsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsSUFBaUI7SUFFOUMsSUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztJQUNoQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkIsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFXO1FBQ2pDLElB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LGlCQUFpQixDQUFDLElBQWlCLEVBQUUsR0FBVyxFQUFFLEdBQVksRUFDNUMsT0FBZSxFQUFFLElBQWU7SUFDOUQsSUFBSSxLQUFLLEdBQVksR0FBRyxDQUFDO0lBQ3pCLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztJQUN4QixTQUFTLElBQUk7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsU0FBUyxPQUFPO1FBQ1osSUFBRyxLQUFLLEVBQUU7WUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2pCO2FBQU07WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFwQkQsOENBb0JDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLEdBQVc7SUFFakMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixPQUFPLEdBQUcsQ0FBQyxVQUF5QixDQUFDO0FBQ3pDLENBQUM7QUFMRCw4QkFLQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgYXNzZXJ0X2V4cHIgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIGdsIGZyb20gJy4vZ2xvYmFsJztcblxuLyoqIGZvbGQgc2VjdGlvbiAqL1xuXG4vKiogVE9ETyByZWNvbnN0cnVjdCBjb2RlLCBjdXJyZW50bHkgdGhhdCBzZWVtJ3MgdWdseSAqL1xuXG4vKiogVE9ETyAqL1xuY29uc3Qgc2F2ZV9zeW0gPSBcInN1Yl9lbGVtZW50c1wiO1xuY29uc3QgcGFyZW50X3N5bSA9IFwicGFyZW50X2hlYWRcIjtcblxuY29uc3QgZm9sZF9leHByID0gYDxzcGFuIGNsYXNzPSdmb2xkLWJ1dHRvbic+XG4gICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtZG93biBzaG93Jz48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtcmlnaHQgaGlkZSc+PC9pPlxuICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5gO1xuY29uc3QgdmFsaWRfdGFnID0gL1toSF0oWzEyMzQ1Nl0pLztcbmNvbnN0IGhpZGVfZWxlbSA9IFwiLS1oaWRlLS1cIjtcbmxldCBtYXJrZG93bl9ib2R5X2NoaWxkcmVuID0gW107XG5sZXQgc2hvd19hbGwgPSBudWxsO1xubGV0IGhpZGVfYWxsID0gbnVsbDtcbmxldCBzaG93X2FfZWxlbSA9IG51bGw7XG5cbmZ1bmN0aW9uIGlnbm9yZWRfZWxlbWVudChlbGVtKSB7XG4gICAgLyoqIHNraXAgYmlibGlvZ3JhcGh5ICovXG4gICAgaWYoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJiaWJsaW9ncmFwaHlcIikpIHJldHVybiB0cnVlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRfZm9sZF9idXR0b25fdG9faChlbGVtOiBIVE1MRWxlbWVudClcbntcbiAgICBjb25zdCBhbGxfaDogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIG1hcmtkb3duX2JvZHlfY2hpbGRyZW4gPSBbXTtcbiAgICBzaG93X2FsbCA9IG51bGw7XG4gICAgaGlkZV9hbGwgPSBudWxsO1xuICAgIHNob3dfYV9lbGVtID0gbnVsbDtcbiAgICBmdW5jdGlvbiBnZXRfbGV2ZWxfYnlfdGFnKHRhZzogc3RyaW5nKSB7XG4gICAgICAgIGxldCBtID0gdGFnLm1hdGNoKHZhbGlkX3RhZyk7XG4gICAgICAgIGlmKG0gPT0gbnVsbCkgcmV0dXJuIDc7XG4gICAgICAgIHJldHVybiBwYXJzZUludChtWzFdKTtcbiAgICB9XG5cbiAgICBsZXQgczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIGZvcihsZXQgaT0wO2k8ZWxlbS5jaGlsZHJlbi5sZW5ndGg7aSsrKSB7XG4gICAgICAgIGxldCBjID0gZWxlbS5jaGlsZHJlbltpXTtcblxuICAgICAgICAvKiogc2tpcCBlbGVtZW50cyAqL1xuICAgICAgICBpZihpZ25vcmVkX2VsZW1lbnQoYykpIGNvbnRpbnVlO1xuXG4gICAgICAgIG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgICAgbGV0IG0gPSBjLnRhZ05hbWUubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgLyoqIHNraXAgdW5uZWNlc3NhcnkgZWxlbWVudHMgKi9cbiAgICAgICAgaWYocy5sZW5ndGggPT0gMCAmJiBtID09IG51bGwpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgbGV0IG5sID0gZ2V0X2xldmVsX2J5X3RhZyhjLnRhZ05hbWUpO1xuICAgICAgICB3aGlsZShzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBvbCA9IGdldF9sZXZlbF9ieV90YWcoc1tzLmxlbmd0aCAtIDFdLnRhZ05hbWUpO1xuICAgICAgICAgICAgaWYobmwgPD0gb2wpIHMucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaj0wO2o8cy5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IHNbal07XG4gICAgICAgICAgICB4W3NhdmVfc3ltXSA9IHhbc2F2ZV9zeW1dIHx8IFtdO1xuICAgICAgICAgICAgeFtzYXZlX3N5bV0ucHVzaChjKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBjW3BhcmVudF9zeW1dID0gc1tzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZihtKSB7XG4gICAgICAgICAgICBhbGxfaC5wdXNoKGMgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgcy5wdXNoKGMgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd19fKGVsZW1fXzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbV9fLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgICBsZXQgaGVhZDogW0hUTUxFbGVtZW50LCBib29sZWFuXVtdID0gW107XG4gICAgICAgIGlmIChlbGVtX19bc2F2ZV9zeW1dICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvcihsZXQgeHl6IG9mIGVsZW1fX1tzYXZlX3N5bV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNfaGVhZCA9IHZhbGlkX3RhZy50ZXN0KHh5ei50YWdOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNfaGVhZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2hvdyA9ICF4eXouY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZC5wdXNoKFt4eXosIHNob3ddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeHl6LmNsYXNzTGlzdC5yZW1vdmUoaGlkZV9lbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IFtlLCBzaG93XSBvZiBoZWFkKSB7XG4gICAgICAgICAgICBpZiAoc2hvdykgc2hvd19fKGUpO1xuICAgICAgICAgICAgZWxzZSAgICAgIGhpZGVfXyhlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBoaWRlX18oZWxlbV9fOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtX18uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIGlmIChlbGVtX19bc2F2ZV9zeW1dICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvcihsZXQgeHl6IG9mIGVsZW1fX1tzYXZlX3N5bV0pXG4gICAgICAgICAgICAgICAgeHl6LmNsYXNzTGlzdC5hZGQoaGlkZV9lbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1bmluc3RhbGwoKSB7XG4gICAgICAgIGZvcihsZXQgYyBvZiBhbGxfaCkge1xuICAgICAgICAgICAgc2hvd19fKGMpO1xuICAgICAgICAgICAgY1tzYXZlX3N5bV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgYnQgPSBjLnF1ZXJ5U2VsZWN0b3IoXCIuZm9sZC1idXR0b25cIik7XG4gICAgICAgICAgICBpZihidCAhPSBudWxsICYmIGJ0LnBhcmVudEVsZW1lbnQgPT0gYylcbiAgICAgICAgICAgICAgICBjLnJlbW92ZUNoaWxkKGJ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93X2FsbF9fKCkge1xuICAgICAgICBmb3IobGV0IGJiIG9mIGFsbF9oKVxuICAgICAgICAgICAgc2hvd19fKGJiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGlkZV9hbGxfXygpIHtcbiAgICAgICAgZm9yKGxldCBiYiBvZiBhbGxfaClcbiAgICAgICAgICAgIGhpZGVfXyhiYik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dfYV9lbGVtX18oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlkeCA9IGFsbF9oLmluZGV4T2YoZWxlbSk7XG4gICAgICAgIGlmKGlkeCA8IDApIHJldHVybjtcbiAgICAgICAgd2hpbGUoZWxlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzaG93X18oZWxlbSk7XG4gICAgICAgICAgICBlbGVtID0gZWxlbVtwYXJlbnRfc3ltXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG93X2FsbCA9IHNob3dfYWxsX187XG4gICAgaGlkZV9hbGwgPSBoaWRlX2FsbF9fO1xuICAgIHNob3dfYV9lbGVtID0gc2hvd19hX2VsZW1fXztcblxuICAgIGZvcihsZXQgYnV0dG9uIG9mIGFsbF9oKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYnV0dG9uW3NhdmVfc3ltXSkgJiYgYnV0dG9uW3NhdmVfc3ltXS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKHV0aWxzLnRleHQyaHRtbChmb2xkX2V4cHIpKTtcblxuICAgICAgICBsZXQgeCA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKFwiLmZvbGQtYnV0dG9uXCIpO1xuICAgICAgICBpZih4ID09IG51bGwpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB4LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGxldCBuOiBIVE1MRWxlbWVudCA9IGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIHdoaWxlKG4gIT0gbnVsbCAmJiAhbi50YWdOYW1lLnRvTG93ZXJDYXNlKCkubWF0Y2godmFsaWRfdGFnKSlcbiAgICAgICAgICAgICAgICBuID0gbi5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgaWYgKG4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBzaG93ID0gIW4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICBpZihzaG93KSBoaWRlX18obik7XG4gICAgICAgICAgICAgICAgZWxzZSAgICAgc2hvd19fKG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pbnN0YWxsO1xufVxuXG5mdW5jdGlvbiBuZWVkX3VwZGF0ZSgpOiBib29sZWFuIHtcbiAgICBsZXQgbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tYm9keVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiYWQgc2VsZWN0b3JcIik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYobS5jaGlsZHJlbi5sZW5ndGggPCBtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgbGV0IGo9MDtcbiAgICBmb3IobGV0IGk9MDtpPG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoO2krKykge1xuICAgICAgICAvKiogc2tpcCBpZ25vcmVkIGVsZW1lbnRzICovXG4gICAgICAgIGlmKGlnbm9yZWRfZWxlbWVudChtLmNoaWxkcmVuW2ldKSkgY29udGludWU7XG5cbiAgICAgICAgaWYobS5jaGlsZHJlbltpXSAhPSBtYXJrZG93bl9ib2R5X2NoaWxkcmVuW2pdKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGorKztcbiAgICB9XG4gICAgaWYoaiAhPSBtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBpbnMgPSAoKSA9PiB7XG4gICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLWJvZHlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmFkIHNlbGVjdG9yXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBpbnNlcnRfZm9sZF9idXR0b25fdG9faChtKTtcbn1cbmxldCB1bmlucyA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgIHVuaW5zICYmIHVuaW5zKCk7XG4gICAgdW5pbnMgPSBpbnMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVBbGwoKSB7XG4gICAgaWYoaGlkZV9hbGwpIGhpZGVfYWxsKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2hvd0FsbCgpIHtcbiAgICBpZihzaG93X2FsbCkgc2hvd19hbGwoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzaG93KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgYXNzZXJ0X2V4cHIoZWxlbSAmJiBlbGVtLnRhZ05hbWUgJiYgdmFsaWRfdGFnLnRlc3QoZWxlbS50YWdOYW1lKSk7XG4gICAgaWYoc2hvd19hX2VsZW0pIHNob3dfYV9lbGVtKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9fZm9sZCgpIHtcbiAgICBsZXQgbSA9IGZhbHNlO1xuICAgIGlmIChtKSByZXR1cm47XG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbCgoKSA9PiB7XG4gICAgICAgIGlmKCFnbC5pbl9wb3N0X3NlY3Rpb24pIHJldHVybjtcbiAgICAgICAgcmVmcmVzaCgpO1xuXG4gICAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZihuZWVkX3VwZGF0ZSgpKSByZWZyZXNoKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xufVxuXG4iLCJcbi8qKiBpZGVudGlmeSBjdXJyZW50IHNlY3Rpb24gKi9cbmV4cG9ydCBjb25zdCBpbl9hcmNoaXZlX3NlY3Rpb24gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlcy1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2NhdGVnb3J5X3NlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhdGVnb3J5LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5faG9tZV9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3RhZ19zZWN0aW9uICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhZy1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3Bvc3Rfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wYWdlX3NlY2l0b24gICAgID0gaW5fcG9zdF9zZWN0aW9uO1xuZXhwb3J0IGNvbnN0IGluX2Fib3V0X3NlY3Rpb24gICAgPSBmYWxzZTtcblxuLyoqIGJ1dHRvbnMgKi9cbmV4cG9ydCBjb25zdCBob21lX2J1dHRvbiAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYXJjaGl2ZV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGdpdGh1Yl9idXR0b24gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnaXRodWItYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFib3V0X2J1dHRvbiAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhYm91dC1idXR0b25cIik7XG5cbi8qKiBnZW5lcmFsIGVsZW1lbnRzICovXG5leHBvcnQgY29uc3QgdGFnc19idXR0b24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLXRhZ3MtZWxlbVwiKTtcbmV4cG9ydCBjb25zdCBjYXRlZ29yeV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItY2F0ZWdvcmllcy1lbGVtXCIpO1xuXG4vKiogZ290byB0b3AgKi9cbmV4cG9ydCBjb25zdCBnb3RvX3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ290by10b3AtZWxlbVwiKTtcblxuLyoqIHRvYyBjb250YWluZXIgKi9cbmV4cG9ydCBjb25zdCB0b2NfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvY1wiKTtcbmV4cG9ydCBjb25zdCB0b2Nfc3dpdGNoZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtdG9jLXN3aXRjaGVyXCIpO1xuXG4iLCJcbmZ1bmN0aW9uIGdldENhbGxlciAoKSAvL3tcbntcbiAgICBsZXQgcmVnID0gL1xccythdCAoXFxTKykoIFxcKChbXildKylcXCkpPy9nO1xuICAgIGxldCBlZTogc3RyaW5nO1xuICAgIHRyeSB7dGhyb3cgbmV3IEVycm9yKCk7fVxuICAgIGNhdGNoIChlKSB7ZWUgPSBlLnN0YWNrO31cbiAgICByZWcuZXhlYyhlZSk7XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIGxldCBtbSA9IHJlZy5leGVjKGVlKTtcbiAgICBpZiAoIW1tKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gW21tWzNdIHx8IFwiXCIsIG1tWzFdXTtcbn07IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gZGVidWcoLi4uYXJndikgLy97XG57XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBcImRlYnVnIG1lc3NhZ2VcIjtcbiAgICBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7bXNnfV06IGA7XG4gICAgY29uc29sZS5kZWJ1Zyhtc2csIC4uLmFyZ3YpO1xufSAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF9leHByKHY6IGJvb2xlYW4sIGVyciA9IFwiYXNzZXJ0IGZhaWxcIikgLy97XG57XG4gICAgaWYgKHYpIHJldHVybjtcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHtlcnJ9XTogYDtcbiAgICB0aHJvdyBtc2c7XG59IC8vfVxuXG5sZXQgY2FsbGJhY2tfc3RhY2s6IFtGdW5jdGlvbiwgYW55W11dW10gPSBbXVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoZnVuYywgLi4uYXJncykge1xuICAgIGFzc2VydF9leHByKHR5cGVvZihmdW5jKSA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgY2FsbGJhY2tfc3RhY2sucHVzaChbZnVuYywgYXJnc10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbF9yZWdpc3Rlcl9mdW5jdGlvbnMoKSB7XG4gICAgd2hpbGUoY2FsbGJhY2tfc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZmEgPSBjYWxsYmFja19zdGFjay5wb3AoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhWzBdLmNhbGwod2luZG93LCAuLi5mYVsxXSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG50eXBlIGhvd3RvY2FsbCA9IChlbGVtOiBIVE1MRWxlbWVudCwgYWRkX2Z1bmM6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqdXN0IHJlbW92ZSB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X3JlbW92ZV9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHM6IHN0cmluZywgdGltZV9tczogbnVtYmVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBpZighYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX3JlbW92ZSwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfYWRkKTtcbn1cblxuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganN1dCBhZGQgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9hZGRfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nLCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVfbXM6IG51bWJlciwgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBpZihhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX2FkZCwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfcmVtb3ZlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQyaHRtbChzdHI6IHN0cmluZyk6IEhUTUxFbGVtZW50IFxue1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHIudHJpbSgpO1xuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudDtcbn1cblxuIl19
