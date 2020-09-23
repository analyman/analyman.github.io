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

},{"./global":2,"./utils":6}],2:[function(require,module,exports){
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

},{"./global":2,"./utils":6}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var utils = require("./utils");
var misc_1 = require("./misc");
misc_1.do_misc();
var toc_1 = require("./toc");
toc_1.do_toc();
var fold_1 = require("./fold");
fold_1.do_fold();
/** ? */
utils.call_register_functions();

},{"./fold":1,"./misc":3,"./toc":5,"./utils":6}],5:[function(require,module,exports){
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

},{"./fold":1,"./global":2,"./utils":6}],6:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2ZvbGQudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL2dsb2JhbC50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvbWlzYy50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvc2xhbWUudHMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL3RvYy50cyIsInRoZW1lcy9zbGFtZS9zb3VyY2UvanMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwrQkFBaUM7QUFDakMsaUNBQXNDO0FBQ3RDLDZCQUErQjtBQUUvQixtQkFBbUI7QUFFbkIsd0RBQXdEO0FBRXhELFdBQVc7QUFDWCxJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7QUFDaEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBRWpDLElBQU0sU0FBUyxHQUFHLHVMQUdTLENBQUM7QUFDNUIsSUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLElBQUksc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBRXZCLFNBQVMsZUFBZSxDQUFDLElBQUk7SUFDekIsd0JBQXdCO0lBQ3hCLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFeEQsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsSUFBaUI7SUFFOUMsSUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztJQUNoQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDNUIsUUFBUSxHQUFH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LENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLENBQUMsVUFBeUIsQ0FBQztBQUN6QyxDQUFDO0FBTEQsOEJBS0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGFzc2VydF9leHByIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBnbCBmcm9tICcuL2dsb2JhbCc7XG5cbi8qKiBmb2xkIHNlY3Rpb24gKi9cblxuLyoqIFRPRE8gcmVjb25zdHJ1Y3QgY29kZSwgY3VycmVudGx5IHRoYXQgc2VlbSdzIHVnbHkgKi9cblxuLyoqIFRPRE8gKi9cbmNvbnN0IHNhdmVfc3ltID0gXCJzdWJfZWxlbWVudHNcIjtcbmNvbnN0IHBhcmVudF9zeW0gPSBcInBhcmVudF9oZWFkXCI7XG5cbmNvbnN0IGZvbGRfZXhwciA9IGA8c3BhbiBjbGFzcz0nZm9sZC1idXR0b24nPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLWRvd24gc2hvdyc+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLXJpZ2h0IGhpZGUnPjwvaT5cbiAgICAgICAgICAgICAgICAgICA8L3NwYW4+YDtcbmNvbnN0IHZhbGlkX3RhZyA9IC9baEhdKFsxMjM0NTZdKS87XG5jb25zdCBoaWRlX2VsZW0gPSBcIi0taGlkZS0tXCI7XG5sZXQgbWFya2Rvd25fYm9keV9jaGlsZHJlbiA9IFtdO1xubGV0IHNob3dfYWxsID0gbnVsbDtcbmxldCBoaWRlX2FsbCA9IG51bGw7XG5sZXQgc2hvd19hX2VsZW0gPSBudWxsO1xuXG5mdW5jdGlvbiBpZ25vcmVkX2VsZW1lbnQoZWxlbSkge1xuICAgIC8qKiBza2lwIGJpYmxpb2dyYXBoeSAqL1xuICAgIGlmKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmlibGlvZ3JhcGh5XCIpKSByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2goZWxlbTogSFRNTEVsZW1lbnQpXG57XG4gICAgY29uc3QgYWxsX2g6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBtYXJrZG93bl9ib2R5X2NoaWxkcmVuID0gW107XG4gICAgc2hvd19hbGwgPSBudWxsO1xuICAgIGhpZGVfYWxsID0gbnVsbDtcbiAgICBzaG93X2FfZWxlbSA9IG51bGw7XG4gICAgZnVuY3Rpb24gZ2V0X2xldmVsX2J5X3RhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBsZXQgbSA9IHRhZy5tYXRjaCh2YWxpZF90YWcpO1xuICAgICAgICBpZihtID09IG51bGwpIHJldHVybiA3O1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobVsxXSk7XG4gICAgfVxuXG4gICAgbGV0IHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICBmb3IobGV0IGk9MDtpPGVsZW0uY2hpbGRyZW4ubGVuZ3RoO2krKykge1xuICAgICAgICBsZXQgYyA9IGVsZW0uY2hpbGRyZW5baV07XG5cbiAgICAgICAgLyoqIHNraXAgZWxlbWVudHMgKi9cbiAgICAgICAgaWYoaWdub3JlZF9lbGVtZW50KGMpKSBjb250aW51ZTtcblxuICAgICAgICBtYXJrZG93bl9ib2R5X2NoaWxkcmVuLnB1c2goYyk7XG4gICAgICAgIGxldCBtID0gYy50YWdOYW1lLm1hdGNoKHZhbGlkX3RhZyk7XG4gICAgICAgIC8qKiBza2lwIHVubmVjZXNzYXJ5IGVsZW1lbnRzICovXG4gICAgICAgIGlmKHMubGVuZ3RoID09IDAgJiYgbSA9PSBudWxsKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGxldCBubCA9IGdldF9sZXZlbF9ieV90YWcoYy50YWdOYW1lKTtcbiAgICAgICAgd2hpbGUocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgb2wgPSBnZXRfbGV2ZWxfYnlfdGFnKHNbcy5sZW5ndGggLSAxXS50YWdOYW1lKTtcbiAgICAgICAgICAgIGlmKG5sIDw9IG9sKSBzLnBvcCgpO1xuICAgICAgICAgICAgZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGo9MDtqPHMubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgbGV0IHggPSBzW2pdO1xuICAgICAgICAgICAgeFtzYXZlX3N5bV0gPSB4W3NhdmVfc3ltXSB8fCBbXTtcbiAgICAgICAgICAgIHhbc2F2ZV9zeW1dLnB1c2goYyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgY1twYXJlbnRfc3ltXSA9IHNbcy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYobSkge1xuICAgICAgICAgICAgYWxsX2gucHVzaChjIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIHMucHVzaChjIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dfXyhlbGVtX186IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGVsZW1fXy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgbGV0IGhlYWQ6IFtIVE1MRWxlbWVudCwgYm9vbGVhbl1bXSA9IFtdO1xuICAgICAgICBpZiAoZWxlbV9fW3NhdmVfc3ltXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IobGV0IHh5eiBvZiBlbGVtX19bc2F2ZV9zeW1dKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzX2hlYWQgPSB2YWxpZF90YWcudGVzdCh4eXoudGFnTmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzX2hlYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNob3cgPSAheHl6LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIGhlYWQucHVzaChbeHl6LCBzaG93XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QucmVtb3ZlKGhpZGVfZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBbZSwgc2hvd10gb2YgaGVhZCkge1xuICAgICAgICAgICAgaWYgKHNob3cpIHNob3dfXyhlKTtcbiAgICAgICAgICAgIGVsc2UgICAgICBoaWRlX18oZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGlkZV9fKGVsZW1fXzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbV9fLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICBpZiAoZWxlbV9fW3NhdmVfc3ltXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IobGV0IHh5eiBvZiBlbGVtX19bc2F2ZV9zeW1dKVxuICAgICAgICAgICAgICAgIHh5ei5jbGFzc0xpc3QuYWRkKGhpZGVfZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdW5pbnN0YWxsKCkge1xuICAgICAgICBmb3IobGV0IGMgb2YgYWxsX2gpIHtcbiAgICAgICAgICAgIHNob3dfXyhjKTtcbiAgICAgICAgICAgIGNbc2F2ZV9zeW1dID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGJ0ID0gYy5xdWVyeVNlbGVjdG9yKFwiLmZvbGQtYnV0dG9uXCIpO1xuICAgICAgICAgICAgaWYoYnQgIT0gbnVsbCAmJiBidC5wYXJlbnRFbGVtZW50ID09IGMpXG4gICAgICAgICAgICAgICAgYy5yZW1vdmVDaGlsZChidCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd19hbGxfXygpIHtcbiAgICAgICAgZm9yKGxldCBiYiBvZiBhbGxfaClcbiAgICAgICAgICAgIHNob3dfXyhiYik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhpZGVfYWxsX18oKSB7XG4gICAgICAgIGZvcihsZXQgYmIgb2YgYWxsX2gpXG4gICAgICAgICAgICBoaWRlX18oYmIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93X2FfZWxlbV9fKGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBpZHggPSBhbGxfaC5pbmRleE9mKGVsZW0pO1xuICAgICAgICBpZihpZHggPCAwKSByZXR1cm47XG4gICAgICAgIHdoaWxlKGVsZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgc2hvd19fKGVsZW0pO1xuICAgICAgICAgICAgZWxlbSA9IGVsZW1bcGFyZW50X3N5bV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd19hbGwgPSBzaG93X2FsbF9fO1xuICAgIGhpZGVfYWxsID0gaGlkZV9hbGxfXztcbiAgICBzaG93X2FfZWxlbSA9IHNob3dfYV9lbGVtX187XG5cbiAgICBmb3IobGV0IGJ1dHRvbiBvZiBhbGxfaCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGJ1dHRvbltzYXZlX3N5bV0pICYmIGJ1dHRvbltzYXZlX3N5bV0ubGVuZ3RoID4gMClcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh1dGlscy50ZXh0Mmh0bWwoZm9sZF9leHByKSk7XG5cbiAgICAgICAgbGV0IHggPSBidXR0b24ucXVlcnlTZWxlY3RvcihcIi5mb2xkLWJ1dHRvblwiKTtcbiAgICAgICAgaWYoeCA9PSBudWxsKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgeC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBsZXQgbjogSFRNTEVsZW1lbnQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZShuICE9IG51bGwgJiYgIW4udGFnTmFtZS50b0xvd2VyQ2FzZSgpLm1hdGNoKHZhbGlkX3RhZykpXG4gICAgICAgICAgICAgICAgbiA9IG4ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmIChuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvdyA9ICFuLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgaWYoc2hvdykgaGlkZV9fKG4pO1xuICAgICAgICAgICAgICAgIGVsc2UgICAgIHNob3dfXyhuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuaW5zdGFsbDtcbn1cblxuZnVuY3Rpb24gbmVlZF91cGRhdGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLWJvZHlcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmFkIHNlbGVjdG9yXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKG0uY2hpbGRyZW4ubGVuZ3RoIDwgbWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIGxldCBqPTA7XG4gICAgZm9yKGxldCBpPTA7aTxtYXJrZG93bl9ib2R5X2NoaWxkcmVuLmxlbmd0aDtpKyspIHtcbiAgICAgICAgLyoqIHNraXAgaWdub3JlZCBlbGVtZW50cyAqL1xuICAgICAgICBpZihpZ25vcmVkX2VsZW1lbnQobS5jaGlsZHJlbltpXSkpIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmKG0uY2hpbGRyZW5baV0gIT0gbWFya2Rvd25fYm9keV9jaGlsZHJlbltqXSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBqKys7XG4gICAgfVxuICAgIGlmKGogIT0gbWFya2Rvd25fYm9keV9jaGlsZHJlbi5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaW5zID0gKCkgPT4ge1xuICAgIGxldCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1ib2R5XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChtID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJhZCBzZWxlY3RvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaW5zZXJ0X2ZvbGRfYnV0dG9uX3RvX2gobSk7XG59XG5sZXQgdW5pbnMgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICB1bmlucyAmJiB1bmlucygpO1xuICAgIHVuaW5zID0gaW5zKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlQWxsKCkge1xuICAgIGlmKGhpZGVfYWxsKSBoaWRlX2FsbCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNob3dBbGwoKSB7XG4gICAgaWYoc2hvd19hbGwpIHNob3dfYWxsKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2hvdyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIGFzc2VydF9leHByKGVsZW0gJiYgZWxlbS50YWdOYW1lICYmIHZhbGlkX3RhZy50ZXN0KGVsZW0udGFnTmFtZSkpO1xuICAgIGlmKHNob3dfYV9lbGVtKSBzaG93X2FfZWxlbShlbGVtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvX2ZvbGQoKSB7XG4gICAgbGV0IG0gPSBmYWxzZTtcbiAgICBpZiAobSkgcmV0dXJuO1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICBpZighZ2wuaW5fcG9zdF9zZWN0aW9uKSByZXR1cm47XG4gICAgICAgIHJlZnJlc2goKTtcblxuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYobmVlZF91cGRhdGUoKSkgcmVmcmVzaCgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbn1cblxuIiwiXG4vKiogaWRlbnRpZnkgY3VycmVudCBzZWN0aW9uICovXG5leHBvcnQgY29uc3QgaW5fYXJjaGl2ZV9zZWN0aW9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJjaGl2ZXMtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9jYXRlZ29yeV9zZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yeS1jbGlja1wiKSAhPSBudWxsO1xuZXhwb3J0IGNvbnN0IGluX2hvbWVfc2VjdGlvbiAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl90YWdfc2VjdGlvbiAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWctY2xpY2tcIikgIT0gbnVsbDtcbmV4cG9ydCBjb25zdCBpbl9wb3N0X3NlY3Rpb24gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LWNsaWNrXCIpICE9IG51bGw7XG5leHBvcnQgY29uc3QgaW5fcGFnZV9zZWNpdG9uICAgICA9IGluX3Bvc3Rfc2VjdGlvbjtcbmV4cG9ydCBjb25zdCBpbl9hYm91dF9zZWN0aW9uICAgID0gZmFsc2U7XG5cbi8qKiBidXR0b25zICovXG5leHBvcnQgY29uc3QgaG9tZV9idXR0b24gICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpO1xuZXhwb3J0IGNvbnN0IGFyY2hpdmVfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmNoaXZlLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBnaXRodWJfYnV0dG9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2l0aHViLWJ1dHRvblwiKTtcbmV4cG9ydCBjb25zdCBhYm91dF9idXR0b24gICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWJvdXQtYnV0dG9uXCIpO1xuXG4vKiogZ2VuZXJhbCBlbGVtZW50cyAqL1xuZXhwb3J0IGNvbnN0IHRhZ3NfYnV0dG9uICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10YWdzLWVsZW1cIik7XG5leHBvcnQgY29uc3QgY2F0ZWdvcnlfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyLWNhdGVnb3JpZXMtZWxlbVwiKTtcblxuLyoqIGdvdG8gdG9wICovXG5leHBvcnQgY29uc3QgZ290b190b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvdG8tdG9wLWVsZW1cIik7XG5cbi8qKiB0b2MgY29udGFpbmVyICovXG5leHBvcnQgY29uc3QgdG9jX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdC10b2NcIik7XG5leHBvcnQgY29uc3QgdG9jX3N3aXRjaGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0LXRvYy1zd2l0Y2hlclwiKTtcblxuIiwiaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuXG5mdW5jdGlvbiBzZWxlY3Rfc2VjdGlvbigpIHtcbiAgICBpZiAoZ2wuaW5faG9tZV9zZWN0aW9uKSAgICBnbC5ob21lX2J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGlmIChnbC5pbl9hcmNoaXZlX3NlY3Rpb24pIGdsLmFyY2hpdmVfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgaWYgKGdsLmluX2Fib3V0X3NlY3Rpb24pICAgZ2wuYWJvdXRfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb19taXNjKCkge1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoc2VsZWN0X3NlY3Rpb24pO1xuXG4gICAgLyoqIHRhZ3MgYW5kIGNhdGVnb3JpZXMgdG9nZ2xlICovXG4gICAgdXRpbHMucmVnaXN0ZXJfZnVuY3Rpb25fY2FsbCgoKSA9PiB7XG4gICAgICAgIGdsLnRhZ3NfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXY6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImNsaWNrLXNob3dcIik7XG4gICAgICAgIH0pXG4gICAgICAgIGdsLmNhdGVnb3J5X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiY2xpY2stc2hvd1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKiogZ290byB0b3AgaGFuZGxlciAqL1xuICAgIHV0aWxzLnJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoKCkgPT4ge1xuICAgICAgICB1dGlscy50aW1lb3V0X2FkZF9jbGFzcyhnbC5nb3RvX3RvcCwgXCJoaWRlXCIsIHRydWUsIDMwMDAsIChlLCBmdW5jKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChldjogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBmdW5jKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuIiwiaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuXG5pbXBvcnQgeyBkb19taXNjIH0gZnJvbSAnLi9taXNjJ1xuZG9fbWlzYygpO1xuXG5pbXBvcnQgeyBkb190b2MgfSBmcm9tICcuL3RvYydcbmRvX3RvYygpO1xuXG5pbXBvcnQgeyBkb19mb2xkIH0gZnJvbSAnLi9mb2xkJ1xuZG9fZm9sZCgpO1xuXG5cbi8qKiA/ICovXG51dGlscy5jYWxsX3JlZ2lzdGVyX2Z1bmN0aW9ucygpO1xuXG4iLCJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0ICogYXMgZ2wgZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgeyBhc3NlcnRfZXhwciB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgKiBhcyBmb2xkIGZyb20gJy4vZm9sZCdcblxuLyoqIGdlbmVyYXRlIFRhYmxlIG9mIENvbnRlbnRzIGJhc2Ugb24gPGg/PiB0YWdzICovXG5cbmNsYXNzIFRPQ0VudHJ5IHtcbiAgICBwcml2YXRlIG1fY2xhc3NMaXN0OiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIG1fbGV2ZWw6IG51bWJlcjtcbiAgICBwcml2YXRlIG1fY2hpbGRyZW46IFRPQ0VudHJ5W107XG4gICAgcHJpdmF0ZSBtX2xpbms6IHN0cmluZztcbiAgICBwcml2YXRlIG1fbmFtZTogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZV9odG1sKG5vOiBudW1iZXIsIHNob3dfdGl0bGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0ID0gXCI8ZGl2XCI7XG4gICAgICAgIGlmKHRoaXMubV9jbGFzc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0ICs9IFwiIGNsYXNzPSdcIjtcbiAgICAgICAgICAgIGZvcihsZXQgY2xzIG9mIHRoaXMubV9jbGFzc0xpc3QpXG4gICAgICAgICAgICAgICAgcmV0ICs9IChcIiBcIiArIGNscyk7XG4gICAgICAgICAgICByZXQgKz0gXCInXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IFwiPlwiO1xuXG4gICAgICAgIGlmKHNob3dfdGl0bGUpIHtcbiAgICAgICAgICAgIHJldCArPSBcIjxkaXYgY2xhc3M9J3RvYy10aXRsZSc+XCI7XG4gICAgICAgICAgICByZXQgKz0gYDxkaXY+PHNwYW4gY2xhc3M9J3RvYy1udW1iZXInPiR7bm8gKyAxfTwvc3Bhbj48YSBocmVmPVwiJHt0aGlzLm1fbGlua31cIj4ke3RoaXMubV9uYW1lfTwvYT48L2Rpdj5gO1xuICAgICAgICAgICAgLyoqIHRvZ2dsZSBoaWRlLXRoZS10b2MgY2xhc3Mgb2YgdGhpcyBjb250cm9sbGVyIHRvIHN3aXRjaCB0aGUgaWNvbiAqL1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IGA8ZGl2IGNsYXNzPSd0b2MtY29udHJvbGxlcic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz0nZmFzIGZhLWFuZ2xlLWRvd24gdG9jLXNob3cnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPSdmYXMgZmEtYW5nbGUtcmlnaHQgdG9jLWhpZGUnPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ICs9IFwiPGRpdiBjbGFzcz0ndG9jLWNoaWxkcmVuJz5cIjtcbiAgICAgICAgZm9yKGxldCBjPTA7Yzx0aGlzLm1fY2hpbGRyZW4ubGVuZ3RoO2MrKykge1xuICAgICAgICAgICAgbGV0IGNsZCA9IHRoaXMubV9jaGlsZHJlbltjXTtcbiAgICAgICAgICAgIHJldCArPSBjbGQuZ2VuZXJhdGVfaHRtbChjLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcblxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nPScnLCBsaW5rOiBzdHJpbmc9JycsIGxldmVsOiBudW1iZXI9LTEsIGNsYXNzTGlzdDogc3RyaW5nW10gPSBbXSkge1xuICAgICAgICB0aGlzLm1fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubV9saW5rID0gbGluaztcbiAgICAgICAgdGhpcy5tX2xldmVsID0gbGV2ZWw7XG4gICAgICAgIHRoaXMubV9jbGFzc0xpc3QgPSBjbGFzc0xpc3Quc2xpY2UoKTtcbiAgICAgICAgdGhpcy5tX2NoaWxkcmVuID0gW107XG4gICAgfVxuXG4gICAgcHVibGljIGluc2VydENoaWxkKGNoaWxkOiBUT0NFbnRyeSkge1xuICAgICAgICB0aGlzLm1fY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNoaWxkcmVuKCk6IFRPQ0VudHJ5W10ge3JldHVybiB0aGlzLm1fY2hpbGRyZW47fVxuICAgIHB1YmxpYyBsZXZlbCgpOiBudW1iZXIge3JldHVybiB0aGlzLm1fbGV2ZWw7fVxuXG4gICAgcHVibGljIGdlbmVyYXRlSHRtbCgpIHtyZXR1cm4gdGhpcy5nZW5lcmF0ZV9odG1sKDAsIGZhbHNlKTt9XG59XG5cbnR5cGUgVG9jRW50cnlQcmVkaWNhdGUgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IGJvb2xlYW47XG50eXBlIGdldEVudHJ5TGV2ZWwgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IG51bWJlcjtcblxuZnVuY3Rpb24gdHJ5X3RvYyhzdGFjazogVE9DRW50cnlbXSwgcHJlZDogVG9jRW50cnlQcmVkaWNhdGUsIGxldmVsOiBnZXRFbnRyeUxldmVsLFxuICAgICAgICAgICAgICAgICBlbGVtOiBIVE1MRWxlbWVudCwgY2hpbGQ6IGJvb2xlYW4pIHtcbiAgICBpZihwcmVkKGVsZW0pKSB7XG4gICAgICAgIGxldCBsID0gbGV2ZWwoZWxlbSk7XG4gICAgICAgIHdoaWxlKHN0YWNrLmxlbmd0aCA+IDAgJiYgbCA8PSBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCgpKVxuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIGFzc2VydF9leHByKHN0YWNrLmxlbmd0aCA+IDApO1xuICAgICAgICBsZXQgbiA9IGVsZW0uaW5uZXJUZXh0O1xuICAgICAgICBsZXQgYXR0cl9pZCA9IGVsZW0uYXR0cmlidXRlc1snaWQnXTtcbiAgICAgICAgbGV0IGxpbmsgPSBcIiNcIiArIChhdHRyX2lkID8gYXR0cl9pZC52YWx1ZSA6ICcnKTtcbiAgICAgICAgbGV0IG5ld19lbnRyeSA9IG5ldyBUT0NFbnRyeShuLCBsaW5rLCBsLCBbXCJ0b2MtZW50cnlcIl0pO1xuICAgICAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5pbnNlcnRDaGlsZChuZXdfZW50cnkpO1xuICAgICAgICBzdGFjay5wdXNoKG5ld19lbnRyeSk7XG4gICAgfVxuXG4gICAgaWYoY2hpbGQpIHtcbiAgICAgICAgZm9yKGxldCBjPTA7YzxlbGVtLmNoaWxkcmVuLmxlbmd0aDtjKyspIHtcbiAgICAgICAgICAgIGxldCBjYyA9IGVsZW0uY2hpbGRyZW5bY10gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICB0cnlfdG9jKHN0YWNrLCBwcmVkLCBsZXZlbCwgY2MsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0X3RvY19mcm9tX2h0bWwocHJlZDogVG9jRW50cnlQcmVkaWNhdGUsIGxldmVsOiBnZXRFbnRyeUxldmVsKTogVE9DRW50cnkgXG57XG4gICAgbGV0IHN0YWNrID0gW107XG4gICAgbGV0IHRoZV90b3AgPSBuZXcgVE9DRW50cnkoJycsICcnLCAwLCBbJ3RvYy1maXJzdCddKTtcbiAgICBzdGFjay5wdXNoKHRoZV90b3ApO1xuICAgIGxldCByb290ID0gd2luZG93LmRvY3VtZW50LmJvZHk7XG4gICAgdHJ5X3RvYyhzdGFjaywgcHJlZCwgbGV2ZWwsIHJvb3QsIHRydWUpO1xuICAgIHJldHVybiBzdGFja1swXTtcbn1cblxuZnVuY3Rpb24gZ2V0VE9DKCk6IFRPQ0VudHJ5IHtcbiAgICBsZXQgdmFsaWRfdGFnID0gL15baEhdKFsxMjM0NTY3XSkkLztcbiAgICBsZXQgcHJlZCA9IChlbGVtOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICByZXR1cm4gKGVsZW0udGFnTmFtZS5tYXRjaCh2YWxpZF90YWcpICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICBlbGVtLmF0dHJpYnV0ZXNbJ2lkJ10gIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIGVsZW0uYXR0cmlidXRlc1snaWQnXSAhPSAnJyk7XG4gICAgfTtcbiAgICBsZXQgbGV2ZWwgPSAoZWxlbTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgbGV0IHggPSBlbGVtLnRhZ05hbWUubWF0Y2godmFsaWRfdGFnKTtcbiAgICAgICAgdXRpbHMuYXNzZXJ0X2V4cHIoeCE9bnVsbCk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh4WzFdKTtcbiAgICB9O1xuICAgIHJldHVybiBnZXRfdG9jX2Zyb21faHRtbChwcmVkLCBsZXZlbCk7XG59XG5cbmZ1bmN0aW9uIGhpZGVfdG9jKCkge1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LmFkZChcImhpZGUtdG9jXCIpO1xuICAgIGdsLnRvY19jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInRvYy1pbi1zaG93XCIpO1xufVxuXG5mdW5jdGlvbiBzaG93X3RvYygpIHtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlLXRvY1wiKTtcbiAgICBnbC50b2NfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0b2MtaW4tc2hvd1wiKTtcbn1cblxuLyoqIHRvYyAqL1xuY29uc3QgX3RvY18gPSBgXG48ZGl2IGNsYXNzPVwidG9jLW5hbWVcIj5cblRPQ1xuPC9kaXY+XG5gO1xuZXhwb3J0IGZ1bmN0aW9uIGRvX3RvYygpIHtcbiAgICBpZighZ2wuaW5fcG9zdF9zZWN0aW9uKSByZXR1cm47XG5cbiAgICB1dGlscy5yZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKCgpID0+IHtcbiAgICAgICAgbGV0IHRvYyA9IGdldFRPQygpO1xuICAgICAgICBsZXQgdG9jX2h0bWwgPSB0b2MuZ2VuZXJhdGVIdG1sKCk7XG4gICAgICAgIGxldCB0b2NfY29udGFpbmVyID0gZ2wudG9jX2NvbnRhaW5lcjtcbiAgICAgICAgYXNzZXJ0X2V4cHIodG9jX2NvbnRhaW5lciAhPSBudWxsKTtcbiAgICAgICAgdG9jX2NvbnRhaW5lci5pbm5lckhUTUwgPSBfdG9jXyArIHRvY19odG1sO1xuXG4gICAgICAgIGxldCB0b2NfY29udHJvbGxlcnMgPSB0b2NfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9jLWNvbnRyb2xsZXJcIik7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dG9jX2NvbnRyb2xsZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gdG9jX2NvbnRyb2xsZXJzW2ldIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRlLXRoZS10b2MnKTtcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gdGl0bGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLmNsYXNzTGlzdC50b2dnbGUoJ3RvYy1jaGlsZHJlbi1oaWRlJyk7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVnX3Nob3dfdGhlXyhlbGVtOiBIVE1MRWxlbWVudCwgaGVhZF9pZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MTtpPD02O2krKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGgke2l9W2lkPScke2hlYWRfaWR9J11gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYoZiA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9sZC5zaG93KGYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGlua3MgPSB0b2NfY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudG9jLXRpdGxlIGFcIik7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8bGlua3MubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgbGV0IGxpbmsgPSBsaW5rc1tpXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0YWcgPSBsaW5rLmF0dHJpYnV0ZXNbXCJocmVmXCJdLnZhbHVlLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHJlZ19zaG93X3RoZV8obGluaywgdGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBoaWRlIHRvYyAqL1xuICAgICAgICBsZXQgdG9jX3Nob3cgPSB0cnVlO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZighdG9jX3Nob3cpIHJldHVybjtcbiAgICAgICAgICAgIGxldCByID0gZXYudGFyZ2V0IGFzIEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAociAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHIgPT0gZ2wudG9jX2NvbnRhaW5lciB8fCByID09IGdsLnRvY19zd2l0Y2hlcilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHIgPSByLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoaWRlX3RvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmKHRvY19zaG93KSBoaWRlX3RvYygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKiogdG9nZ2xlIHN3aXRjaGVyICovXG4gICAgICAgIHV0aWxzLnRpbWVvdXRfYWRkX2NsYXNzKGdsLnRvY19zd2l0Y2hlciwgJ2hpZGUnLCB0cnVlLCAyNTAwLCAoZSwgZikgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBmKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdsLnRvY19zd2l0Y2hlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICBzaG93X3RvYygpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuIiwiXG5mdW5jdGlvbiBnZXRDYWxsZXIgKCkgLy97XG57XG4gICAgbGV0IHJlZyA9IC9cXHMrYXQgKFxcUyspKCBcXCgoW14pXSspXFwpKT8vZztcbiAgICBsZXQgZWU6IHN0cmluZztcbiAgICB0cnkge3Rocm93IG5ldyBFcnJvcigpO31cbiAgICBjYXRjaCAoZSkge2VlID0gZS5zdGFjazt9XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIHJlZy5leGVjKGVlKTtcbiAgICBsZXQgbW0gPSByZWcuZXhlYyhlZSk7XG4gICAgaWYgKCFtbSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIFttbVszXSB8fCBcIlwiLCBtbVsxXV07XG59OyAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3YpIC8ve1xue1xuICAgIGxldCBjYWxsZXIgPSBnZXRDYWxsZXIoKTtcbiAgICBsZXQgbXNnID0gXCJkZWJ1ZyBtZXNzYWdlXCI7XG4gICAgbXNnID0gY2FsbGVyID8gYFske2NhbGxlclsxXX0gKCR7Y2FsbGVyWzBdfSldOiBgIDogYFske21zZ31dOiBgO1xuICAgIGNvbnNvbGUuZGVidWcobXNnLCAuLi5hcmd2KTtcbn0gLy99XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfZXhwcih2OiBib29sZWFuLCBlcnIgPSBcImFzc2VydCBmYWlsXCIpIC8ve1xue1xuICAgIGlmICh2KSByZXR1cm47XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7ZXJyfV06IGA7XG4gICAgdGhyb3cgbXNnO1xufSAvL31cblxubGV0IGNhbGxiYWNrX3N0YWNrOiBbRnVuY3Rpb24sIGFueVtdXVtdID0gW11cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcl9mdW5jdGlvbl9jYWxsKGZ1bmMsIC4uLmFyZ3MpIHtcbiAgICBhc3NlcnRfZXhwcih0eXBlb2YoZnVuYykgPT09ICdmdW5jdGlvbicpO1xuICAgIGNhbGxiYWNrX3N0YWNrLnB1c2goW2Z1bmMsIGFyZ3NdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxfcmVnaXN0ZXJfZnVuY3Rpb25zKCkge1xuICAgIHdoaWxlKGNhbGxiYWNrX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGZhID0gY2FsbGJhY2tfc3RhY2sucG9wKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmYVswXS5jYWxsKHdpbmRvdywgLi4uZmFbMV0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudHlwZSBob3d0b2NhbGwgPSAoZWxlbTogSFRNTEVsZW1lbnQsIGFkZF9mdW5jOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganVzdCByZW1vdmUgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9yZW1vdmVfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGhhczogYm9vbGVhbiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBzdHJpbmcsIHRpbWVfbXM6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9yZW1vdmUoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2FkZCgpIHtcbiAgICAgICAgaWYoIWFkZGVkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9yZW1vdmUsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX2FkZCk7XG59XG5cbi8qKiB3aGVuIHRoZSB0aW1lciBleHBpcmVzIGpzdXQgYWRkIHRoZSBjbGFzcyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRfYWRkX2NsYXNzKGVsZW06IEhUTUxFbGVtZW50LCBjbHM6IHN0cmluZywgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lX21zOiBudW1iZXIsIHdoZW46IGhvd3RvY2FsbCkge1xuICAgIGxldCBhZGRlZDogYm9vbGVhbiA9IGhhcztcbiAgICBsZXQgdGltZW91dDogbnVtYmVyID0gMDtcbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgaWYoYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KF9hZGQsIHRpbWVfbXMpO1xuICAgIH1cblxuICAgIHdoZW4oZWxlbSwgX3JlbW92ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0Mmh0bWwoc3RyOiBzdHJpbmcpOiBIVE1MRWxlbWVudCBcbntcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gc3RyLnRyaW0oKTtcbiAgICByZXR1cm4gZGl2LmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG59XG5cbiJdfQ==
