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
    function show__(elem) {
        elem.classList.remove("hide");
        var head = [];
        if (elem[save_sym] != null) {
            for (var _i = 0, _a = elem[save_sym]; _i < _a.length; _i++) {
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
            var _c = head_1[_b], elem_1 = _c[0], show_2 = _c[1];
            if (show_2)
                show__(elem_1);
            else
                hide__(elem_1);
        }
    }
    function hide__(elem) {
        elem.classList.add("hide");
        if (elem[save_sym] != null) {
            for (var _i = 0, _a = elem[save_sym]; _i < _a.length; _i++) {
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
    if (m.children.length != markdown_body_children.length)
        return true;
    for (var i = 0; i < markdown_body_children.length; i++) {
        if (m.children[i] != markdown_body_children[i])
            return true;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrQkFBaUM7QUFDakMsaUNBQXNDO0FBQ3RDLDZCQUErQjtBQUUvQixtQkFBbUI7QUFFbkIsd0RBQXdEO0FBRXhELFdBQVc7QUFDWCxJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7QUFDaEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBRWpDLElBQU0sU0FBUyxHQUFHLHVMQUdTLENBQUM7QUFDNUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLElBQUksc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFNBQVMsdUJBQXVCLENBQUMsSUFBaUI7SUFFOUMsSUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztJQUNoQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkIsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFXO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0IsSUFBRyxDQUFDLElBQUksSUFBSTtZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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Q0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQztRQUNELE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBcEJELDhDQW9CQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxHQUFXO0lBRWpDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLENBQUMsVUFBeUIsQ0FBQztBQUN6QyxDQUFDO0FBTEQsOEJBS0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGFzc2VydF9leHByIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBnbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKiBmb2xkIHNlY3Rpb24gKi9cblxuLyoqIFRPRE8gcmVjb25zdHJ1Y3QgY29kZSwgY3VycmVudGx5IHRoYXQgc2VlbSdzIHVnbHkgKi9cblxuLyoqIFRPRE8gKi9cbmNvbnN0IHNhdmVfc3ltID0gXCJzdWJfZWxlbWVudHNcIjtcbmNvbnN0IHBhcmVudF9zeW0gPSBcInBhcmVudF9oZWFkXCI7XG5cbmNvbnN0IGZvbGRfZXhwciA9IGA8c3BhbiBjbGFzcz0nZm9sZC1idXR0b24nPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLWRvd24gc2hvdyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLXJpZ2h0IGhpZGUnPjwvaT5cbiAgICAgICAgICAgICAgICAgICA8L3NwYW4+YDtcbmNvbnN0IHZhbGlkX3RhZyA9IC9baEhdKFsxMjM0NTZdKS87XG5jb25zdCBoaWRlX2VsZW0gPSBcIi0taGlkZS0tXCI7XG5sZXQgbWFya2Rvd25fYm9keV9jaGlsZHJlbiA9IFtdO1xubGV0IHNob3dfYWxsID0gbnVsbDtcbmxldCBoaWRlX2FsbCA9IG51bGw7XG5sZXQgc2hvd19hX2VsZW0gPSBudWxsO1xuZnVuY3Rpb24gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2goZWxlbTogSFRNTEVsZW1lbnQpXG57XG4gICAgY29uc3QgYWxsX2g6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBtYXJrZG93bl9ib2R5X2NoaWxkcmVuID0gW107XG4gICAgc2hvd19hbGwgPSBudWxsO1xuICAgIGhpZGVfYWxsID0gbnVsbDtcbiAgICBzaG93X2FfZWxlbSA9IG51bGw7XG4gICAgZnVuY3Rpb24gZ2V0X2xldmVsX2J5X3RhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBsZXQgbSA9IHRhZy5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICBpZihtID09IG51bGwpIHJldHVybiA3O1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobVsxXSk7XG4gICAgfVxuXG4gICAgbGV0IHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBmb3IobGV0IGk9MDtpPGVsZW0uY2hpbGRyZW4ubGVuZ3RoO2krKykge1xuICAgICAgICBsZXQgYyA9IGVsZW0uY2hpbGRyZW5baV07XG4gICAgICAgIG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ucHVzaChjKTtcbiAgICAgICAgbGV0IG0gPSBjLnRhZ05hbWUubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgLyoqIHNraXAgdW5uZWNlc3NhcnkgZWxlbWVudHMgKi9cbiAgICAgICAgaWYocy5sZW5ndGggPT0gMCAmJiBtID09IG51bGwpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgbGV0IG5sID0gZ2V0X2xldmVsX2J5X3RhZyhjLnRhZ05hbWUpO1xuICAgICAgICB3aGlsZShzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBvbCA9IGdldF9sZXZlbF9ieV90YWcoc1tzLmxlbmd0aCAtIDFdLnRhZ05hbWUpO1xuICAgICAgICAgICAgaWYobmwgPD0gb2wpIHMucG9wKCk7XG4gICAgICAgICAgICBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgaj0wO2o8cy5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IHNbal07XG4gICAgICAgICAgICB4W3NhdmVfc3ltXSA9IHhbc2F2ZV9zeW1dIHx8IFtdO1xuICAgICAgICAgICAgeFtzYXZlX3N5bV0ucHVzaChjKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBjW3BhcmVudF9zeW1dID0gc1tzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZihtKSB7XG4gICAgICAgICAgICBhbGxfaC5wdXNoKGMgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgcy5wdXNoKGMgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd19fKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIGxldCBoZWFkOiBbSFRNTEVsZW1lbnQsIGJvb2xlYW5dW10gPSBbXTtcbiAgICAgICAgaWYgKGVsZW1bc2F2ZV9zeW1dICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvcihsZXQgeHl6IG9mIGVsZW1bc2F2ZV9zeW1dKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzX2hlYWQgPSB2YWxpZF90YWcudGVzdCh4eXoudGFnTmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzX2hlYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNob3cgPSAheHl6LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIGhlYWQucHVzaChbeHl6LCBzaG93XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QucmVtb3ZlKGhpZGVfZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBbZWxlbSwgc2hvd10gb2YgaGVhZCkge1xuICAgICAgICAgICAgaWYgKHNob3cpIHNob3dfXyhlbGVtKTtcbiAgICAgICAgICAgIGVsc2UgICAgICBoaWRlX18oZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGlkZV9fKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgIGlmIChlbGVtW3NhdmVfc3ltXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IobGV0IHh5eiBvZiBlbGVtW3NhdmVfc3ltXSlcbiAgICAgICAgICAgICAgICB4eXouY2xhc3NMaXN0LmFkZChoaWRlX2VsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVuaW5zdGFsbCgpIHtcbiAgICAgICAgZm9yKGxldCBjIG9mIGFsbF9oKSB7XG4gICAgICAgICAgICBzaG93X18oYyk7XG4gICAgICAgICAgICBjW3NhdmVfc3ltXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCBidCA9IGMucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgICAgIGlmKGJ0ICE9IG51bGwgJiYgYnQucGFyZW50RWxlbWVudCA9PSBjKVxuICAgICAgICAgICAgICAgIGMucmVtb3ZlQ2hpbGQoYnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBzaG93X18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoaWRlX2FsbF9fKCkge1xuICAgICAgICBmb3IobGV0IGJiIG9mIGFsbF9oKVxuICAgICAgICAgICAgaGlkZV9fKGJiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hX2VsZW1fXyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgaWR4ID0gYWxsX2guaW5kZXhPZihlbGVtKTtcbiAgICAgICAgaWYoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICB3aGlsZShlbGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNob3dfXyhlbGVtKTtcbiAgICAgICAgICAgIGVsZW0gPSBlbGVtW3BhcmVudF9zeW1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dfYWxsID0gc2hvd19hbGxfXztcbiAgICBoaWRlX2FsbCA9IGhpZGVfYWxsX187XG4gICAgc2hvd19hX2VsZW0gPSBzaG93X2FfZWxlbV9fO1xuXG4gICAgZm9yKGxldCBidXR0b24gb2YgYWxsX2gpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShidXR0b25bc2F2ZV9zeW1dKSAmJiBidXR0b25bc2F2ZV9zeW1dLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQodXRpbHMudGV4dDJodG1sKGZvbGRfZXhwcikpO1xuXG4gICAgICAgIGxldCB4ID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoXCIuZm9sZC1idXR0b25cIik7XG4gICAgICAgIGlmKHggPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgbGV0IG46IEhUTUxFbGVtZW50ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUobiAhPSBudWxsICYmICFuLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5tYXRjaCh2YWxpZF90YWcpKVxuICAgICAgICAgICAgICAgIG4gPSBuLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAobiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNob3cgPSAhbi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgIGlmKHNob3cpIGhpZGVfXyhuKTtcbiAgICAgICAgICAgICAgICBlbHNlICAgICBzaG93X18obik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB1bmluc3RhbGw7XG59XG5cbmZ1bmN0aW9uIG5lZWRfdXBkYXRlKCk6IGJvb2xlYW4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZihtLmNoaWxkcmVuLmxlbmd0aCAhPSBtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZm9yKGxldCBpPTA7aTxtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aDtpKyspIHtcbiAgICAgICAgaWYobS5jaGlsZHJlbltpXSAhPSBtYXJrZG93bl9ib2R5X2NoaWxkcmVuW2ldKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaW5zID0gKCkgPT4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2gobSk7XG59XG5sZXQgdW5pbnMgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICB1bmlucyAmJiB1bmlucygpO1xuICAgIHVuaW5zID0gaW5zKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlQWxsKCkge1xuICAgIGlmKGhpZGVfYWxsKSBoaWRlX2FsbCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNob3dBbGwoKSB7XG4gICAgaWYoc2hvd19hbGwpIHNob3dfYWxsKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2hvdyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGFzc2VydF9leHByKGVsZW0gJiYgZWxlbS50YWdOYW1lICYmIHZhbGlkX3RhZy50ZXN0KGVsZW0udGFnTmFtZSkpO1xuICAgIGlmKHNob3dfYV9lbGVtKSBzaG93X2FfZWxlbShlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvX2ZvbGQoKSB7XG4gICAgbGV0IG0gPSBmYWxzZTtcbiAgICBpZiAobSkgcmV0dXJuO1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBpZighZ2wuaW5fcG9zdF9zZWN0aW9uKSByZXR1cm47XG4gICAgICAgIHJlZnJlc2goKTtcblxuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYobmVlZF91cGRhdGUoKSkgcmVmcmVzaCgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbn1cblxuIiwiXG4vKiogaWRlbnRpZnkgY3VycmVudCBzZWN0aW9uICovXG5leHBvcnQgY29uc3QgaW5fYXJjaGl2ZV9zZWN0aW9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZXMtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9jYXRlZ29yeV9zZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yeS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2hvbWVfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl90YWdfc2VjdGlvbiAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWctY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wb3N0X3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcGFnZV9zZWNpdG9uICAgICA9IGluX3Bvc3Rfc2VjdGlvbjtcbmV4cG9ydCBjb25zdCBpbl9hYm91dF9zZWN0aW9uICAgID0gZmFsc2U7XG5cbi8qKiBidXR0b25zICovXG5leHBvcnQgY29uc3QgaG9tZV9idXR0b24gICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFyY2hpdmVfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBnaXRodWJfYnV0dG9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2l0aHViLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhYm91dF9idXR0b24gICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWJvdXQtYnV0dG9uXCIpO1xuXG4vKiogZ2VuZXJhbCBlbGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHRhZ3NfYnV0dG9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10YWdzLWVsZW1cIik7XG5leHBvcnQgY29uc3QgY2F0ZWdvcnlfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWNhdGVnb3JpZXMtZWxlbVwiKTtcblxuLyoqIGdvdG8gdG9wICovXG5leHBvcnQgY29uc3QgZ290b190b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvdG8tdG9wLWVsZW1cIik7XG5cbi8qKiB0b2MgY29udGFpbmVyICovXG5leHBvcnQgY29uc3QgdG9jX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2NcIik7XG5leHBvcnQgY29uc3QgdG9jX3N3aXRjaGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvYy1zd2l0Y2hlclwiKTtcblxuIiwiXG5mdW5jdGlvbiBnZXRDYWxsZXIgKCkgLy97XG57XG4gICAgbGV0IHJlZyA9IC9cXHMrYXQgKFxcUyspKCBcXCgoW14pXSspXFwpKT8vZztcbiAgICBsZXQgZWU6IHN0cmluZztcbiAgICB0cnkge3Rocm93IG5ldyBFcnJvcigpO31cbiAgICBjYXRjaCAoZSkge2VlID0gZS5zdGFjazt9XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIHJlZy5leGVjKGVlKTtcbiAgICBsZXQgbW0gPSByZWcuZXhlYyhlZSk7XG4gICAgaWYgKCFtbSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIFttbVszXSB8fCBcIlwiLCBtbVsxXV07XG59OyAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3YpIC8ve1xue1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gXCJkZWJ1ZyBtZXNzYWdlXCI7XG4gICAgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske21zZ31dOiBgO1xuICAgIGNvbnNvbGUuZGVidWcobXNnLCAuLi5hcmd2KTtcbn0gLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfZXhwcih2OiBib29sZWFuLCBlcnIgPSBcImFzc2VydCBmYWlsXCIpIC8ve1xue1xuICAgIGlmICh2KSByZXR1cm47XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7ZXJyfV06IGA7XG4gICAgdGhyb3cgbXNnO1xufSAvL31cblxubGV0IGNhbGxiYWNrX3N0YWNrOiBbRnVuY3Rpb24sIGFueVtdXVtdID0gW11cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKGZ1bmMsIC4uLmFyZ3MpIHtcbiAgICBhc3NlcnRfZXhwcih0eXBlb2YoZnVuYykgPT09ICdmdW5jdGlvbicpO1xuICAgIGNhbGxiYWNrX3N0YWNrLnB1c2goW2Z1bmMsIGFyZ3NdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxfcmVnaXN0ZXJfZnVuY3Rpb25zKCkge1xuICAgIHdoaWxlKGNhbGxiYWNrX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGZhID0gY2FsbGJhY2tfc3RhY2sucG9wKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmYVswXS5jYWxsKHdpbmRvdywgLi4uZmFbMV0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudHlwZSBob3d0b2NhbGwgPSAoZWxlbTogSFRNTEVsZW1lbnQsIGFkZF9mdW5jOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganVzdCByZW1vdmUgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9yZW1vdmVfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBzdHJpbmcsIHRpbWVfbXM6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgaWYoIWFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9yZW1vdmUsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX2FkZCk7XG59XG5cbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGpzdXQgYWRkIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfYWRkX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBjbHM6IHN0cmluZywgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX21zOiBudW1iZXIsIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgaWYoYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9hZGQsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX3JlbW92ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0Mmh0bWwoc3RyOiBzdHJpbmcpOiBIVE1MRWxlbWVudCBcbntcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyLnRyaW0oKTtcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbiJdfQ==
