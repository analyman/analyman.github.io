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

},{"./global":2,"./utils":4}],2:[function(require,module,exports){
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
exports.__esModule = true;
exports.do_toc = void 0;
var utils = require("./utils");
var gl = require("./global");
var utils_1 = require("./utils");
var fold = require("./fold");
/** generate Table of Contents base on <h?> tags */
var TOCEntry = /** @class */ (function () {
    function TOCEntry(name, link, level, classList) {
        if (name === void 0) { name = ''; }
        if (link === void 0) { link = ''; }
        if (level === void 0) { level = -1; }
        if (classList === void 0) { classList = []; }
        this.m_name = name;
        this.m_link = link;
        this.m_level = level;
        this.m_classList = classList.slice();
        this.m_children = [];
    }
    TOCEntry.prototype.generate_html = function (no, show_title) {
        var ret = "<div";
        if (this.m_classList.length > 0) {
            ret += " class='";
            for (var _i = 0, _a = this.m_classList; _i < _a.length; _i++) {
                var cls = _a[_i];
                ret += (" " + cls);
            }
            ret += "'";
        }
        ret += ">";
        if (show_title) {
            ret += "<div class='toc-title'>";
            ret += "<div><span class='toc-number'>" + (no + 1) + "</span><a href=\"" + this.m_link + "\">" + this.m_name + "</a></div>";
            /** toggle hide-the-toc class of this controller to switch the icon */
            if (this.m_children.length > 0) {
                ret += "<div class='toc-controller'>\n                        <i class='fas fa-angle-down toc-show'></i>\n                        <i class='fas fa-angle-right toc-hide'></i>\n                    </div>";
            }
            ret += "</div>";
        }
        ret += "<div class='toc-children'>";
        for (var c = 0; c < this.m_children.length; c++) {
            var cld = this.m_children[c];
            ret += cld.generate_html(c, true);
        }
        ret += "</div>";
        ret += "</div>";
        return ret;
    };
    TOCEntry.prototype.insertChild = function (child) {
        this.m_children.push(child);
    };
    TOCEntry.prototype.children = function () { return this.m_children; };
    TOCEntry.prototype.level = function () { return this.m_level; };
    TOCEntry.prototype.generateHtml = function () { return this.generate_html(0, false); };
    return TOCEntry;
}());
function try_toc(stack, pred, level, elem, child) {
    if (pred(elem)) {
        var l = level(elem);
        while (stack.length > 0 && l <= stack[stack.length - 1].level())
            stack.pop();
        utils_1.assert_expr(stack.length > 0);
        var n = elem.innerText;
        var attr_id = elem.attributes['id'];
        var link = "#" + (attr_id ? attr_id.value : '');
        var new_entry = new TOCEntry(n, link, l, ["toc-entry"]);
        stack[stack.length - 1].insertChild(new_entry);
        stack.push(new_entry);
    }
    if (child) {
        for (var c = 0; c < elem.children.length; c++) {
            var cc = elem.children[c];
            try_toc(stack, pred, level, cc, true);
        }
    }
}
function get_toc_from_html(pred, level) {
    var stack = [];
    var the_top = new TOCEntry('', '', 0, ['toc-first']);
    stack.push(the_top);
    var root = window.document.body;
    try_toc(stack, pred, level, root, true);
    return stack[0];
}
function getTOC() {
    var valid_tag = /^[hH]([1234567])$/;
    var pred = function (elem) {
        return (elem.tagName.match(valid_tag) != null &&
            elem.attributes['id'] != null &&
            elem.attributes['id'] != '');
    };
    var level = function (elem) {
        var x = elem.tagName.match(valid_tag);
        utils.assert_expr(x != null);
        return parseInt(x[1]);
    };
    return get_toc_from_html(pred, level);
}
function hide_toc() {
    gl.toc_container.classList.add("hide-toc");
    gl.toc_container.classList.remove("toc-in-show");
}
function show_toc() {
    gl.toc_container.classList.remove("hide-toc");
    gl.toc_container.classList.add("toc-in-show");
}
/** toc */
var _toc_ = "\n<div class=\"toc-name\">\nTOC\n</div>\n";
function do_toc() {
    if (!gl.in_post_section)
        return;
    utils.register_function_call(function () {
        var toc = getTOC();
        var toc_html = toc.generateHtml();
        var toc_container = gl.toc_container;
        utils_1.assert_expr(toc_container != null);
        toc_container.innerHTML = _toc_ + toc_html;
        var toc_controllers = toc_container.querySelectorAll(".toc-controller");
        for (var i = 0; i < toc_controllers.length; i++) {
            var controller = toc_controllers[i];
            controller.addEventListener("click", function (ev) {
                this.classList.toggle('hide-the-toc');
                var title = this.parentElement;
                var children = title.nextElementSibling;
                children.classList.toggle('toc-children-hide');
                ev.stopPropagation();
                ev.preventDefault();
            });
        }
        function reg_show_the_(elem, head_id) {
            elem.addEventListener("click", function (ev) {
                for (var i = 1; i <= 6; i++) {
                    var f = document.querySelector("h" + i + "[id='" + head_id + "']");
                    if (f == null)
                        continue;
                    fold.show(f);
                    return;
                }
            });
        }
        var links = toc_container.querySelectorAll(".toc-title a");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var tag = link.attributes["href"].value.substr(1);
            reg_show_the_(link, tag);
        }
        /** hide toc */
        var toc_show = true;
        document.addEventListener("click", function (ev) {
            if (!toc_show)
                return;
            var r = ev.target;
            while (r != null) {
                if (r == gl.toc_container || r == gl.toc_switcher)
                    return;
                r = r.parentElement;
            }
            hide_toc();
        });
        document.addEventListener("scroll", function (ev) {
            if (toc_show)
                hide_toc();
        });
        /** toggle switcher */
        utils.timeout_add_class(gl.toc_switcher, 'hide', true, 2500, function (e, f) {
            document.addEventListener("scroll", function (ev) {
                f();
            });
        });
        gl.toc_switcher.addEventListener("click", function (ev) {
            show_toc();
        });
    });
}
exports.do_toc = do_toc;

},{"./fold":1,"./global":2,"./utils":4}],4:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdG9jLnRzIiwidGhlbWVzL3NsYW1lL3NvdXJjZS9qcy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLCtCQUFpQztBQUNqQyxpQ0FBc0M7QUFDdEMsNkJBQStCO0FBRS9CLG1CQUFtQjtBQUVuQix3REFBd0Q7QUFFeEQsV0FBVztBQUNYLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNoQyxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFFakMsSUFBTSxTQUFTLEdBQUcsdUxBR1MsQ0FBQztBQUM1QixJQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsSUFBSSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFFdkIsU0FBUyxlQUFlLENBQUMsSUFBSTtJQUN6Qix3QkFBd0I7SUFDeEIsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUV4RCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxJQUFpQjtJQUU5QyxJQUFNLEtBQUssR0FBa0IsRUFBRSxDQUFDO0lBQ2hDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNu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RSxHQUFXLEVBQUUsR0FBWSxFQUM1QyxPQUFlLEVBQUUsSUFBZTtJQUM5RCxJQUFJLEtBQUssR0FBWSxHQUFHLENBQUM7SUFDekIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFNBQVMsSUFBSTtRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDYixPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRCxTQUFTLE9BQU87UUFDWixJQUFHLEtBQUssRUFBRTtZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDakI7YUFBTTtZQUNILE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQXBCRCw4Q0FvQkM7QUFFRCxTQUFnQixTQUFTLENBQUMsR0FBVztJQUVqQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDLFVBQXlCLENBQUM7QUFDekMsQ0FBQztBQUxELDhCQUtDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBhc3NlcnRfZXhwciB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnO1xuXG4vKiogZm9sZCBzZWN0aW9uICovXG5cbi8qKiBUT0RPIHJlY29uc3RydWN0IGNvZGUsIGN1cnJlbnRseSB0aGF0IHNlZW0ncyB1Z2x5ICovXG5cbi8qKiBUT0RPICovXG5jb25zdCBzYXZlX3N5bSA9IFwic3ViX2VsZW1lbnRzXCI7XG5jb25zdCBwYXJlbnRfc3ltID0gXCJwYXJlbnRfaGVhZFwiO1xuXG5jb25zdCBmb2xkX2V4cHIgPSBgPHNwYW4gY2xhc3M9J2ZvbGQtYnV0dG9uJz5cbiAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1kb3duIHNob3cnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1yaWdodCBoaWRlJz48L2k+XG4gICAgICAgICAgICAgICAgICAgPC9zcGFuPmA7XG5jb25zdCB2YWxpZF90YWcgPSAvW2hIXShbMTIzNDU2XSkvO1xuY29uc3QgaGlkZV9lbGVtID0gXCItLWhpZGUtLVwiO1xubGV0IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4gPSBbXTtcbmxldCBzaG93X2FsbCA9IG51bGw7XG5sZXQgaGlkZV9hbGwgPSBudWxsO1xubGV0IHNob3dfYV9lbGVtID0gbnVsbDtcblxuZnVuY3Rpb24gaWdub3JlZF9lbGVtZW50KGVsZW0pIHtcbiAgICAvKiogc2tpcCBiaWJsaW9ncmFwaHkgKi9cbiAgICBpZihlbGVtLmNsYXNzTGlzdC5jb250YWlucyhcImJpYmxpb2dyYXBoeVwiKSkgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGluc2VydF9mb2xkX2J1dHRvbl90b19oKGVsZW06IEhUTUxFbGVtZW50KVxue1xuICAgIGNvbnN0IGFsbF9oOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgbWFya2Rvd25fYm9keV9jaGlsZHJlbiA9IFtdO1xuICAgIHNob3dfYWxsID0gbnVsbDtcbiAgICBoaWRlX2FsbCA9IG51bGw7XG4gICAgc2hvd19hX2VsZW0gPSBudWxsO1xuICAgIGZ1bmN0aW9uIGdldF9sZXZlbF9ieV90YWcodGFnOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG0gPSB0YWcubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgaWYobSA9PSBudWxsKSByZXR1cm4gNztcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1bMV0pO1xuICAgIH1cblxuICAgIGxldCBzOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgZm9yKGxldCBpPTA7aTxlbGVtLmNoaWxkcmVuLmxlbmd0aDtpKyspIHtcbiAgICAgICAgbGV0IGMgPSBlbGVtLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIC8qKiBza2lwIGVsZW1lbnRzICovXG4gICAgICAgIGlmKGlnbm9yZWRfZWxlbWVudChjKSkgY29udGludWU7XG5cbiAgICAgICAgbWFya2Rvd25fYm9keV9jaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICBsZXQgbSA9IGMudGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICAvKiogc2tpcCB1bm5lY2Vzc2FyeSBlbGVtZW50cyAqL1xuICAgICAgICBpZihzLmxlbmd0aCA9PSAwICYmIG0gPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgbmwgPSBnZXRfbGV2ZWxfYnlfdGFnKGMudGFnTmFtZSk7XG4gICAgICAgIHdoaWxlKHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IG9sID0gZ2V0X2xldmVsX2J5X3RhZyhzW3MubGVuZ3RoIC0gMV0udGFnTmFtZSk7XG4gICAgICAgICAgICBpZihubCA8PSBvbCkgcy5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBqPTA7ajxzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc1tqXTtcbiAgICAgICAgICAgIHhbc2F2ZV9zeW1dID0geFtzYXZlX3N5bV0gfHwgW107XG4gICAgICAgICAgICB4W3NhdmVfc3ltXS5wdXNoKGMpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGNbcGFyZW50X3N5bV0gPSBzW3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmKG0pIHtcbiAgICAgICAgICAgIGFsbF9oLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICBzLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93X18oZWxlbV9fOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBlbGVtX18uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIGxldCBoZWFkOiBbSFRNTEVsZW1lbnQsIGJvb2xlYW5dW10gPSBbXTtcbiAgICAgICAgaWYgKGVsZW1fX1tzYXZlX3N5bV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKGxldCB4eXogb2YgZWxlbV9fW3NhdmVfc3ltXSkge1xuICAgICAgICAgICAgICAgIGxldCBpc19oZWFkID0gdmFsaWRfdGFnLnRlc3QoeHl6LnRhZ05hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChpc19oZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaG93ID0gIXh5ei5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICBoZWFkLnB1c2goW3h5eiwgc2hvd10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB4eXouY2xhc3NMaXN0LnJlbW92ZShoaWRlX2VsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgW2UsIHNob3ddIG9mIGhlYWQpIHtcbiAgICAgICAgICAgIGlmIChzaG93KSBzaG93X18oZSk7XG4gICAgICAgICAgICBlbHNlICAgICAgaGlkZV9fKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZGVfXyhlbGVtX186IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW1fXy5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgaWYgKGVsZW1fX1tzYXZlX3N5bV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKGxldCB4eXogb2YgZWxlbV9fW3NhdmVfc3ltXSlcbiAgICAgICAgICAgICAgICB4eXouY2xhc3NMaXN0LmFkZChoaWRlX2VsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVuaW5zdGFsbCgpIHtcbiAgICAgICAgZm9yKGxldCBjIG9mIGFsbF9oKSB7XG4gICAgICAgICAgICBzaG93X18oYyk7XG4gICAgICAgICAgICBjW3NhdmVfc3ltXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCBidCA9IGMucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgICAgIGlmKGJ0ICE9IG51bGwgJiYgYnQucGFyZW50RWxlbWVudCA9PSBjKVxuICAgICAgICAgICAgICAgIGMucmVtb3ZlQ2hpbGQoYnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBzaG93X18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoaWRlX2FsbF9fKCkge1xuICAgICAgICBmb3IobGV0IGJiIG9mIGFsbF9oKVxuICAgICAgICAgICAgaGlkZV9fKGJiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hX2VsZW1fXyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgaWR4ID0gYWxsX2guaW5kZXhPZihlbGVtKTtcbiAgICAgICAgaWYoaWR4IDwgMCkgcmV0dXJuO1xuICAgICAgICB3aGlsZShlbGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNob3dfXyhlbGVtKTtcbiAgICAgICAgICAgIGVsZW0gPSBlbGVtW3BhcmVudF9zeW1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dfYWxsID0gc2hvd19hbGxfXztcbiAgICBoaWRlX2FsbCA9IGhpZGVfYWxsX187XG4gICAgc2hvd19hX2VsZW0gPSBzaG93X2FfZWxlbV9fO1xuXG4gICAgZm9yKGxldCBidXR0b24gb2YgYWxsX2gpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShidXR0b25bc2F2ZV9zeW1dKSAmJiBidXR0b25bc2F2ZV9zeW1dLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQodXRpbHMudGV4dDJodG1sKGZvbGRfZXhwcikpO1xuXG4gICAgICAgIGxldCB4ID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoXCIuZm9sZC1idXR0b25cIik7XG4gICAgICAgIGlmKHggPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgbGV0IG46IEhUTUxFbGVtZW50ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUobiAhPSBudWxsICYmICFuLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5tYXRjaCh2YWxpZF90YWcpKVxuICAgICAgICAgICAgICAgIG4gPSBuLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAobiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNob3cgPSAhbi5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgIGlmKHNob3cpIGhpZGVfXyhuKTtcbiAgICAgICAgICAgICAgICBlbHNlICAgICBzaG93X18obik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB1bmluc3RhbGw7XG59XG5cbmZ1bmN0aW9uIG5lZWRfdXBkYXRlKCk6IGJvb2xlYW4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZihtLmNoaWxkcmVuLmxlbmd0aCA8IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICBsZXQgaj0wO1xuICAgIGZvcihsZXQgaT0wO2k8bWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGg7aSsrKSB7XG4gICAgICAgIC8qKiBza2lwIGlnbm9yZWQgZWxlbWVudHMgKi9cbiAgICAgICAgaWYoaWdub3JlZF9lbGVtZW50KG0uY2hpbGRyZW5baV0pKSBjb250aW51ZTtcblxuICAgICAgICBpZihtLmNoaWxkcmVuW2ldICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW5bal0pXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaisrO1xuICAgIH1cbiAgICBpZihqICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlucyA9ICgpID0+IHtcbiAgICBsZXQgbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tYm9keVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiYWQgc2VsZWN0b3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGluc2VydF9mb2xkX2J1dHRvbl90b19oKG0pO1xufVxubGV0IHVuaW5zID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgdW5pbnMgJiYgdW5pbnMoKTtcbiAgICB1bmlucyA9IGlucygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZUFsbCgpIHtcbiAgICBpZihoaWRlX2FsbCkgaGlkZV9hbGwoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzaG93QWxsKCkge1xuICAgIGlmKHNob3dfYWxsKSBzaG93X2FsbCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNob3coZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICBhc3NlcnRfZXhwcihlbGVtICYmIGVsZW0udGFnTmFtZSAmJiB2YWxpZF90YWcudGVzdChlbGVtLnRhZ05hbWUpKTtcbiAgICBpZihzaG93X2FfZWxlbSkgc2hvd19hX2VsZW0oZWxlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb19mb2xkKCkge1xuICAgIGxldCBtID0gZmFsc2U7XG4gICAgaWYgKG0pIHJldHVybjtcbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgaWYoIWdsLmluX3Bvc3Rfc2VjdGlvbikgcmV0dXJuO1xuICAgICAgICByZWZyZXNoKCk7XG5cbiAgICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmKG5lZWRfdXBkYXRlKCkpIHJlZnJlc2goKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG59XG5cbiIsIlxuLyoqIGlkZW50aWZ5IGN1cnJlbnQgc2VjdGlvbiAqL1xuZXhwb3J0IGNvbnN0IGluX2FyY2hpdmVfc2VjdGlvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmVzLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fY2F0ZWdvcnlfc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcnktY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9ob21lX3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fdGFnX3NlY3Rpb24gICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFnLWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcG9zdF9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3BhZ2Vfc2VjaXRvbiAgICAgPSBpbl9wb3N0X3NlY3Rpb247XG5leHBvcnQgY29uc3QgaW5fYWJvdXRfc2VjdGlvbiAgICA9IGZhbHNlO1xuXG4vKiogYnV0dG9ucyAqL1xuZXhwb3J0IGNvbnN0IGhvbWVfYnV0dG9uICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhcmNoaXZlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgZ2l0aHViX2J1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdpdGh1Yi1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYWJvdXRfYnV0dG9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFib3V0LWJ1dHRvblwiKTtcblxuLyoqIGdlbmVyYWwgZWxlbWVudHMgKi9cbmV4cG9ydCBjb25zdCB0YWdzX2J1dHRvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItdGFncy1lbGVtXCIpO1xuZXhwb3J0IGNvbnN0IGNhdGVnb3J5X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci1jYXRlZ29yaWVzLWVsZW1cIik7XG5cbi8qKiBnb3RvIHRvcCAqL1xuZXhwb3J0IGNvbnN0IGdvdG9fdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb3RvLXRvcC1lbGVtXCIpO1xuXG4vKiogdG9jIGNvbnRhaW5lciAqL1xuZXhwb3J0IGNvbnN0IHRvY19jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtdG9jXCIpO1xuZXhwb3J0IGNvbnN0IHRvY19zd2l0Y2hlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2Mtc3dpdGNoZXJcIik7XG5cbiIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgKiBhcyBnbCBmcm9tICcuL2dsb2JhbCdcbmltcG9ydCB7IGFzc2VydF9leHByIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCAqIGFzIGZvbGQgZnJvbSAnLi9mb2xkJ1xuXG4vKiogZ2VuZXJhdGUgVGFibGUgb2YgQ29udGVudHMgYmFzZSBvbiA8aD8+IHRhZ3MgKi9cblxuY2xhc3MgVE9DRW50cnkge1xuICAgIHByaXZhdGUgbV9jbGFzc0xpc3Q6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgbV9sZXZlbDogbnVtYmVyO1xuICAgIHByaXZhdGUgbV9jaGlsZHJlbjogVE9DRW50cnlbXTtcbiAgICBwcml2YXRlIG1fbGluazogc3RyaW5nO1xuICAgIHByaXZhdGUgbV9uYW1lOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlX2h0bWwobm86IG51bWJlciwgc2hvd190aXRsZTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXQgPSBcIjxkaXZcIjtcbiAgICAgICAgaWYodGhpcy5tX2NsYXNzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXQgKz0gXCIgY2xhc3M9J1wiO1xuICAgICAgICAgICAgZm9yKGxldCBjbHMgb2YgdGhpcy5tX2NsYXNzTGlzdClcbiAgICAgICAgICAgICAgICByZXQgKz0gKFwiIFwiICsgY2xzKTtcbiAgICAgICAgICAgIHJldCArPSBcIidcIjtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0gXCI+XCI7XG5cbiAgICAgICAgaWYoc2hvd190aXRsZSkge1xuICAgICAgICAgICAgcmV0ICs9IFwiPGRpdiBjbGFzcz0ndG9jLXRpdGxlJz5cIjtcbiAgICAgICAgICAgIHJldCArPSBgPGRpdj48c3BhbiBjbGFzcz0ndG9jLW51bWJlcic+JHtubyArIDF9PC9zcGFuPjxhIGhyZWY9XCIke3RoaXMubV9saW5rfVwiPiR7dGhpcy5tX25hbWV9PC9hPjwvZGl2PmA7XG4gICAgICAgICAgICAvKiogdG9nZ2xlIGhpZGUtdGhlLXRvYyBjbGFzcyBvZiB0aGlzIGNvbnRyb2xsZXIgdG8gc3dpdGNoIHRoZSBpY29uICovXG4gICAgICAgICAgICBpZiAodGhpcy5tX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gYDxkaXYgY2xhc3M9J3RvYy1jb250cm9sbGVyJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtZG93biB0b2Mtc2hvdyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1yaWdodCB0b2MtaGlkZSc+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgKz0gXCI8ZGl2IGNsYXNzPSd0b2MtY2hpbGRyZW4nPlwiO1xuICAgICAgICBmb3IobGV0IGM9MDtjPHRoaXMubV9jaGlsZHJlbi5sZW5ndGg7YysrKSB7XG4gICAgICAgICAgICBsZXQgY2xkID0gdGhpcy5tX2NoaWxkcmVuW2NdO1xuICAgICAgICAgICAgcmV0ICs9IGNsZC5nZW5lcmF0ZV9odG1sKGMsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xuXG4gICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmc9JycsIGxpbms6IHN0cmluZz0nJywgbGV2ZWw6IG51bWJlcj0tMSwgY2xhc3NMaXN0OiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHRoaXMubV9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5tX2xpbmsgPSBsaW5rO1xuICAgICAgICB0aGlzLm1fbGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgdGhpcy5tX2NsYXNzTGlzdCA9IGNsYXNzTGlzdC5zbGljZSgpO1xuICAgICAgICB0aGlzLm1fY2hpbGRyZW4gPSBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5zZXJ0Q2hpbGQoY2hpbGQ6IFRPQ0VudHJ5KSB7XG4gICAgICAgIHRoaXMubV9jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2hpbGRyZW4oKTogVE9DRW50cnlbXSB7cmV0dXJuIHRoaXMubV9jaGlsZHJlbjt9XG4gICAgcHVibGljIGxldmVsKCk6IG51bWJlciB7cmV0dXJuIHRoaXMubV9sZXZlbDt9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVIdG1sKCkge3JldHVybiB0aGlzLmdlbmVyYXRlX2h0bWwoMCwgZmFsc2UpO31cbn1cblxudHlwZSBUb2NFbnRyeVByZWRpY2F0ZSA9IChlbGVtOiBIVE1MRWxlbWVudCkgPT4gYm9vbGVhbjtcbnR5cGUgZ2V0RW50cnlMZXZlbCA9IChlbGVtOiBIVE1MRWxlbWVudCkgPT4gbnVtYmVyO1xuXG5mdW5jdGlvbiB0cnlfdG9jKHN0YWNrOiBUT0NFbnRyeVtdLCBwcmVkOiBUb2NFbnRyeVByZWRpY2F0ZSwgbGV2ZWw6IGdldEVudHJ5TGV2ZWwsXG4gICAgICAgICAgICAgICAgIGVsZW06IEhUTUxFbGVtZW50LCBjaGlsZDogYm9vbGVhbikge1xuICAgIGlmKHByZWQoZWxlbSkpIHtcbiAgICAgICAgbGV0IGwgPSBsZXZlbChlbGVtKTtcbiAgICAgICAgd2hpbGUoc3RhY2subGVuZ3RoID4gMCAmJiBsIDw9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLmxldmVsKCkpXG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgYXNzZXJ0X2V4cHIoc3RhY2subGVuZ3RoID4gMCk7XG4gICAgICAgIGxldCBuID0gZWxlbS5pbm5lclRleHQ7XG4gICAgICAgIGxldCBhdHRyX2lkID0gZWxlbS5hdHRyaWJ1dGVzWydpZCddO1xuICAgICAgICBsZXQgbGluayA9IFwiI1wiICsgKGF0dHJfaWQgPyBhdHRyX2lkLnZhbHVlIDogJycpO1xuICAgICAgICBsZXQgbmV3X2VudHJ5ID0gbmV3IFRPQ0VudHJ5KG4sIGxpbmssIGwsIFtcInRvYy1lbnRyeVwiXSk7XG4gICAgICAgIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLmluc2VydENoaWxkKG5ld19lbnRyeSk7XG4gICAgICAgIHN0YWNrLnB1c2gobmV3X2VudHJ5KTtcbiAgICB9XG5cbiAgICBpZihjaGlsZCkge1xuICAgICAgICBmb3IobGV0IGM9MDtjPGVsZW0uY2hpbGRyZW4ubGVuZ3RoO2MrKykge1xuICAgICAgICAgICAgbGV0IGNjID0gZWxlbS5jaGlsZHJlbltjXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIHRyeV90b2Moc3RhY2ssIHByZWQsIGxldmVsLCBjYywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfdG9jX2Zyb21faHRtbChwcmVkOiBUb2NFbnRyeVByZWRpY2F0ZSwgbGV2ZWw6IGdldEVudHJ5TGV2ZWwpOiBUT0NFbnRyeSBcbntcbiAgICBsZXQgc3RhY2sgPSBbXTtcbiAgICBsZXQgdGhlX3RvcCA9IG5ldyBUT0NFbnRyeSgnJywgJycsIDAsIFsndG9jLWZpcnN0J10pO1xuICAgIHN0YWNrLnB1c2godGhlX3RvcCk7XG4gICAgbGV0IHJvb3QgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcbiAgICB0cnlfdG9jKHN0YWNrLCBwcmVkLCBsZXZlbCwgcm9vdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHN0YWNrWzBdO1xufVxuXG5mdW5jdGlvbiBnZXRUT0MoKTogVE9DRW50cnkge1xuICAgIGxldCB2YWxpZF90YWcgPSAvXltoSF0oWzEyMzQ1NjddKSQvO1xuICAgIGxldCBwcmVkID0gKGVsZW06IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIHJldHVybiAoZWxlbS50YWdOYW1lLm1hdGNoKHZhbGlkX3RhZykgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIGVsZW0uYXR0cmlidXRlc1snaWQnXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgZWxlbS5hdHRyaWJ1dGVzWydpZCddICE9ICcnKTtcbiAgICB9O1xuICAgIGxldCBsZXZlbCA9IChlbGVtOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICBsZXQgeCA9IGVsZW0udGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICB1dGlscy5hc3NlcnRfZXhwcih4IT1udWxsKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHhbMV0pO1xuICAgIH07XG4gICAgcmV0dXJuIGdldF90b2NfZnJvbV9odG1sKHByZWQsIGxldmVsKTtcbn1cblxuZnVuY3Rpb24gaGlkZV90b2MoKSB7XG4gICAgZ2wudG9jX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGlkZS10b2NcIik7XG4gICAgZ2wudG9jX2NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwidG9jLWluLXNob3dcIik7XG59XG5cbmZ1bmN0aW9uIHNob3dfdG9jKCkge1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImhpZGUtdG9jXCIpO1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRvYy1pbi1zaG93XCIpO1xufVxuXG4vKiogdG9jICovXG5jb25zdCBfdG9jXyA9IGBcbjxkaXYgY2xhc3M9XCJ0b2MtbmFtZVwiPlxuVE9DXG48L2Rpdj5cbmA7XG5leHBvcnQgZnVuY3Rpb24gZG9fdG9jKCkge1xuICAgIGlmKCFnbC5pbl9wb3N0X3NlY3Rpb24pIHJldHVybjtcblxuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBsZXQgdG9jID0gZ2V0VE9DKCk7XG4gICAgICAgIGxldCB0b2NfaHRtbCA9IHRvYy5nZW5lcmF0ZUh0bWwoKTtcbiAgICAgICAgbGV0IHRvY19jb250YWluZXIgPSBnbC50b2NfY29udGFpbmVyO1xuICAgICAgICBhc3NlcnRfZXhwcih0b2NfY29udGFpbmVyICE9IG51bGwpO1xuICAgICAgICB0b2NfY29udGFpbmVyLmlubmVySFRNTCA9IF90b2NfICsgdG9jX2h0bWw7XG5cbiAgICAgICAgbGV0IHRvY19jb250cm9sbGVycyA9IHRvY19jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi50b2MtY29udHJvbGxlclwiKTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0b2NfY29udHJvbGxlcnMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSB0b2NfY29udHJvbGxlcnNbaV0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXY6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUtdGhlLXRvYycpO1xuICAgICAgICAgICAgICAgIGxldCB0aXRsZSA9IHRoaXMucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aXRsZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4uY2xhc3NMaXN0LnRvZ2dsZSgndG9jLWNoaWxkcmVuLWhpZGUnKTtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZWdfc2hvd190aGVfKGVsZW06IEhUTUxFbGVtZW50LCBoZWFkX2lkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0xO2k8PTY7aSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaCR7aX1baWQ9JyR7aGVhZF9pZH0nXWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZihmID09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBmb2xkLnNob3coZik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGxldCBsaW5rcyA9IHRvY19jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi50b2MtdGl0bGUgYVwiKTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxsaW5rcy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluayA9IGxpbmtzW2ldIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgbGV0IHRhZyA9IGxpbmsuYXR0cmlidXRlc1tcImhyZWZcIl0udmFsdWUuc3Vic3RyKDEpO1xuICAgICAgICAgICAgcmVnX3Nob3dfdGhlXyhsaW5rLCB0YWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIGhpZGUgdG9jICovXG4gICAgICAgIGxldCB0b2Nfc2hvdyA9IHRydWU7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmKCF0b2Nfc2hvdykgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IHIgPSBldi50YXJnZXQgYXMgRWxlbWVudDtcbiAgICAgICAgICAgIHdoaWxlIChyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAociA9PSBnbC50b2NfY29udGFpbmVyIHx8IHIgPT0gZ2wudG9jX3N3aXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgciA9IHIucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhpZGVfdG9jKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChldikgPT4ge1xuICAgICAgICAgICAgaWYodG9jX3Nob3cpIGhpZGVfdG9jKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiB0b2dnbGUgc3dpdGNoZXIgKi9cbiAgICAgICAgdXRpbHMudGltZW91dF9hZGRfY2xhc3MoZ2wudG9jX3N3aXRjaGVyLCAnaGlkZScsIHRydWUsIDI1MDAsIChlLCBmKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIGYoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZ2wudG9jX3N3aXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHNob3dfdG9jKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4iLCJcbmZ1bmN0aW9uIGdldENhbGxlciAoKSAvL3tcbntcbiAgICBsZXQgcmVnID0gL1xccythdCAoXFxTKykoIFxcKChbXildKylcXCkpPy9nO1xuICAgIGxldCBlZTogc3RyaW5nO1xuICAgIHRyeSB7dGhyb3cgbmV3IEVycm9yKCk7fVxuICAgIGNhdGNoIChlKSB7ZWUgPSBlLnN0YWNrO31cbiAgICByZWcuZXhlYyhlZSk7XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIGxldCBtbSA9IHJlZy5leGVjKGVlKTtcbiAgICBpZiAoIW1tKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gW21tWzNdIHx8IFwiXCIsIG1tWzFdXTtcbn07IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gZGVidWcoLi4uYXJndikgLy97XG57XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBcImRlYnVnIG1lc3NhZ2VcIjtcbiAgICBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7bXNnfV06IGA7XG4gICAgY29uc29sZS5kZWJ1Zyhtc2csIC4uLmFyZ3YpO1xufSAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF9leHByKHY6IGJvb2xlYW4sIGVyciA9IFwiYXNzZXJ0IGZhaWxcIikgLy97XG57XG4gICAgaWYgKHYpIHJldHVybjtcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHtlcnJ9XTogYDtcbiAgICB0aHJvdyBtc2c7XG59IC8vfVxuXG5sZXQgY2FsbGJhY2tfc3RhY2s6IFtGdW5jdGlvbiwgYW55W11dW10gPSBbXVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoZnVuYywgLi4uYXJncykge1xuICAgIGFzc2VydF9leHByKHR5cGVvZihmdW5jKSA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgY2FsbGJhY2tfc3RhY2sucHVzaChbZnVuYywgYXJnc10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbF9yZWdpc3Rlcl9mdW5jdGlvbnMoKSB7XG4gICAgd2hpbGUoY2FsbGJhY2tfc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZmEgPSBjYWxsYmFja19zdGFjay5wb3AoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhWzBdLmNhbGwod2luZG93LCAuLi5mYVsxXSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG50eXBlIGhvd3RvY2FsbCA9IChlbGVtOiBIVE1MRWxlbWVudCwgYWRkX2Z1bmM6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqdXN0IHJlbW92ZSB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X3JlbW92ZV9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHM6IHN0cmluZywgdGltZV9tczogbnVtYmVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBpZighYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX3JlbW92ZSwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfYWRkKTtcbn1cblxuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganN1dCBhZGQgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9hZGRfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nLCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVfbXM6IG51bWJlciwgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBpZihhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX2FkZCwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfcmVtb3ZlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQyaHRtbChzdHI6IHN0cmluZyk6IEhUTUxFbGVtZW50IFxue1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHIudHJpbSgpO1xuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudDtcbn1cblxuIl19
