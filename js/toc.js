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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdG9jLnRzIiwidGhlbWVzL3NsYW1lL3NvdXJjZS9qcy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLCtCQUFpQztBQUNqQyxpQ0FBc0M7QUFDdEMsNkJBQStCO0FBRS9CLG1CQUFtQjtBQUVuQix3REFBd0Q7QUFFeEQsV0FBVztBQUNYLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNoQyxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFFakMsSUFBTSxTQUFTLEdBQUcsdUxBR1MsQ0FBQztBQUM1QixJQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsSUFBSSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdkIsU0FBUyx1QkFBdUIsQ0FBQyxJQUFpQjtJQUU5QyxJQUFNLEtBQUssR0FBa0IsRUFBRSxDQUFDO0lBQ2hDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNuQixTQUFTLGdCQUFnQixDQUFDLEdBQVc7UUFDakMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QixJQUFHLENBQUMsSUFBSSxJQUFJO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkIsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksQ0FBQyxHQUFrQixFQUFFLENBQUM7SUFDMUIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3BDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLGdDQUFnQztRQUNoQyxJQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJO1lBQ3pCLFNBQVM7UUFDYixJQUFJLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNoQixJQUFJLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFHLEVBQUUsSUFBSSxFQUFFO2dCQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7Z0JBQ2hCLE1BQU07U0FDZDtRQUNELEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7UUFDRCxJQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNYLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFHLENBQUMsRUFBRTtZQUNGLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBZ0IsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBZ0IsQ0FBQyxDQUFDO1NBQzVCO0tBQ0o7SUFFRCxTQUFTLE1BQU0sQ0FBQyxJQUFpQjtRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixJQUFJLElBQUksR0FBNkIsRUFBRSxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUN4QixLQUFlLFVBQWMsRUFBZCxLQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBZCxjQUFjLEVBQWQsSUFBYyxFQUFFO2dCQUEzQixJQUFJLEdBQUcsU0FBQTtnQkFDUCxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsSUFBSSxNQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUMxQjtnQkFDRCxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuQztTQUNKO1FBQ0QsS0FBd0IsVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUksRUFBRTtZQUF0QixJQUFBLGVBQVksRUFBWCxNQUFJLFFBQUEsRUFBRSxNQUFJLFFBQUE7WUFDZixJQUFJLE1BQUk7Z0JBQUUsTUFBTSxDQUFDLE1BQUksQ0FBQyxDQUFDOztnQkFDYixNQUFNLENBQUMsTUFBSSxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBQ0QsU0FBUyxNQUFNLENBQUMsSUFBaUI7UUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ3hCLEtBQWUsVUFBYyxFQUFkLEtBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFkLGNBQWMsRUFBZCxJQUFjO2dCQUF6QixJQUFJLEdBQUcsU0FBQTtnQkFDUCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUFBO1NBQ3BDO0lBQ0wsQ0FBQztJQUNELFNBQVMsU0FBUztRQUNkLEtBQWEsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUssRUFBRTtZQUFoQixJQUFJLENBQUMsY0FBQTtZQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN6QyxJQUFHLEVBQUUsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLGFBQWEsSUFBSSxDQUFDO2dCQUNsQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUNELFNBQVMsVUFBVTtRQUNmLEtBQWMsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUs7WUFBZixJQUFJLEVBQUUsY0FBQTtZQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUFBO0lBQ25CLENBQUM7SUFDRCxTQUFTLFVBQVU7UUFDZixLQUFjLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO1lBQWYsSUFBSSxFQUFFLGNBQUE7WUFDTixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FBQTtJQUNuQixDQUFDO0lBQ0QsU0FBUyxhQUFhLENBQUMsSUFBaUI7UUFDcEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFHLEdBQUcsR0FBRyxDQUFDO1lBQUUsT0FBTztRQUNuQixPQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2IsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMzQjtJQUNMLENBQUM7SUFDRCxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ3RCLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDdEIsV0FBVyxHQUFHLGFBQWEsQ0FBQztJQUU1QixLQUFrQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO1FBQXJCLElBQUksTUFBTSxjQUFBO1FBQ1YsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUM3RCxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLElBQUcsQ0FBQyxJQUFJLElBQUk7WUFDUixTQUFTO1FBRWIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUU7WUFDcEMsSUFBSSxDQUFDLEdBQWdCLEVBQUUsQ0FBQyxNQUFxQixDQUFDO1lBQzlDLE9BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDeEQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNYLElBQUksTUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pDLElBQUcsTUFBSTtvQkFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QjtZQUNELEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7S0FDTjtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLFdBQVc7SUFDaEIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBZ0IsQ0FBQztJQUNoRSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsSUFBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxzQkFBc0IsQ0FBQyxNQUFNO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDbkUsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBRTtRQUM3QyxJQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUVELElBQU0sR0FBRyxHQUFHO0lBQ1IsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBZ0IsQ0FBQztJQUNoRSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlCLE9BQU87S0FDVjtJQUNELE9BQU8sdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFBO0FBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBRWpCLFNBQWdCLE9BQU87SUFDbkIsS0FBSyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQ2pCLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNsQixDQUFDO0FBSEQsMEJBR0M7QUFFRCxTQUFnQixPQUFPO0lBQ25CLElBQUcsUUFBUTtRQUFFLFFBQVEsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFGRCwwQkFFQztBQUNELFNBQWdCLE9BQU87SUFDbkIsSUFBRyxRQUFRO1FBQUUsUUFBUSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUZELDBCQUVDO0FBQ0QsU0FBZ0IsSUFBSSxDQUFDLElBQWlCO0lBQ2xDLG1CQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRSxJQUFHLFdBQVc7UUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUhELG9CQUdDO0FBRUQsU0FBZ0IsT0FBTztJQUNuQixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDZCxJQUFJLENBQUM7UUFBRSxPQUFPO0lBQ2QsS0FBSyxDQUFDLHNCQUFzQixDQUFDO1FBQ3pCLElBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZTtZQUFFLE9BQU87UUFDL0IsT0FBTyxFQUFFLENBQUM7UUFFVixNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2YsSUFBRyxXQUFXLEVBQUU7Z0JBQUUsT0FBTyxFQUFFLENBQUM7UUFDaEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBWEQsMEJBV0M7Ozs7OztBQy9MRCwrQkFBK0I7QUFDbEIsUUFBQSxrQkFBa0IsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3hFLFFBQUEsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN4RSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGNBQWMsR0FBUSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNuRSxRQUFBLGVBQWUsR0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRSxRQUFBLGVBQWUsR0FBTyx1QkFBZSxDQUFDO0FBQ3RDLFFBQUEsZ0JBQWdCLEdBQU0sS0FBSyxDQUFDO0FBRXpDLGNBQWM7QUFDRCxRQUFBLFdBQVcsR0FBTSxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELFFBQUEsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCxRQUFBLGFBQWEsR0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFELFFBQUEsWUFBWSxHQUFLLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFdEUsdUJBQXVCO0FBQ1YsUUFBQSxXQUFXLEdBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQy9ELFFBQUEsZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUVsRixlQUFlO0FBQ0YsUUFBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVqRSxvQkFBb0I7QUFDUCxRQUFBLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFFBQUEsWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7O0FDekJ6RSwrQkFBZ0M7QUFDaEMsNkJBQThCO0FBQzlCLGlDQUFxQztBQUNyQyw2QkFBOEI7QUFFOUIsbURBQW1EO0FBRW5EO0lBeUNJLGtCQUFtQixJQUFlLEVBQUUsSUFBZSxFQUFFLEtBQWdCLEVBQUUsU0FBd0I7UUFBNUUscUJBQUEsRUFBQSxTQUFlO1FBQUUscUJBQUEsRUFBQSxTQUFlO1FBQUUsc0JBQUEsRUFBQSxTQUFlLENBQUM7UUFBRSwwQkFBQSxFQUFBLGNBQXdCO1FBQzNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUF4Q08sZ0NBQWEsR0FBckIsVUFBc0IsRUFBVSxFQUFFLFVBQW1CO1FBQ2pELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNqQixJQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixHQUFHLElBQUksVUFBVSxDQUFDO1lBQ2xCLEtBQWUsVUFBZ0IsRUFBaEIsS0FBQSxJQUFJLENBQUMsV0FBVyxFQUFoQixjQUFnQixFQUFoQixJQUFnQjtnQkFBM0IsSUFBSSxHQUFHLFNBQUE7Z0JBQ1AsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQUE7WUFDdkIsR0FBRyxJQUFJLEdBQUcsQ0FBQztTQUNkO1FBQ0QsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUVYLElBQUcsVUFBVSxFQUFFO1lBQ1gsR0FBRyxJQUFJLHlCQUF5QixDQUFDO1lBQ2pDLEdBQUcsSUFBSSxvQ0FBaUMsRUFBRSxHQUFHLENBQUMsMEJBQW1CLElBQUksQ0FBQyxNQUFNLFdBQUssSUFBSSxDQUFDLE1BQU0sZUFBWSxDQUFDO1lBQ3pHLHNFQUFzRTtZQUN0RSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDNUIsR0FBRyxJQUFJLG1NQUdJLENBQUM7YUFDZjtZQUNELEdBQUcsSUFBSSxRQUFRLENBQUM7U0FDbkI7UUFFRCxHQUFHLElBQUksNEJBQTRCLENBQUM7UUFDcEMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUVoQixHQUFHLElBQUksUUFBUSxDQUFDO1FBQ2hCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVVNLDhCQUFXLEdBQWxCLFVBQW1CLEtBQWU7UUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLDJCQUFRLEdBQWYsY0FBK0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUEsQ0FBQztJQUNoRCx3QkFBSyxHQUFaLGNBQXdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUM7SUFFdEMsK0JBQVksR0FBbkIsY0FBdUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUM7SUFDaEUsZUFBQztBQUFELENBekRBLEFBeURDLElBQUE7QUFLRCxTQUFTLE9BQU8sQ0FBQyxLQUFpQixFQUFFLElBQXVCLEVBQUUsS0FBb0IsRUFDaEUsSUFBaUIsRUFBRSxLQUFjO0lBQzlDLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1gsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLE9BQU0sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUMxRCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELElBQUksU0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN4RCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN6QjtJQUVELElBQUcsS0FBSyxFQUFFO1FBQ04sS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3BDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFnQixDQUFDO1lBQ3pDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDekM7S0FDSjtBQUNMLENBQUM7QUFDRCxTQUFTLGlCQUFpQixDQUFDLElBQXVCLEVBQUUsS0FBb0I7SUFFcEUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDaEMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsSUFBSSxTQUFTLEdBQUcsbUJBQW1CLENBQUM7SUFDcEMsSUFBSSxJQUFJLEdBQUcsVUFBQyxJQUFpQjtRQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSTtZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFDRixJQUFJLEtBQUssR0FBRyxVQUFDLElBQWlCO1FBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQztJQUNGLE9BQU8saUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCxTQUFTLFFBQVE7SUFDYixFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFFRCxTQUFTLFFBQVE7SUFDYixFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxVQUFVO0FBQ1YsSUFBTSxLQUFLLEdBQUcsMkNBSWIsQ0FBQztBQUNGLFNBQWdCLE1BQU07SUFDbEIsSUFBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlO1FBQUUsT0FBTztJQUUvQixLQUFLLENBQUMsc0JBQXNCLENBQUM7UUFDekIsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFDbkIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFDckMsbUJBQVcsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7UUFDbkMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBRTNDLElBQUksZUFBZSxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hFLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxlQUFlLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQWdCLENBQUM7WUFDbkQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQWM7Z0JBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUMvQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3hDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQy9DLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDckIsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxTQUFTLGFBQWEsQ0FBQyxJQUFpQixFQUFFLE9BQWU7WUFDckQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEVBQUU7Z0JBQzlCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsSUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBSSxDQUFDLGFBQVEsT0FBTyxPQUFJLENBQWdCLENBQUM7b0JBQ3hFLElBQUcsQ0FBQyxJQUFJLElBQUk7d0JBQUUsU0FBUztvQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDYixPQUFPO2lCQUNWO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDO1FBQ0QsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNELEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO1lBQzVCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQWdCLENBQUM7WUFDbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUI7UUFFRCxlQUFlO1FBQ2YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFjO1lBQzlDLElBQUcsQ0FBQyxRQUFRO2dCQUFFLE9BQU87WUFDckIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQWlCLENBQUM7WUFDN0IsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNkLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZO29CQUM3QyxPQUFPO2dCQUNYLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO2FBQ3ZCO1lBQ0QsUUFBUSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBQyxFQUFFO1lBQ25DLElBQUcsUUFBUTtnQkFBRSxRQUFRLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQUVILHNCQUFzQjtRQUN0QixLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBQyxFQUFFO2dCQUNuQyxDQUFDLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEVBQUU7WUFDekMsUUFBUSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQWxFRCx3QkFrRUM7Ozs7Ozs7Ozs7Ozs7QUNyTUQsU0FBUyxTQUFTO0lBRWQsSUFBSSxHQUFHLEdBQUcsNkJBQTZCLENBQUM7SUFDeEMsSUFBSSxFQUFVLENBQUM7SUFDZixJQUFJO1FBQUMsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0tBQUM7SUFDeEIsT0FBTyxDQUFDLEVBQUU7UUFBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUFDO0lBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUMsRUFBRTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFBQSxDQUFDLENBQUMsR0FBRztBQUVOLFNBQWdCLEtBQUs7SUFBQyxjQUFPO1NBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztRQUFQLHlCQUFPOztJQUV6QixJQUFJLE1BQU0sR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN6QixJQUFJLEdBQUcsR0FBRyxlQUFlLENBQUM7SUFDMUIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFNLENBQUMsQ0FBQyxDQUFDLE1BQUksR0FBRyxRQUFLLENBQUM7SUFDaEUsT0FBTyxDQUFDLEtBQUssT0FBYixPQUFPLGtCQUFPLEdBQUcsR0FBSyxJQUFJLEdBQUU7QUFDaEMsQ0FBQyxDQUFDLEdBQUc7QUFOTCxzQkFNQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxDQUFVLEVBQUUsR0FBbUI7SUFBbkIsb0JBQUEsRUFBQSxtQkFBbUI7SUFFdkQsSUFBSSxDQUFDO1FBQUUsT0FBTztJQUNkLElBQUksTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQ3pCLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFNLENBQUMsQ0FBQyxDQUFDLE1BQUksR0FBRyxRQUFLLENBQUM7SUFDcEUsTUFBTSxHQUFHLENBQUM7QUFDZCxDQUFDLENBQUMsR0FBRztBQU5MLGtDQU1DO0FBRUQsSUFBSSxjQUFjLEdBQXdCLEVBQUUsQ0FBQTtBQUM1QyxTQUFnQixzQkFBc0IsQ0FBQyxJQUFJO0lBQUUsY0FBTztTQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87UUFBUCw2QkFBTzs7SUFDaEQsV0FBVyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQztJQUN6QyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUhELHdEQUdDO0FBRUQsU0FBZ0IsdUJBQXVCOztJQUNuQyxPQUFNLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLElBQUksRUFBRSxHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJO1lBQ0EsQ0FBQSxLQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLElBQUksMkJBQUMsTUFBTSxHQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRTtTQUNoQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QjtLQUNKO0FBQ0wsQ0FBQztBQVRELDBEQVNDO0FBR0QsbURBQW1EO0FBQ25ELFNBQWdCLG9CQUFvQixDQUFDLElBQWlCLEVBQUUsR0FBWSxFQUMvQixHQUFXLEVBQUUsT0FBZSxFQUM1QixJQUFlO0lBQ2hELElBQUksS0FBSyxHQUFZLEdBQUcsQ0FBQztJQUN6QixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7SUFDeEIsU0FBUyxPQUFPO1FBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNkLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNELFNBQVMsSUFBSTtRQUNULElBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ2hCO2FBQU07WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFyQkQsb0RBcUJDO0FBRUQsZ0RBQWdEO0FBQ2hELFNBQWdCLGlCQUFpQixDQUFDLElBQWlCLEVBQUUsR0FBVyxFQUFFLEdBQVksRUFDNUMsT0FBZSxFQUFFLElBQWU7SUFDOUQsSUFBSSxLQUFLLEdBQVksR0FBRyxDQUFDO0lBQ3pCLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztJQUN4QixTQUFTLElBQUk7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsU0FBUyxPQUFPO1FBQ1osSUFBRyxLQUFLLEVBQUU7WUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2pCO2FBQU07WUFDSCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFwQkQsOENBb0JDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLEdBQVc7SUFFakMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixPQUFPLEdBQUcsQ0FBQyxVQUF5QixDQUFDO0FBQ3pDLENBQUM7QUFMRCw4QkFLQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgYXNzZXJ0X2V4cHIgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIGdsIGZyb20gJy4vZ2xvYmFsJztcblxuLyoqIGZvbGQgc2VjdGlvbiAqL1xuXG4vKiogVE9ETyByZWNvbnN0cnVjdCBjb2RlLCBjdXJyZW50bHkgdGhhdCBzZWVtJ3MgdWdseSAqL1xuXG4vKiogVE9ETyAqL1xuY29uc3Qgc2F2ZV9zeW0gPSBcInN1Yl9lbGVtZW50c1wiO1xuY29uc3QgcGFyZW50X3N5bSA9IFwicGFyZW50X2hlYWRcIjtcblxuY29uc3QgZm9sZF9leHByID0gYDxzcGFuIGNsYXNzPSdmb2xkLWJ1dHRvbic+XG4gICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtZG93biBzaG93Jz48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtcmlnaHQgaGlkZSc+PC9pPlxuICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5gO1xuY29uc3QgdmFsaWRfdGFnID0gL1toSF0oWzEyMzQ1Nl0pLztcbmNvbnN0IGhpZGVfZWxlbSA9IFwiLS1oaWRlLS1cIjtcbmxldCBtYXJrZG93bl9ib2R5X2NoaWxkcmVuID0gW107XG5sZXQgc2hvd19hbGwgPSBudWxsO1xubGV0IGhpZGVfYWxsID0gbnVsbDtcbmxldCBzaG93X2FfZWxlbSA9IG51bGw7XG5mdW5jdGlvbiBpbnNlcnRfZm9sZF9idXR0b25fdG9faChlbGVtOiBIVE1MRWxlbWVudClcbntcbiAgICBjb25zdCBhbGxfaDogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIG1hcmtkb3duX2JvZHlfY2hpbGRyZW4gPSBbXTtcbiAgICBzaG93X2FsbCA9IG51bGw7XG4gICAgaGlkZV9hbGwgPSBudWxsO1xuICAgIHNob3dfYV9lbGVtID0gbnVsbDtcbiAgICBmdW5jdGlvbiBnZXRfbGV2ZWxfYnlfdGFnKHRhZzogc3RyaW5nKSB7XG4gICAgICAgIGxldCBtID0gdGFnLm1hdGNoKHZhbGlkX3RhZyk7XG4gICAgICAgIGlmKG0gPT0gbnVsbCkgcmV0dXJuIDc7XG4gICAgICAgIHJldHVybiBwYXJzZUludChtWzFdKTtcbiAgICB9XG5cbiAgICBsZXQgczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIGZvcihsZXQgaT0wO2k8ZWxlbS5jaGlsZHJlbi5sZW5ndGg7aSsrKSB7XG4gICAgICAgIGxldCBjID0gZWxlbS5jaGlsZHJlbltpXTtcbiAgICAgICAgbWFya2Rvd25fYm9keV9jaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICBsZXQgbSA9IGMudGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICAvKiogc2tpcCB1bm5lY2Vzc2FyeSBlbGVtZW50cyAqL1xuICAgICAgICBpZihzLmxlbmd0aCA9PSAwICYmIG0gPT0gbnVsbClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgbmwgPSBnZXRfbGV2ZWxfYnlfdGFnKGMudGFnTmFtZSk7XG4gICAgICAgIHdoaWxlKHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IG9sID0gZ2V0X2xldmVsX2J5X3RhZyhzW3MubGVuZ3RoIC0gMV0udGFnTmFtZSk7XG4gICAgICAgICAgICBpZihubCA8PSBvbCkgcy5wb3AoKTtcbiAgICAgICAgICAgIGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBqPTA7ajxzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc1tqXTtcbiAgICAgICAgICAgIHhbc2F2ZV9zeW1dID0geFtzYXZlX3N5bV0gfHwgW107XG4gICAgICAgICAgICB4W3NhdmVfc3ltXS5wdXNoKGMpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGNbcGFyZW50X3N5bV0gPSBzW3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmKG0pIHtcbiAgICAgICAgICAgIGFsbF9oLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICBzLnB1c2goYyBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93X18oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgbGV0IGhlYWQ6IFtIVE1MRWxlbWVudCwgYm9vbGVhbl1bXSA9IFtdO1xuICAgICAgICBpZiAoZWxlbVtzYXZlX3N5bV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKGxldCB4eXogb2YgZWxlbVtzYXZlX3N5bV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNfaGVhZCA9IHZhbGlkX3RhZy50ZXN0KHh5ei50YWdOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNfaGVhZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2hvdyA9ICF4eXouY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZC5wdXNoKFt4eXosIHNob3ddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeHl6LmNsYXNzTGlzdC5yZW1vdmUoaGlkZV9lbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IFtlbGVtLCBzaG93XSBvZiBoZWFkKSB7XG4gICAgICAgICAgICBpZiAoc2hvdykgc2hvd19fKGVsZW0pO1xuICAgICAgICAgICAgZWxzZSAgICAgIGhpZGVfXyhlbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBoaWRlX18oZWxlbTogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgaWYgKGVsZW1bc2F2ZV9zeW1dICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvcihsZXQgeHl6IG9mIGVsZW1bc2F2ZV9zeW1dKVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QuYWRkKGhpZGVfZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdW5pbnN0YWxsKCkge1xuICAgICAgICBmb3IobGV0IGMgb2YgYWxsX2gpIHtcbiAgICAgICAgICAgIHNob3dfXyhjKTtcbiAgICAgICAgICAgIGNbc2F2ZV9zeW1dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGJ0ID0gYy5xdWVyeVNlbGVjdG9yKFwiLmZvbGQtYnV0dG9uXCIpO1xuICAgICAgICAgICAgaWYoYnQgIT0gbnVsbCAmJiBidC5wYXJlbnRFbGVtZW50ID09IGMpXG4gICAgICAgICAgICAgICAgYy5yZW1vdmVDaGlsZChidCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hbGxfXygpIHtcbiAgICAgICAgZm9yKGxldCBiYiBvZiBhbGxfaClcbiAgICAgICAgICAgIHNob3dfXyhiYik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZGVfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBoaWRlX18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93X2FfZWxlbV9fKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBpZHggPSBhbGxfaC5pbmRleE9mKGVsZW0pO1xuICAgICAgICBpZihpZHggPCAwKSByZXR1cm47XG4gICAgICAgIHdoaWxlKGVsZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgc2hvd19fKGVsZW0pO1xuICAgICAgICAgICAgZWxlbSA9IGVsZW1bcGFyZW50X3N5bV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd19hbGwgPSBzaG93X2FsbF9fO1xuICAgIGhpZGVfYWxsID0gaGlkZV9hbGxfXztcbiAgICBzaG93X2FfZWxlbSA9IHNob3dfYV9lbGVtX187XG5cbiAgICBmb3IobGV0IGJ1dHRvbiBvZiBhbGxfaCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGJ1dHRvbltzYXZlX3N5bV0pICYmIGJ1dHRvbltzYXZlX3N5bV0ubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh1dGlscy50ZXh0Mmh0bWwoZm9sZF9leHByKSk7XG5cbiAgICAgICAgbGV0IHggPSBidXR0b24ucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgaWYoeCA9PSBudWxsKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgeC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBsZXQgbjogSFRNTEVsZW1lbnQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZShuICE9IG51bGwgJiYgIW4udGFnTmFtZS50b0xvd2VyQ2FzZSgpLm1hdGNoKHZhbGlkX3RhZykpXG4gICAgICAgICAgICAgICAgbiA9IG4ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmIChuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvdyA9ICFuLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgaWYoc2hvdykgaGlkZV9fKG4pO1xuICAgICAgICAgICAgICAgIGVsc2UgICAgIHNob3dfXyhuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaW5zdGFsbDtcbn1cblxuZnVuY3Rpb24gbmVlZF91cGRhdGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLWJvZHlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmFkIHNlbGVjdG9yXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKG0uY2hpbGRyZW4ubGVuZ3RoICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICBmb3IobGV0IGk9MDtpPG1hcmtkb3duX2JvZHlfY2hpbGRyZW4ubGVuZ3RoO2krKykge1xuICAgICAgICBpZihtLmNoaWxkcmVuW2ldICE9IG1hcmtkb3duX2JvZHlfY2hpbGRyZW5baV0pXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBpbnMgPSAoKSA9PiB7XG4gICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLWJvZHlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmFkIHNlbGVjdG9yXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBpbnNlcnRfZm9sZF9idXR0b25fdG9faChtKTtcbn1cbmxldCB1bmlucyA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgIHVuaW5zICYmIHVuaW5zKCk7XG4gICAgdW5pbnMgPSBpbnMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVBbGwoKSB7XG4gICAgaWYoaGlkZV9hbGwpIGhpZGVfYWxsKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2hvd0FsbCgpIHtcbiAgICBpZihzaG93X2FsbCkgc2hvd19hbGwoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzaG93KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgYXNzZXJ0X2V4cHIoZWxlbSAmJiBlbGVtLnRhZ05hbWUgJiYgdmFsaWRfdGFnLnRlc3QoZWxlbS50YWdOYW1lKSk7XG4gICAgaWYoc2hvd19hX2VsZW0pIHNob3dfYV9lbGVtKGVsZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9fZm9sZCgpIHtcbiAgICBsZXQgbSA9IGZhbHNlO1xuICAgIGlmIChtKSByZXR1cm47XG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbCgoKSA9PiB7XG4gICAgICAgIGlmKCFnbC5pbl9wb3N0X3NlY3Rpb24pIHJldHVybjtcbiAgICAgICAgcmVmcmVzaCgpO1xuXG4gICAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZihuZWVkX3VwZGF0ZSgpKSByZWZyZXNoKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xufVxuXG4iLCJcbi8qKiBpZGVudGlmeSBjdXJyZW50IHNlY3Rpb24gKi9cbmV4cG9ydCBjb25zdCBpbl9hcmNoaXZlX3NlY3Rpb24gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlcy1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2NhdGVnb3J5X3NlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhdGVnb3J5LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5faG9tZV9zZWN0aW9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3RhZ19zZWN0aW9uICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhZy1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX3Bvc3Rfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wYWdlX3NlY2l0b24gICAgID0gaW5fcG9zdF9zZWN0aW9uO1xuZXhwb3J0IGNvbnN0IGluX2Fib3V0X3NlY3Rpb24gICAgPSBmYWxzZTtcblxuLyoqIGJ1dHRvbnMgKi9cbmV4cG9ydCBjb25zdCBob21lX2J1dHRvbiAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1idXR0b25cIik7XG5leHBvcnQgY29uc3QgYXJjaGl2ZV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyY2hpdmUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGdpdGh1Yl9idXR0b24gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnaXRodWItYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFib3V0X2J1dHRvbiAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhYm91dC1idXR0b25cIik7XG5cbi8qKiBnZW5lcmFsIGVsZW1lbnRzICovXG5leHBvcnQgY29uc3QgdGFnc19idXR0b24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLXRhZ3MtZWxlbVwiKTtcbmV4cG9ydCBjb25zdCBjYXRlZ29yeV9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXItY2F0ZWdvcmllcy1lbGVtXCIpO1xuXG4vKiogZ290byB0b3AgKi9cbmV4cG9ydCBjb25zdCBnb3RvX3RvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ290by10b3AtZWxlbVwiKTtcblxuLyoqIHRvYyBjb250YWluZXIgKi9cbmV4cG9ydCBjb25zdCB0b2NfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvY1wiKTtcbmV4cG9ydCBjb25zdCB0b2Nfc3dpdGNoZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3QtdG9jLXN3aXRjaGVyXCIpO1xuXG4iLCJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgeyBhc3NlcnRfZXhwciB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgKiBhcyBmb2xkIGZyb20gJy4vZm9sZCdcblxuLyoqIGdlbmVyYXRlIFRhYmxlIG9mIENvbnRlbnRzIGJhc2Ugb24gPGg/PiB0YWdzICovXG5cbmNsYXNzIFRPQ0VudHJ5IHtcbiAgICBwcml2YXRlIG1fY2xhc3NMaXN0OiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIG1fbGV2ZWw6IG51bWJlcjtcbiAgICBwcml2YXRlIG1fY2hpbGRyZW46IFRPQ0VudHJ5W107XG4gICAgcHJpdmF0ZSBtX2xpbms6IHN0cmluZztcbiAgICBwcml2YXRlIG1fbmFtZTogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZV9odG1sKG5vOiBudW1iZXIsIHNob3dfdGl0bGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0ID0gXCI8ZGl2XCI7XG4gICAgICAgIGlmKHRoaXMubV9jbGFzc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0ICs9IFwiIGNsYXNzPSdcIjtcbiAgICAgICAgICAgIGZvcihsZXQgY2xzIG9mIHRoaXMubV9jbGFzc0xpc3QpXG4gICAgICAgICAgICAgICAgcmV0ICs9IChcIiBcIiArIGNscyk7XG4gICAgICAgICAgICByZXQgKz0gXCInXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IFwiPlwiO1xuXG4gICAgICAgIGlmKHNob3dfdGl0bGUpIHtcbiAgICAgICAgICAgIHJldCArPSBcIjxkaXYgY2xhc3M9J3RvYy10aXRsZSc+XCI7XG4gICAgICAgICAgICByZXQgKz0gYDxkaXY+PHNwYW4gY2xhc3M9J3RvYy1udW1iZXInPiR7bm8gKyAxfTwvc3Bhbj48YSBocmVmPVwiJHt0aGlzLm1fbGlua31cIj4ke3RoaXMubV9uYW1lfTwvYT48L2Rpdj5gO1xuICAgICAgICAgICAgLyoqIHRvZ2dsZSBoaWRlLXRoZS10b2MgY2xhc3Mgb2YgdGhpcyBjb250cm9sbGVyIHRvIHN3aXRjaCB0aGUgaWNvbiAqL1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IGA8ZGl2IGNsYXNzPSd0b2MtY29udHJvbGxlcic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLWRvd24gdG9jLXNob3cnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtcmlnaHQgdG9jLWhpZGUnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ICs9IFwiPGRpdiBjbGFzcz0ndG9jLWNoaWxkcmVuJz5cIjtcbiAgICAgICAgZm9yKGxldCBjPTA7Yzx0aGlzLm1fY2hpbGRyZW4ubGVuZ3RoO2MrKykge1xuICAgICAgICAgICAgbGV0IGNsZCA9IHRoaXMubV9jaGlsZHJlbltjXTtcbiAgICAgICAgICAgIHJldCArPSBjbGQuZ2VuZXJhdGVfaHRtbChjLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcblxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nPScnLCBsaW5rOiBzdHJpbmc9JycsIGxldmVsOiBudW1iZXI9LTEsIGNsYXNzTGlzdDogc3RyaW5nW10gPSBbXSkge1xuICAgICAgICB0aGlzLm1fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubV9saW5rID0gbGluaztcbiAgICAgICAgdGhpcy5tX2xldmVsID0gbGV2ZWw7XG4gICAgICAgIHRoaXMubV9jbGFzc0xpc3QgPSBjbGFzc0xpc3Quc2xpY2UoKTtcbiAgICAgICAgdGhpcy5tX2NoaWxkcmVuID0gW107XG4gICAgfVxuXG4gICAgcHVibGljIGluc2VydENoaWxkKGNoaWxkOiBUT0NFbnRyeSkge1xuICAgICAgICB0aGlzLm1fY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoaWxkcmVuKCk6IFRPQ0VudHJ5W10ge3JldHVybiB0aGlzLm1fY2hpbGRyZW47fVxuICAgIHB1YmxpYyBsZXZlbCgpOiBudW1iZXIge3JldHVybiB0aGlzLm1fbGV2ZWw7fVxuXG4gICAgcHVibGljIGdlbmVyYXRlSHRtbCgpIHtyZXR1cm4gdGhpcy5nZW5lcmF0ZV9odG1sKDAsIGZhbHNlKTt9XG59XG5cbnR5cGUgVG9jRW50cnlQcmVkaWNhdGUgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IGJvb2xlYW47XG50eXBlIGdldEVudHJ5TGV2ZWwgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IG51bWJlcjtcblxuZnVuY3Rpb24gdHJ5X3RvYyhzdGFjazogVE9DRW50cnlbXSwgcHJlZDogVG9jRW50cnlQcmVkaWNhdGUsIGxldmVsOiBnZXRFbnRyeUxldmVsLFxuICAgICAgICAgICAgICAgICBlbGVtOiBIVE1MRWxlbWVudCwgY2hpbGQ6IGJvb2xlYW4pIHtcbiAgICBpZihwcmVkKGVsZW0pKSB7XG4gICAgICAgIGxldCBsID0gbGV2ZWwoZWxlbSk7XG4gICAgICAgIHdoaWxlKHN0YWNrLmxlbmd0aCA+IDAgJiYgbCA8PSBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCgpKVxuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIGFzc2VydF9leHByKHN0YWNrLmxlbmd0aCA+IDApO1xuICAgICAgICBsZXQgbiA9IGVsZW0uaW5uZXJUZXh0O1xuICAgICAgICBsZXQgYXR0cl9pZCA9IGVsZW0uYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgbGV0IGxpbmsgPSBcIiNcIiArIChhdHRyX2lkID8gYXR0cl9pZC52YWx1ZSA6ICcnKTtcbiAgICAgICAgbGV0IG5ld19lbnRyeSA9IG5ldyBUT0NFbnRyeShuLCBsaW5rLCBsLCBbXCJ0b2MtZW50cnlcIl0pO1xuICAgICAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5pbnNlcnRDaGlsZChuZXdfZW50cnkpO1xuICAgICAgICBzdGFjay5wdXNoKG5ld19lbnRyeSk7XG4gICAgfVxuXG4gICAgaWYoY2hpbGQpIHtcbiAgICAgICAgZm9yKGxldCBjPTA7YzxlbGVtLmNoaWxkcmVuLmxlbmd0aDtjKyspIHtcbiAgICAgICAgICAgIGxldCBjYyA9IGVsZW0uY2hpbGRyZW5bY10gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICB0cnlfdG9jKHN0YWNrLCBwcmVkLCBsZXZlbCwgY2MsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0X3RvY19mcm9tX2h0bWwocHJlZDogVG9jRW50cnlQcmVkaWNhdGUsIGxldmVsOiBnZXRFbnRyeUxldmVsKTogVE9DRW50cnkgXG57XG4gICAgbGV0IHN0YWNrID0gW107XG4gICAgbGV0IHRoZV90b3AgPSBuZXcgVE9DRW50cnkoJycsICcnLCAwLCBbJ3RvYy1maXJzdCddKTtcbiAgICBzdGFjay5wdXNoKHRoZV90b3ApO1xuICAgIGxldCByb290ID0gd2luZG93LmRvY3VtZW50LmJvZHk7XG4gICAgdHJ5X3RvYyhzdGFjaywgcHJlZCwgbGV2ZWwsIHJvb3QsIHRydWUpO1xuICAgIHJldHVybiBzdGFja1swXTtcbn1cblxuZnVuY3Rpb24gZ2V0VE9DKCk6IFRPQ0VudHJ5IHtcbiAgICBsZXQgdmFsaWRfdGFnID0gL15baEhdKFsxMjM0NTY3XSkkLztcbiAgICBsZXQgcHJlZCA9IChlbGVtOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICByZXR1cm4gKGVsZW0udGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICBlbGVtLmF0dHJpYnV0ZXNbJ2lkJ10gIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIGVsZW0uYXR0cmlidXRlc1snaWQnXSAhPSAnJyk7XG4gICAgfTtcbiAgICBsZXQgbGV2ZWwgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgbGV0IHggPSBlbGVtLnRhZ05hbWUubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgdXRpbHMuYXNzZXJ0X2V4cHIoeCE9bnVsbCk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh4WzFdKTtcbiAgICB9O1xuICAgIHJldHVybiBnZXRfdG9jX2Zyb21faHRtbChwcmVkLCBsZXZlbCk7XG59XG5cbmZ1bmN0aW9uIGhpZGVfdG9jKCkge1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImhpZGUtdG9jXCIpO1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInRvYy1pbi1zaG93XCIpO1xufVxuXG5mdW5jdGlvbiBzaG93X3RvYygpIHtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlLXRvY1wiKTtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0b2MtaW4tc2hvd1wiKTtcbn1cblxuLyoqIHRvYyAqL1xuY29uc3QgX3RvY18gPSBgXG48ZGl2IGNsYXNzPVwidG9jLW5hbWVcIj5cblRPQ1xuPC9kaXY+XG5gO1xuZXhwb3J0IGZ1bmN0aW9uIGRvX3RvYygpIHtcbiAgICBpZighZ2wuaW5fcG9zdF9zZWN0aW9uKSByZXR1cm47XG5cbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgbGV0IHRvYyA9IGdldFRPQygpO1xuICAgICAgICBsZXQgdG9jX2h0bWwgPSB0b2MuZ2VuZXJhdGVIdG1sKCk7XG4gICAgICAgIGxldCB0b2NfY29udGFpbmVyID0gZ2wudG9jX2NvbnRhaW5lcjtcbiAgICAgICAgYXNzZXJ0X2V4cHIodG9jX2NvbnRhaW5lciAhPSBudWxsKTtcbiAgICAgICAgdG9jX2NvbnRhaW5lci5pbm5lckhUTUwgPSBfdG9jXyArIHRvY19odG1sO1xuXG4gICAgICAgIGxldCB0b2NfY29udHJvbGxlcnMgPSB0b2NfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9jLWNvbnRyb2xsZXJcIik7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dG9jX2NvbnRyb2xsZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gdG9jX2NvbnRyb2xsZXJzW2ldIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRlLXRoZS10b2MnKTtcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gdGl0bGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLmNsYXNzTGlzdC50b2dnbGUoJ3RvYy1jaGlsZHJlbi1oaWRlJyk7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVnX3Nob3dfdGhlXyhlbGVtOiBIVE1MRWxlbWVudCwgaGVhZF9pZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MTtpPD02O2krKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGgke2l9W2lkPScke2hlYWRfaWR9J11gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYoZiA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9sZC5zaG93KGYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGlua3MgPSB0b2NfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9jLXRpdGxlIGFcIik7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8bGlua3MubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgbGV0IGxpbmsgPSBsaW5rc1tpXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0YWcgPSBsaW5rLmF0dHJpYnV0ZXNbXCJocmVmXCJdLnZhbHVlLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHJlZ19zaG93X3RoZV8obGluaywgdGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBoaWRlIHRvYyAqL1xuICAgICAgICBsZXQgdG9jX3Nob3cgPSB0cnVlO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZighdG9jX3Nob3cpIHJldHVybjtcbiAgICAgICAgICAgIGxldCByID0gZXYudGFyZ2V0IGFzIEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAociAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHIgPT0gZ2wudG9jX2NvbnRhaW5lciB8fCByID09IGdsLnRvY19zd2l0Y2hlcilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHIgPSByLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoaWRlX3RvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmKHRvY19zaG93KSBoaWRlX3RvYygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiogdG9nZ2xlIHN3aXRjaGVyICovXG4gICAgICAgIHV0aWxzLnRpbWVvdXRfYWRkX2NsYXNzKGdsLnRvY19zd2l0Y2hlciwgJ2hpZGUnLCB0cnVlLCAyNTAwLCAoZSwgZikgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBmKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdsLnRvY19zd2l0Y2hlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICBzaG93X3RvYygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuIiwiXG5mdW5jdGlvbiBnZXRDYWxsZXIgKCkgLy97XG57XG4gICAgbGV0IHJlZyA9IC9cXHMrYXQgKFxcUyspKCBcXCgoW14pXSspXFwpKT8vZztcbiAgICBsZXQgZWU6IHN0cmluZztcbiAgICB0cnkge3Rocm93IG5ldyBFcnJvcigpO31cbiAgICBjYXRjaCAoZSkge2VlID0gZS5zdGFjazt9XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIHJlZy5leGVjKGVlKTtcbiAgICBsZXQgbW0gPSByZWcuZXhlYyhlZSk7XG4gICAgaWYgKCFtbSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIFttbVszXSB8fCBcIlwiLCBtbVsxXV07XG59OyAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3YpIC8ve1xue1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gXCJkZWJ1ZyBtZXNzYWdlXCI7XG4gICAgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske21zZ31dOiBgO1xuICAgIGNvbnNvbGUuZGVidWcobXNnLCAuLi5hcmd2KTtcbn0gLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfZXhwcih2OiBib29sZWFuLCBlcnIgPSBcImFzc2VydCBmYWlsXCIpIC8ve1xue1xuICAgIGlmICh2KSByZXR1cm47XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7ZXJyfV06IGA7XG4gICAgdGhyb3cgbXNnO1xufSAvL31cblxubGV0IGNhbGxiYWNrX3N0YWNrOiBbRnVuY3Rpb24sIGFueVtdXVtdID0gW11cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKGZ1bmMsIC4uLmFyZ3MpIHtcbiAgICBhc3NlcnRfZXhwcih0eXBlb2YoZnVuYykgPT09ICdmdW5jdGlvbicpO1xuICAgIGNhbGxiYWNrX3N0YWNrLnB1c2goW2Z1bmMsIGFyZ3NdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxfcmVnaXN0ZXJfZnVuY3Rpb25zKCkge1xuICAgIHdoaWxlKGNhbGxiYWNrX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGZhID0gY2FsbGJhY2tfc3RhY2sucG9wKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmYVswXS5jYWxsKHdpbmRvdywgLi4uZmFbMV0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudHlwZSBob3d0b2NhbGwgPSAoZWxlbTogSFRNTEVsZW1lbnQsIGFkZF9mdW5jOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganVzdCByZW1vdmUgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9yZW1vdmVfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBzdHJpbmcsIHRpbWVfbXM6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgaWYoIWFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9yZW1vdmUsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX2FkZCk7XG59XG5cbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGpzdXQgYWRkIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfYWRkX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBjbHM6IHN0cmluZywgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX21zOiBudW1iZXIsIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgaWYoYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9hZGQsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX3JlbW92ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0Mmh0bWwoc3RyOiBzdHJpbmcpOiBIVE1MRWxlbWVudCBcbntcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyLnRyaW0oKTtcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbiJdfQ==
