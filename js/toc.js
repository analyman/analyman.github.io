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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdG9jLnRzIiwidGhlbWVzL3NsYW1lL3NvdXJjZS9qcy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLCtCQUFpQztBQUNqQyxpQ0FBc0M7QUFDdEMsNkJBQStCO0FBRS9CLG1CQUFtQjtBQUVuQix3REFBd0Q7QUFFeEQsV0FBVztBQUNYLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNoQyxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFFakMsSUFBTSxTQUFTLEdBQUcsdUxBR1MsQ0FBQztBQUM1QixJQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsSUFBSSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFFdkIsU0FBUyxlQUFlLENBQUMsSUFBSTtJQUN6Qix3QkFBd0I7SUFDeEIsSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUV4RCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxJQUFpQjtJQUU5QyxJQUFNLEtBQUssR0FBa0IsRUFBRSxDQUFDO0lBQ2hDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDaEIsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNu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QUFFLEdBQVcsRUFBRSxHQUFZLEVBQzVDLE9BQWUsRUFBRSxJQUFlO0lBQzlELElBQUksS0FBSyxHQUFZLEdBQUcsQ0FBQztJQUN6QixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7SUFDeEIsU0FBUyxJQUFJO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNiLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNELFNBQVMsT0FBTztRQUNaLElBQUcsS0FBSyxFQUFFO1lBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNqQjthQUFNO1lBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQztRQUNELE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBcEJELDhDQW9CQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxHQUFXO0lBRWpDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLENBQUMsVUFBeUIsQ0FBQztBQUN6QyxDQUFDO0FBTEQsOEJBS0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGFzc2VydF9leHByIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBnbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKiBmb2xkIHNlY3Rpb24gKi9cblxuLyoqIFRPRE8gcmVjb25zdHJ1Y3QgY29kZSwgY3VycmVudGx5IHRoYXQgc2VlbSdzIHVnbHkgKi9cblxuLyoqIFRPRE8gKi9cbmNvbnN0IHNhdmVfc3ltID0gXCJzdWJfZWxlbWVudHNcIjtcbmNvbnN0IHBhcmVudF9zeW0gPSBcInBhcmVudF9oZWFkXCI7XG5cbmNvbnN0IGZvbGRfZXhwciA9IGA8c3BhbiBjbGFzcz0nZm9sZC1idXR0b24nPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLWRvd24gc2hvdyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLXJpZ2h0IGhpZGUnPjwvaT5cbiAgICAgICAgICAgICAgICAgICA8L3NwYW4+YDtcbmNvbnN0IHZhbGlkX3RhZyA9IC9baEhdKFsxMjM0NTZdKS87XG5jb25zdCBoaWRlX2VsZW0gPSBcIi0taGlkZS0tXCI7XG5sZXQgbWFya2Rvd25fYm9keV9jaGlsZHJlbiA9IFtdO1xubGV0IHNob3dfYWxsID0gbnVsbDtcbmxldCBoaWRlX2FsbCA9IG51bGw7XG5sZXQgc2hvd19hX2VsZW0gPSBudWxsO1xuXG5mdW5jdGlvbiBpZ25vcmVkX2VsZW1lbnQoZWxlbSkge1xuICAgIC8qKiBza2lwIGJpYmxpb2dyYXBoeSAqL1xuICAgIGlmKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmlibGlvZ3JhcGh5XCIpKSByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2goZWxlbTogSFRNTEVsZW1lbnQpXG57XG4gICAgY29uc3QgYWxsX2g6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBtYXJrZG93bl9ib2R5X2NoaWxkcmVuID0gW107XG4gICAgc2hvd19hbGwgPSBudWxsO1xuICAgIGhpZGVfYWxsID0gbnVsbDtcbiAgICBzaG93X2FfZWxlbSA9IG51bGw7XG4gICAgZnVuY3Rpb24gZ2V0X2xldmVsX2J5X3RhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBsZXQgbSA9IHRhZy5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICBpZihtID09IG51bGwpIHJldHVybiA3O1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobVsxXSk7XG4gICAgfVxuXG4gICAgbGV0IHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBmb3IobGV0IGk9MDtpPGVsZW0uY2hpbGRyZW4ubGVuZ3RoO2krKykge1xuICAgICAgICBsZXQgYyA9IGVsZW0uY2hpbGRyZW5baV07XG5cbiAgICAgICAgLyoqIHNraXAgZWxlbWVudHMgKi9cbiAgICAgICAgaWYoaWdub3JlZF9lbGVtZW50KGMpKSBjb250aW51ZTtcblxuICAgICAgICBtYXJrZG93bl9ib2R5X2NoaWxkcmVuLnB1c2goYyk7XG4gICAgICAgIGxldCBtID0gYy50YWdOYW1lLm1hdGNoKHZhbGlkX3RhZyk7XG4gICAgICAgIC8qKiBza2lwIHVubmVjZXNzYXJ5IGVsZW1lbnRzICovXG4gICAgICAgIGlmKHMubGVuZ3RoID09IDAgJiYgbSA9PSBudWxsKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGxldCBubCA9IGdldF9sZXZlbF9ieV90YWcoYy50YWdOYW1lKTtcbiAgICAgICAgd2hpbGUocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgb2wgPSBnZXRfbGV2ZWxfYnlfdGFnKHNbcy5sZW5ndGggLSAxXS50YWdOYW1lKTtcbiAgICAgICAgICAgIGlmKG5sIDw9IG9sKSBzLnBvcCgpO1xuICAgICAgICAgICAgZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGo9MDtqPHMubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgbGV0IHggPSBzW2pdO1xuICAgICAgICAgICAgeFtzYXZlX3N5bV0gPSB4W3NhdmVfc3ltXSB8fCBbXTtcbiAgICAgICAgICAgIHhbc2F2ZV9zeW1dLnB1c2goYyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgY1twYXJlbnRfc3ltXSA9IHNbcy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYobSkge1xuICAgICAgICAgICAgYWxsX2gucHVzaChjIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIHMucHVzaChjIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dfXyhlbGVtX186IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW1fXy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgbGV0IGhlYWQ6IFtIVE1MRWxlbWVudCwgYm9vbGVhbl1bXSA9IFtdO1xuICAgICAgICBpZiAoZWxlbV9fW3NhdmVfc3ltXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IobGV0IHh5eiBvZiBlbGVtX19bc2F2ZV9zeW1dKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzX2hlYWQgPSB2YWxpZF90YWcudGVzdCh4eXoudGFnTmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzX2hlYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNob3cgPSAheHl6LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIGhlYWQucHVzaChbeHl6LCBzaG93XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QucmVtb3ZlKGhpZGVfZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBbZSwgc2hvd10gb2YgaGVhZCkge1xuICAgICAgICAgICAgaWYgKHNob3cpIHNob3dfXyhlKTtcbiAgICAgICAgICAgIGVsc2UgICAgICBoaWRlX18oZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGlkZV9fKGVsZW1fXzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbV9fLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICBpZiAoZWxlbV9fW3NhdmVfc3ltXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IobGV0IHh5eiBvZiBlbGVtX19bc2F2ZV9zeW1dKVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QuYWRkKGhpZGVfZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdW5pbnN0YWxsKCkge1xuICAgICAgICBmb3IobGV0IGMgb2YgYWxsX2gpIHtcbiAgICAgICAgICAgIHNob3dfXyhjKTtcbiAgICAgICAgICAgIGNbc2F2ZV9zeW1dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGJ0ID0gYy5xdWVyeVNlbGVjdG9yKFwiLmZvbGQtYnV0dG9uXCIpO1xuICAgICAgICAgICAgaWYoYnQgIT0gbnVsbCAmJiBidC5wYXJlbnRFbGVtZW50ID09IGMpXG4gICAgICAgICAgICAgICAgYy5yZW1vdmVDaGlsZChidCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hbGxfXygpIHtcbiAgICAgICAgZm9yKGxldCBiYiBvZiBhbGxfaClcbiAgICAgICAgICAgIHNob3dfXyhiYik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZGVfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBoaWRlX18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93X2FfZWxlbV9fKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBpZHggPSBhbGxfaC5pbmRleE9mKGVsZW0pO1xuICAgICAgICBpZihpZHggPCAwKSByZXR1cm47XG4gICAgICAgIHdoaWxlKGVsZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgc2hvd19fKGVsZW0pO1xuICAgICAgICAgICAgZWxlbSA9IGVsZW1bcGFyZW50X3N5bV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd19hbGwgPSBzaG93X2FsbF9fO1xuICAgIGhpZGVfYWxsID0gaGlkZV9hbGxfXztcbiAgICBzaG93X2FfZWxlbSA9IHNob3dfYV9lbGVtX187XG5cbiAgICBmb3IobGV0IGJ1dHRvbiBvZiBhbGxfaCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGJ1dHRvbltzYXZlX3N5bV0pICYmIGJ1dHRvbltzYXZlX3N5bV0ubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh1dGlscy50ZXh0Mmh0bWwoZm9sZF9leHByKSk7XG5cbiAgICAgICAgbGV0IHggPSBidXR0b24ucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgaWYoeCA9PSBudWxsKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgeC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBsZXQgbjogSFRNTEVsZW1lbnQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZShuICE9IG51bGwgJiYgIW4udGFnTmFtZS50b0xvd2VyQ2FzZSgpLm1hdGNoKHZhbGlkX3RhZykpXG4gICAgICAgICAgICAgICAgbiA9IG4ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmIChuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvdyA9ICFuLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgaWYoc2hvdykgaGlkZV9fKG4pO1xuICAgICAgICAgICAgICAgIGVsc2UgICAgIHNob3dfXyhuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaW5zdGFsbDtcbn1cblxuZnVuY3Rpb24gbmVlZF91cGRhdGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLWJvZHlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmFkIHNlbGVjdG9yXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKG0uY2hpbGRyZW4ubGVuZ3RoIDwgbWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIGxldCBqPTA7XG4gICAgZm9yKGxldCBpPTA7aTxtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aDtpKyspIHtcbiAgICAgICAgLyoqIHNraXAgaWdub3JlZCBlbGVtZW50cyAqL1xuICAgICAgICBpZihpZ25vcmVkX2VsZW1lbnQobS5jaGlsZHJlbltpXSkpIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmKG0uY2hpbGRyZW5baV0gIT0gbWFya2Rvd25fYm9keV9jaGlsZHJlbltqXSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBqKys7XG4gICAgfVxuICAgIGlmKGogIT0gbWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaW5zID0gKCkgPT4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2gobSk7XG59XG5sZXQgdW5pbnMgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICB1bmlucyAmJiB1bmlucygpO1xuICAgIHVuaW5zID0gaW5zKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlQWxsKCkge1xuICAgIGlmKGhpZGVfYWxsKSBoaWRlX2FsbCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNob3dBbGwoKSB7XG4gICAgaWYoc2hvd19hbGwpIHNob3dfYWxsKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2hvdyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGFzc2VydF9leHByKGVsZW0gJiYgZWxlbS50YWdOYW1lICYmIHZhbGlkX3RhZy50ZXN0KGVsZW0udGFnTmFtZSkpO1xuICAgIGlmKHNob3dfYV9lbGVtKSBzaG93X2FfZWxlbShlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvX2ZvbGQoKSB7XG4gICAgbGV0IG0gPSBmYWxzZTtcbiAgICBpZiAobSkgcmV0dXJuO1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBpZighZ2wuaW5fcG9zdF9zZWN0aW9uKSByZXR1cm47XG4gICAgICAgIHJlZnJlc2goKTtcblxuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYobmVlZF91cGRhdGUoKSkgcmVmcmVzaCgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbn1cblxuIiwiXG4vKiogaWRlbnRpZnkgY3VycmVudCBzZWN0aW9uICovXG5leHBvcnQgY29uc3QgaW5fYXJjaGl2ZV9zZWN0aW9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZXMtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9jYXRlZ29yeV9zZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yeS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2hvbWVfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl90YWdfc2VjdGlvbiAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWctY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wb3N0X3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcGFnZV9zZWNpdG9uICAgICA9IGluX3Bvc3Rfc2VjdGlvbjtcbmV4cG9ydCBjb25zdCBpbl9hYm91dF9zZWN0aW9uICAgID0gZmFsc2U7XG5cbi8qKiBidXR0b25zICovXG5leHBvcnQgY29uc3QgaG9tZV9idXR0b24gICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFyY2hpdmVfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBnaXRodWJfYnV0dG9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2l0aHViLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhYm91dF9idXR0b24gICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWJvdXQtYnV0dG9uXCIpO1xuXG4vKiogZ2VuZXJhbCBlbGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHRhZ3NfYnV0dG9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10YWdzLWVsZW1cIik7XG5leHBvcnQgY29uc3QgY2F0ZWdvcnlfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWNhdGVnb3JpZXMtZWxlbVwiKTtcblxuLyoqIGdvdG8gdG9wICovXG5leHBvcnQgY29uc3QgZ290b190b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvdG8tdG9wLWVsZW1cIik7XG5cbi8qKiB0b2MgY29udGFpbmVyICovXG5leHBvcnQgY29uc3QgdG9jX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2NcIik7XG5leHBvcnQgY29uc3QgdG9jX3N3aXRjaGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvYy1zd2l0Y2hlclwiKTtcblxuIiwiaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscydcbmltcG9ydCAqIGFzIGdsIGZyb20gJy4vZ2xvYmFsJ1xuaW1wb3J0IHsgYXNzZXJ0X2V4cHIgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0ICogYXMgZm9sZCBmcm9tICcuL2ZvbGQnXG5cbi8qKiBnZW5lcmF0ZSBUYWJsZSBvZiBDb250ZW50cyBiYXNlIG9uIDxoPz4gdGFncyAqL1xuXG5jbGFzcyBUT0NFbnRyeSB7XG4gICAgcHJpdmF0ZSBtX2NsYXNzTGlzdDogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBtX2xldmVsOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBtX2NoaWxkcmVuOiBUT0NFbnRyeVtdO1xuICAgIHByaXZhdGUgbV9saW5rOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBtX25hbWU6IHN0cmluZztcblxuICAgIHByaXZhdGUgZ2VuZXJhdGVfaHRtbChubzogbnVtYmVyLCBzaG93X3RpdGxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldCA9IFwiPGRpdlwiO1xuICAgICAgICBpZih0aGlzLm1fY2xhc3NMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldCArPSBcIiBjbGFzcz0nXCI7XG4gICAgICAgICAgICBmb3IobGV0IGNscyBvZiB0aGlzLm1fY2xhc3NMaXN0KVxuICAgICAgICAgICAgICAgIHJldCArPSAoXCIgXCIgKyBjbHMpO1xuICAgICAgICAgICAgcmV0ICs9IFwiJ1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldCArPSBcIj5cIjtcblxuICAgICAgICBpZihzaG93X3RpdGxlKSB7XG4gICAgICAgICAgICByZXQgKz0gXCI8ZGl2IGNsYXNzPSd0b2MtdGl0bGUnPlwiO1xuICAgICAgICAgICAgcmV0ICs9IGA8ZGl2PjxzcGFuIGNsYXNzPSd0b2MtbnVtYmVyJz4ke25vICsgMX08L3NwYW4+PGEgaHJlZj1cIiR7dGhpcy5tX2xpbmt9XCI+JHt0aGlzLm1fbmFtZX08L2E+PC9kaXY+YDtcbiAgICAgICAgICAgIC8qKiB0b2dnbGUgaGlkZS10aGUtdG9jIGNsYXNzIG9mIHRoaXMgY29udHJvbGxlciB0byBzd2l0Y2ggdGhlIGljb24gKi9cbiAgICAgICAgICAgIGlmICh0aGlzLm1fY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldCArPSBgPGRpdiBjbGFzcz0ndG9jLWNvbnRyb2xsZXInPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9J2ZhcyBmYS1hbmdsZS1kb3duIHRvYy1zaG93Jz48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLXJpZ2h0IHRvYy1oaWRlJz48L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCArPSBcIjxkaXYgY2xhc3M9J3RvYy1jaGlsZHJlbic+XCI7XG4gICAgICAgIGZvcihsZXQgYz0wO2M8dGhpcy5tX2NoaWxkcmVuLmxlbmd0aDtjKyspIHtcbiAgICAgICAgICAgIGxldCBjbGQgPSB0aGlzLm1fY2hpbGRyZW5bY107XG4gICAgICAgICAgICByZXQgKz0gY2xkLmdlbmVyYXRlX2h0bWwoYywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XG5cbiAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZz0nJywgbGluazogc3RyaW5nPScnLCBsZXZlbDogbnVtYmVyPS0xLCBjbGFzc0xpc3Q6IHN0cmluZ1tdID0gW10pIHtcbiAgICAgICAgdGhpcy5tX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLm1fbGluayA9IGxpbms7XG4gICAgICAgIHRoaXMubV9sZXZlbCA9IGxldmVsO1xuICAgICAgICB0aGlzLm1fY2xhc3NMaXN0ID0gY2xhc3NMaXN0LnNsaWNlKCk7XG4gICAgICAgIHRoaXMubV9jaGlsZHJlbiA9IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbnNlcnRDaGlsZChjaGlsZDogVE9DRW50cnkpIHtcbiAgICAgICAgdGhpcy5tX2NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGlsZHJlbigpOiBUT0NFbnRyeVtdIHtyZXR1cm4gdGhpcy5tX2NoaWxkcmVuO31cbiAgICBwdWJsaWMgbGV2ZWwoKTogbnVtYmVyIHtyZXR1cm4gdGhpcy5tX2xldmVsO31cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUh0bWwoKSB7cmV0dXJuIHRoaXMuZ2VuZXJhdGVfaHRtbCgwLCBmYWxzZSk7fVxufVxuXG50eXBlIFRvY0VudHJ5UHJlZGljYXRlID0gKGVsZW06IEhUTUxFbGVtZW50KSA9PiBib29sZWFuO1xudHlwZSBnZXRFbnRyeUxldmVsID0gKGVsZW06IEhUTUxFbGVtZW50KSA9PiBudW1iZXI7XG5cbmZ1bmN0aW9uIHRyeV90b2Moc3RhY2s6IFRPQ0VudHJ5W10sIHByZWQ6IFRvY0VudHJ5UHJlZGljYXRlLCBsZXZlbDogZ2V0RW50cnlMZXZlbCxcbiAgICAgICAgICAgICAgICAgZWxlbTogSFRNTEVsZW1lbnQsIGNoaWxkOiBib29sZWFuKSB7XG4gICAgaWYocHJlZChlbGVtKSkge1xuICAgICAgICBsZXQgbCA9IGxldmVsKGVsZW0pO1xuICAgICAgICB3aGlsZShzdGFjay5sZW5ndGggPiAwICYmIGwgPD0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ubGV2ZWwoKSlcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICBhc3NlcnRfZXhwcihzdGFjay5sZW5ndGggPiAwKTtcbiAgICAgICAgbGV0IG4gPSBlbGVtLmlubmVyVGV4dDtcbiAgICAgICAgbGV0IGF0dHJfaWQgPSBlbGVtLmF0dHJpYnV0ZXNbJ2lkJ107XG4gICAgICAgIGxldCBsaW5rID0gXCIjXCIgKyAoYXR0cl9pZCA/IGF0dHJfaWQudmFsdWUgOiAnJyk7XG4gICAgICAgIGxldCBuZXdfZW50cnkgPSBuZXcgVE9DRW50cnkobiwgbGluaywgbCwgW1widG9jLWVudHJ5XCJdKTtcbiAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0uaW5zZXJ0Q2hpbGQobmV3X2VudHJ5KTtcbiAgICAgICAgc3RhY2sucHVzaChuZXdfZW50cnkpO1xuICAgIH1cblxuICAgIGlmKGNoaWxkKSB7XG4gICAgICAgIGZvcihsZXQgYz0wO2M8ZWxlbS5jaGlsZHJlbi5sZW5ndGg7YysrKSB7XG4gICAgICAgICAgICBsZXQgY2MgPSBlbGVtLmNoaWxkcmVuW2NdIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgdHJ5X3RvYyhzdGFjaywgcHJlZCwgbGV2ZWwsIGNjLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF90b2NfZnJvbV9odG1sKHByZWQ6IFRvY0VudHJ5UHJlZGljYXRlLCBsZXZlbDogZ2V0RW50cnlMZXZlbCk6IFRPQ0VudHJ5IFxue1xuICAgIGxldCBzdGFjayA9IFtdO1xuICAgIGxldCB0aGVfdG9wID0gbmV3IFRPQ0VudHJ5KCcnLCAnJywgMCwgWyd0b2MtZmlyc3QnXSk7XG4gICAgc3RhY2sucHVzaCh0aGVfdG9wKTtcbiAgICBsZXQgcm9vdCA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuICAgIHRyeV90b2Moc3RhY2ssIHByZWQsIGxldmVsLCByb290LCB0cnVlKTtcbiAgICByZXR1cm4gc3RhY2tbMF07XG59XG5cbmZ1bmN0aW9uIGdldFRPQygpOiBUT0NFbnRyeSB7XG4gICAgbGV0IHZhbGlkX3RhZyA9IC9eW2hIXShbMTIzNDU2N10pJC87XG4gICAgbGV0IHByZWQgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIChlbGVtLnRhZ05hbWUubWF0Y2godmFsaWRfdGFnKSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgZWxlbS5hdHRyaWJ1dGVzWydpZCddICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICBlbGVtLmF0dHJpYnV0ZXNbJ2lkJ10gIT0gJycpO1xuICAgIH07XG4gICAgbGV0IGxldmVsID0gKGVsZW06IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIGxldCB4ID0gZWxlbS50YWdOYW1lLm1hdGNoKHZhbGlkX3RhZyk7XG4gICAgICAgIHV0aWxzLmFzc2VydF9leHByKHghPW51bGwpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoeFsxXSk7XG4gICAgfTtcbiAgICByZXR1cm4gZ2V0X3RvY19mcm9tX2h0bWwocHJlZCwgbGV2ZWwpO1xufVxuXG5mdW5jdGlvbiBoaWRlX3RvYygpIHtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJoaWRlLXRvY1wiKTtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ0b2MtaW4tc2hvd1wiKTtcbn1cblxuZnVuY3Rpb24gc2hvd190b2MoKSB7XG4gICAgZ2wudG9jX2NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZS10b2NcIik7XG4gICAgZ2wudG9jX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidG9jLWluLXNob3dcIik7XG59XG5cbi8qKiB0b2MgKi9cbmNvbnN0IF90b2NfID0gYFxuPGRpdiBjbGFzcz1cInRvYy1uYW1lXCI+XG5UT0NcbjwvZGl2PlxuYDtcbmV4cG9ydCBmdW5jdGlvbiBkb190b2MoKSB7XG4gICAgaWYoIWdsLmluX3Bvc3Rfc2VjdGlvbikgcmV0dXJuO1xuXG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbCgoKSA9PiB7XG4gICAgICAgIGxldCB0b2MgPSBnZXRUT0MoKTtcbiAgICAgICAgbGV0IHRvY19odG1sID0gdG9jLmdlbmVyYXRlSHRtbCgpO1xuICAgICAgICBsZXQgdG9jX2NvbnRhaW5lciA9IGdsLnRvY19jb250YWluZXI7XG4gICAgICAgIGFzc2VydF9leHByKHRvY19jb250YWluZXIgIT0gbnVsbCk7XG4gICAgICAgIHRvY19jb250YWluZXIuaW5uZXJIVE1MID0gX3RvY18gKyB0b2NfaHRtbDtcblxuICAgICAgICBsZXQgdG9jX2NvbnRyb2xsZXJzID0gdG9jX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLnRvYy1jb250cm9sbGVyXCIpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRvY19jb250cm9sbGVycy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICBsZXQgY29udHJvbGxlciA9IHRvY19jb250cm9sbGVyc1tpXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldjogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZS10aGUtdG9jJyk7XG4gICAgICAgICAgICAgICAgbGV0IHRpdGxlID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHRpdGxlLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5jbGFzc0xpc3QudG9nZ2xlKCd0b2MtY2hpbGRyZW4taGlkZScpO1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlZ19zaG93X3RoZV8oZWxlbTogSFRNTEVsZW1lbnQsIGhlYWRfaWQ6IHN0cmluZykge1xuICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTE7aTw9NjtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBoJHtpfVtpZD0nJHtoZWFkX2lkfSddYCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKGYgPT0gbnVsbCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGZvbGQuc2hvdyhmKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxpbmtzID0gdG9jX2NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLnRvYy10aXRsZSBhXCIpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGxpbmtzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIGxldCBsaW5rID0gbGlua3NbaV0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgdGFnID0gbGluay5hdHRyaWJ1dGVzW1wiaHJlZlwiXS52YWx1ZS5zdWJzdHIoMSk7XG4gICAgICAgICAgICByZWdfc2hvd190aGVfKGxpbmssIHRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiogaGlkZSB0b2MgKi9cbiAgICAgICAgbGV0IHRvY19zaG93ID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYoIXRvY19zaG93KSByZXR1cm47XG4gICAgICAgICAgICBsZXQgciA9IGV2LnRhcmdldCBhcyBFbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKHIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChyID09IGdsLnRvY19jb250YWluZXIgfHwgciA9PSBnbC50b2Nfc3dpdGNoZXIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICByID0gci5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGlkZV90b2MoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICBpZih0b2Nfc2hvdykgaGlkZV90b2MoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqIHRvZ2dsZSBzd2l0Y2hlciAqL1xuICAgICAgICB1dGlscy50aW1lb3V0X2FkZF9jbGFzcyhnbC50b2Nfc3dpdGNoZXIsICdoaWRlJywgdHJ1ZSwgMjUwMCwgKGUsIGYpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgZigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBnbC50b2Nfc3dpdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgc2hvd190b2MoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbiIsIlxuZnVuY3Rpb24gZ2V0Q2FsbGVyICgpIC8ve1xue1xuICAgIGxldCByZWcgPSAvXFxzK2F0IChcXFMrKSggXFwoKFteKV0rKVxcKSk/L2c7XG4gICAgbGV0IGVlOiBzdHJpbmc7XG4gICAgdHJ5IHt0aHJvdyBuZXcgRXJyb3IoKTt9XG4gICAgY2F0Y2ggKGUpIHtlZSA9IGUuc3RhY2s7fVxuICAgIHJlZy5leGVjKGVlKTtcbiAgICByZWcuZXhlYyhlZSk7XG4gICAgbGV0IG1tID0gcmVnLmV4ZWMoZWUpO1xuICAgIGlmICghbW0pIHJldHVybiBudWxsO1xuICAgIHJldHVybiBbbW1bM10gfHwgXCJcIiwgbW1bMV1dO1xufTsgLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5hcmd2KSAvL3tcbntcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IFwiZGVidWcgbWVzc2FnZVwiO1xuICAgIG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHttc2d9XTogYDtcbiAgICBjb25zb2xlLmRlYnVnKG1zZywgLi4uYXJndik7XG59IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0X2V4cHIodjogYm9vbGVhbiwgZXJyID0gXCJhc3NlcnQgZmFpbFwiKSAvL3tcbntcbiAgICBpZiAodikgcmV0dXJuO1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske2Vycn1dOiBgO1xuICAgIHRocm93IG1zZztcbn0gLy99XG5cbmxldCBjYWxsYmFja19zdGFjazogW0Z1bmN0aW9uLCBhbnlbXV1bXSA9IFtdXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJfZnVuY3Rpb25fY2FsbChmdW5jLCAuLi5hcmdzKSB7XG4gICAgYXNzZXJ0X2V4cHIodHlwZW9mKGZ1bmMpID09PSAnZnVuY3Rpb24nKTtcbiAgICBjYWxsYmFja19zdGFjay5wdXNoKFtmdW5jLCBhcmdzXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsX3JlZ2lzdGVyX2Z1bmN0aW9ucygpIHtcbiAgICB3aGlsZShjYWxsYmFja19zdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBmYSA9IGNhbGxiYWNrX3N0YWNrLnBvcCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmFbMF0uY2FsbCh3aW5kb3csIC4uLmZhWzFdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnR5cGUgaG93dG9jYWxsID0gKGVsZW06IEhUTUxFbGVtZW50LCBhZGRfZnVuYzogKCkgPT4gdm9pZCkgPT4gdm9pZDtcbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGp1c3QgcmVtb3ZlIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfcmVtb3ZlX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogc3RyaW5nLCB0aW1lX21zOiBudW1iZXIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGlmKCFhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfcmVtb3ZlLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9hZGQpO1xufVxuXG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqc3V0IGFkZCB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X2FkZF9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgY2xzOiBzdHJpbmcsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZV9tczogbnVtYmVyLCB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGlmKGFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChfYWRkLCB0aW1lX21zKTtcbiAgICB9XG5cbiAgICB3aGVuKGVsZW0sIF9yZW1vdmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dDJodG1sKHN0cjogc3RyaW5nKTogSFRNTEVsZW1lbnQgXG57XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmlubmVySFRNTCA9IHN0ci50cmltKCk7XG4gICAgcmV0dXJuIGRpdi5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50O1xufVxuXG4iXX0=
