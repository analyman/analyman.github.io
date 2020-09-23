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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrQkFBaUM7QUFDakMsaUNBQXNDO0FBQ3RDLDZCQUErQjtBQUUvQixtQkFBbUI7QUFFbkIsd0RBQXdEO0FBRXhELFdBQVc7QUFDWCxJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7QUFDaEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBRWpDLElBQU0sU0FBUyxHQUFHLHVMQUdTLENBQUM7QUFDNUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLElBQUksc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBRXZCLFNBQVMsZUFBZSxDQUFDLElBQUk7SUFDekIsd0JBQXdCO0lBQ3hCLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFeEQsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsSUFBaUI7SUFFOUMsSUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztJQUNoQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkIsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFXO1FBQ2pDLElB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Z0IsaUJBQWlCLENBQUMsSUFBaUIsRUFBRSxHQUFXLEVBQUUsR0FBWSxFQUM1QyxPQUFlLEVBQUUsSUFBZTtJQUM5RCxJQUFJLEtBQUssR0FBWSxHQUFHLENBQUM7SUFDekIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsSUFBSTtRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDYixPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRCxTQUFTLE9BQU87UUFDWixJQUFHLEtBQUssRUFBRTtZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDakI7YUFBTTtZQUNILE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQXBCRCw4Q0FvQkM7QUFFRCxTQUFnQixTQUFTLENBQUMsR0FBVztJQUVqQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDLFVBQXlCLENBQUM7QUFDekMsQ0FBQztBQUxELDhCQUtDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBhc3NlcnRfZXhwciB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnO1xuXG4vKiogZm9sZCBzZWN0aW9uICovXG5cbi8qKiBUT0RPIHJlY29uc3RydWN0IGNvZGUsIGN1cnJlbnRseSB0aGF0IHNlZW0ncyB1Z2x5ICovXG5cbi8qKiBUT0RPICovXG5jb25zdCBzYXZlX3N5bSA9IFwic3ViX2VsZW1lbnRzXCI7XG5jb25zdCBwYXJlbnRfc3ltID0gXCJwYXJlbnRfaGVhZFwiO1xuXG5jb25zdCBmb2xkX2V4cHIgPSBgPHNwYW4gY2xhc3M9J2ZvbGQtYnV0dG9uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1kb3duIHNob3cnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1yaWdodCBoaWRlJz48L2k+XG4gICAgICAgICAgICAgICAgICAgPC9zcGFuPmA7XG5jb25zdCB2YWxpZF90YWcgPSAvW2hIXShbMTIzNDU2XSkvO1xuY29uc3QgaGlkZV9lbGVtID0gXCItLWhpZGUtLVwiO1xubGV0IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4gPSBbXTtcbmxldCBzaG93X2FsbCA9IG51bGw7XG5sZXQgaGlkZV9hbGwgPSBudWxsO1xubGV0IHNob3dfYV9lbGVtID0gbnVsbDtcblxuZnVuY3Rpb24gaWdub3JlZF9lbGVtZW50KGVsZW0pIHtcbiAgICAvKiogc2tpcCBiaWJsaW9ncmFwaHkgKi9cbiAgICBpZihlbGVtLmNsYXNzTGlzdC5jb250YWlucyhcImJpYmxpb2dyYXBoeVwiKSkgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGluc2VydF9mb2xkX2J1dHRvbl90b19oKGVsZW06IEhUTUxFbGVtZW50KVxue1xuICAgIGNvbnN0IGFsbF9oOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgbWFya2Rvd25fYm9keV9jaGlsZHJlbiA9IFtdO1xuICAgIHNob3dfYWxsID0gbnVsbDtcbiAgICBoaWRlX2FsbCA9IG51bGw7XG4gICAgc2hvd19hX2VsZW0gPSBudWxsO1xuICAgIGZ1bmN0aW9uIGdldF9sZXZlbF9ieV90YWcodGFnOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG0gPSB0YWcubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgaWYobSA9PSBudWxsKSByZXR1cm4gNztcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1bMV0pO1xuICAgIH1cblxuICAgIGxldCBzOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgZm9yKGxldCBpPTA7aTxlbGVtLmNoaWxkcmVuLmxlbmd0aDtpKyspIHtcbiAgICAgICAgbGV0IGMgPSBlbGVtLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIC8qKiBza2lwIGVsZW1lbnRzICovXG4gICAgICAgIGlmKGlnbm9yZWRfZWxlbWVudChjKSkgY29udGludWU7XG5cbiAgICAgICAgbWFya2Rvd25fYm9keV9jaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICBsZXQgbSA9IGMudGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICAvKiogc2tpcCB1bm5lY2Vzc2FyeSBlbGVtZW50cyAqL1xuICAgICAgICBpZihzLmxlbmd0aCA9PSAwICYmIG0gPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgbmwgPSBnZXRfbGV2ZWxfYnlfdGFnKGMudGFnTmFtZSk7XG4gICAgICAgIHdoaWxlKHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IG9sID0gZ2V0X2xldmVsX2J5X3RhZyhzW3MubGVuZ3RoIC0gMV0udGFnTmFtZSk7XG4gICAgICAgICAgICBpZihubCA8PSBvbCkgcy5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBqPTA7ajxzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc1tqXTtcbiAgICAgICAgICAgIHhbc2F2ZV9zeW1dID0geFtzYXZlX3N5bV0gfHwgW107XG4gICAgICAgICAgICB4W3NhdmVfc3ltXS5wdXNoKGMpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGNbcGFyZW50X3N5bV0gPSBzW3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmKG0pIHtcbiAgICAgICAgICAgIGFsbF9oLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICBzLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93X18oZWxlbV9fOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtX18uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIGxldCBoZWFkOiBbSFRNTEVsZW1lbnQsIGJvb2xlYW5dW10gPSBbXTtcbiAgICAgICAgaWYgKGVsZW1fX1tzYXZlX3N5bV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKGxldCB4eXogb2YgZWxlbV9fW3NhdmVfc3ltXSkge1xuICAgICAgICAgICAgICAgIGxldCBpc19oZWFkID0gdmFsaWRfdGFnLnRlc3QoeHl6LnRhZ05hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChpc19oZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaG93ID0gIXh5ei5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICBoZWFkLnB1c2goW3h5eiwgc2hvd10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB4eXouY2xhc3NMaXN0LnJlbW92ZShoaWRlX2VsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgW2UsIHNob3ddIG9mIGhlYWQpIHtcbiAgICAgICAgICAgIGlmIChzaG93KSBzaG93X18oZSk7XG4gICAgICAgICAgICBlbHNlICAgICAgaGlkZV9fKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZGVfXyhlbGVtX186IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW1fXy5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgaWYgKGVsZW1fX1tzYXZlX3N5bV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKGxldCB4eXogb2YgZWxlbV9fW3NhdmVfc3ltXSlcbiAgICAgICAgICAgICAgICB4eXouY2xhc3NMaXN0LmFkZChoaWRlX2VsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVuaW5zdGFsbCgpIHtcbiAgICAgICAgZm9yKGxldCBjIG9mIGFsbF9oKSB7XG4gICAgICAgICAgICBzaG93X18oYyk7XG4gICAgICAgICAgICBjW3NhdmVfc3ltXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCBidCA9IGMucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgICAgIGlmKGJ0ICE9IG51bGwgJiYgYnQucGFyZW50RWxlbWVudCA9PSBjKVxuICAgICAgICAgICAgICAgIGMucmVtb3ZlQ2hpbGQoYnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBzaG93X18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoaWRlX2FsbF9fKCkge1xuICAgICAgICBmb3IobGV0IGJiIG9mIGFsbF9oKVxuICAgICAgICAgICAgaGlkZV9fKGJiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hX2VsZW1fXyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgaWR4ID0gYWxsX2guaW5kZXhPZihlbGVtKTtcbiAgICAgICAgaWYoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICB3aGlsZShlbGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNob3dfXyhlbGVtKTtcbiAgICAgICAgICAgIGVsZW0gPSBlbGVtW3BhcmVudF9zeW1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dfYWxsID0gc2hvd19hbGxfXztcbiAgICBoaWRlX2FsbCA9IGhpZGVfYWxsX187XG4gICAgc2hvd19hX2VsZW0gPSBzaG93X2FfZWxlbV9fO1xuXG4gICAgZm9yKGxldCBidXR0b24gb2YgYWxsX2gpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShidXR0b25bc2F2ZV9zeW1dKSAmJiBidXR0b25bc2F2ZV9zeW1dLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQodXRpbHMudGV4dDJodG1sKGZvbGRfZXhwcikpO1xuXG4gICAgICAgIGxldCB4ID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoXCIuZm9sZC1idXR0b25cIik7XG4gICAgICAgIGlmKHggPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgbGV0IG46IEhUTUxFbGVtZW50ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUobiAhPSBudWxsICYmICFuLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5tYXRjaCh2YWxpZF90YWcpKVxuICAgICAgICAgICAgICAgIG4gPSBuLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAobiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNob3cgPSAhbi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgIGlmKHNob3cpIGhpZGVfXyhuKTtcbiAgICAgICAgICAgICAgICBlbHNlICAgICBzaG93X18obik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB1bmluc3RhbGw7XG59XG5cbmZ1bmN0aW9uIG5lZWRfdXBkYXRlKCk6IGJvb2xlYW4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZihtLmNoaWxkcmVuLmxlbmd0aCA8IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICBsZXQgaj0wO1xuICAgIGZvcihsZXQgaT0wO2k8bWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGg7aSsrKSB7XG4gICAgICAgIC8qKiBza2lwIGlnbm9yZWQgZWxlbWVudHMgKi9cbiAgICAgICAgaWYoaWdub3JlZF9lbGVtZW50KG0uY2hpbGRyZW5baV0pKSBjb250aW51ZTtcblxuICAgICAgICBpZihtLmNoaWxkcmVuW2ldICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW5bal0pXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaisrO1xuICAgIH1cbiAgICBpZihqICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlucyA9ICgpID0+IHtcbiAgICBsZXQgbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tYm9keVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiYWQgc2VsZWN0b3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGluc2VydF9mb2xkX2J1dHRvbl90b19oKG0pO1xufVxubGV0IHVuaW5zID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgdW5pbnMgJiYgdW5pbnMoKTtcbiAgICB1bmlucyA9IGlucygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZUFsbCgpIHtcbiAgICBpZihoaWRlX2FsbCkgaGlkZV9hbGwoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzaG93QWxsKCkge1xuICAgIGlmKHNob3dfYWxsKSBzaG93X2FsbCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNob3coZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBhc3NlcnRfZXhwcihlbGVtICYmIGVsZW0udGFnTmFtZSAmJiB2YWxpZF90YWcudGVzdChlbGVtLnRhZ05hbWUpKTtcbiAgICBpZihzaG93X2FfZWxlbSkgc2hvd19hX2VsZW0oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb19mb2xkKCkge1xuICAgIGxldCBtID0gZmFsc2U7XG4gICAgaWYgKG0pIHJldHVybjtcbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgaWYoIWdsLmluX3Bvc3Rfc2VjdGlvbikgcmV0dXJuO1xuICAgICAgICByZWZyZXNoKCk7XG5cbiAgICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmKG5lZWRfdXBkYXRlKCkpIHJlZnJlc2goKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG59XG5cbiIsIlxuLyoqIGlkZW50aWZ5IGN1cnJlbnQgc2VjdGlvbiAqL1xuZXhwb3J0IGNvbnN0IGluX2FyY2hpdmVfc2VjdGlvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmVzLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fY2F0ZWdvcnlfc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcnktY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9ob21lX3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fdGFnX3NlY3Rpb24gICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFnLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcG9zdF9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3BhZ2Vfc2VjaXRvbiAgICAgPSBpbl9wb3N0X3NlY3Rpb247XG5leHBvcnQgY29uc3QgaW5fYWJvdXRfc2VjdGlvbiAgICA9IGZhbHNlO1xuXG4vKiogYnV0dG9ucyAqL1xuZXhwb3J0IGNvbnN0IGhvbWVfYnV0dG9uICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhcmNoaXZlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgZ2l0aHViX2J1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdpdGh1Yi1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYWJvdXRfYnV0dG9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFib3V0LWJ1dHRvblwiKTtcblxuLyoqIGdlbmVyYWwgZWxlbWVudHMgKi9cbmV4cG9ydCBjb25zdCB0YWdzX2J1dHRvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItdGFncy1lbGVtXCIpO1xuZXhwb3J0IGNvbnN0IGNhdGVnb3J5X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1jYXRlZ29yaWVzLWVsZW1cIik7XG5cbi8qKiBnb3RvIHRvcCAqL1xuZXhwb3J0IGNvbnN0IGdvdG9fdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb3RvLXRvcC1lbGVtXCIpO1xuXG4vKiogdG9jIGNvbnRhaW5lciAqL1xuZXhwb3J0IGNvbnN0IHRvY19jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtdG9jXCIpO1xuZXhwb3J0IGNvbnN0IHRvY19zd2l0Y2hlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2Mtc3dpdGNoZXJcIik7XG5cbiIsIlxuZnVuY3Rpb24gZ2V0Q2FsbGVyICgpIC8ve1xue1xuICAgIGxldCByZWcgPSAvXFxzK2F0IChcXFMrKSggXFwoKFteKV0rKVxcKSk/L2c7XG4gICAgbGV0IGVlOiBzdHJpbmc7XG4gICAgdHJ5IHt0aHJvdyBuZXcgRXJyb3IoKTt9XG4gICAgY2F0Y2ggKGUpIHtlZSA9IGUuc3RhY2s7fVxuICAgIHJlZy5leGVjKGVlKTtcbiAgICByZWcuZXhlYyhlZSk7XG4gICAgbGV0IG1tID0gcmVnLmV4ZWMoZWUpO1xuICAgIGlmICghbW0pIHJldHVybiBudWxsO1xuICAgIHJldHVybiBbbW1bM10gfHwgXCJcIiwgbW1bMV1dO1xufTsgLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5hcmd2KSAvL3tcbntcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IFwiZGVidWcgbWVzc2FnZVwiO1xuICAgIG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHttc2d9XTogYDtcbiAgICBjb25zb2xlLmRlYnVnKG1zZywgLi4uYXJndik7XG59IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0X2V4cHIodjogYm9vbGVhbiwgZXJyID0gXCJhc3NlcnQgZmFpbFwiKSAvL3tcbntcbiAgICBpZiAodikgcmV0dXJuO1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske2Vycn1dOiBgO1xuICAgIHRocm93IG1zZztcbn0gLy99XG5cbmxldCBjYWxsYmFja19zdGFjazogW0Z1bmN0aW9uLCBhbnlbXV1bXSA9IFtdXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJfZnVuY3Rpb25fY2FsbChmdW5jLCAuLi5hcmdzKSB7XG4gICAgYXNzZXJ0X2V4cHIodHlwZW9mKGZ1bmMpID09PSAnZnVuY3Rpb24nKTtcbiAgICBjYWxsYmFja19zdGFjay5wdXNoKFtmdW5jLCBhcmdzXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsX3JlZ2lzdGVyX2Z1bmN0aW9ucygpIHtcbiAgICB3aGlsZShjYWxsYmFja19zdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBmYSA9IGNhbGxiYWNrX3N0YWNrLnBvcCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmFbMF0uY2FsbCh3aW5kb3csIC4uLmZhWzFdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnR5cGUgaG93dG9jYWxsID0gKGVsZW06IEhUTUxFbGVtZW50LCBhZGRfZnVuYzogKCkgPT4gdm9pZCkgPT4gdm9pZDtcbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGp1c3QgcmVtb3ZlIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfcmVtb3ZlX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogc3RyaW5nLCB0aW1lX21zOiBudW1iZXIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGlmKCFhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfcmVtb3ZlLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9hZGQpO1xufVxuXG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqc3V0IGFkZCB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X2FkZF9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZV9tczogbnVtYmVyLCB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGlmKGFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfYWRkLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9yZW1vdmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dDJodG1sKHN0cjogc3RyaW5nKTogSFRNTEVsZW1lbnQgXG57XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmlubmVySFRNTCA9IHN0ci50cmltKCk7XG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50O1xufVxuXG4iXX0=
