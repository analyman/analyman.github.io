(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0aGVtZXMvc2xhbWUvc291cmNlL2pzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0NBLFNBQVMsU0FBUztJQUVkLElBQUksR0FBRyxHQUFHLDZCQUE2QixDQUFDO0lBQ3hDLElBQUksRUFBVSxDQUFDO0lBQ2YsSUFBSTtRQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztLQUFDO0lBQ3hCLE9BQU8sQ0FBQyxFQUFFO1FBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FBQztJQUN6QixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEIsSUFBSSxDQUFDLEVBQUU7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNyQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBQUEsQ0FBQyxDQUFDLEdBQUc7QUFFTixTQUFnQixLQUFLO0lBQUMsY0FBTztTQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87UUFBUCx5QkFBTzs7SUFFekIsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDekIsSUFBSSxHQUFHLEdBQUcsZUFBZSxDQUFDO0lBQzFCLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBTSxDQUFDLENBQUMsQ0FBQyxNQUFJLEdBQUcsUUFBSyxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxLQUFLLE9BQWIsT0FBTyxrQkFBTyxH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QUFFO1lBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNqQjthQUFNO1lBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQztRQUNELE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBcEJELDhDQW9CQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxHQUFXO0lBRWpDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLENBQUMsVUFBeUIsQ0FBQztBQUN6QyxDQUFDO0FBTEQsOEJBS0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbmZ1bmN0aW9uIGdldENhbGxlciAoKSAvL3tcbntcbiAgICBsZXQgcmVnID0gL1xccythdCAoXFxTKykoIFxcKChbXildKylcXCkpPy9nO1xuICAgIGxldCBlZTogc3RyaW5nO1xuICAgIHRyeSB7dGhyb3cgbmV3IEVycm9yKCk7fVxuICAgIGNhdGNoIChlKSB7ZWUgPSBlLnN0YWNrO31cbiAgICByZWcuZXhlYyhlZSk7XG4gICAgcmVnLmV4ZWMoZWUpO1xuICAgIGxldCBtbSA9IHJlZy5leGVjKGVlKTtcbiAgICBpZiAoIW1tKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gW21tWzNdIHx8IFwiXCIsIG1tWzFdXTtcbn07IC8vfVxuXG5leHBvcnQgZnVuY3Rpb24gZGVidWcoLi4uYXJndikgLy97XG57XG4gICAgbGV0IGNhbGxlciA9IGdldENhbGxlcigpO1xuICAgIGxldCBtc2cgPSBcImRlYnVnIG1lc3NhZ2VcIjtcbiAgICBtc2cgPSBjYWxsZXIgPyBgWyR7Y2FsbGVyWzFdfSAoJHtjYWxsZXJbMF19KV06IGAgOiBgWyR7bXNnfV06IGA7XG4gICAgY29uc29sZS5kZWJ1Zyhtc2csIC4uLmFyZ3YpO1xufSAvL31cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF9leHByKHY6IGJvb2xlYW4sIGVyciA9IFwiYXNzZXJ0IGZhaWxcIikgLy97XG57XG4gICAgaWYgKHYpIHJldHVybjtcbiAgICBsZXQgY2FsbGVyID0gZ2V0Q2FsbGVyKCk7XG4gICAgbGV0IG1zZyA9IGNhbGxlciA/IGBbJHtjYWxsZXJbMV19ICgke2NhbGxlclswXX0pXTogYCA6IGBbJHtlcnJ9XTogYDtcbiAgICB0aHJvdyBtc2c7XG59IC8vfVxuXG5sZXQgY2FsbGJhY2tfc3RhY2s6IFtGdW5jdGlvbiwgYW55W11dW10gPSBbXVxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyX2Z1bmN0aW9uX2NhbGwoZnVuYywgLi4uYXJncykge1xuICAgIGFzc2VydF9leHByKHR5cGVvZihmdW5jKSA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgY2FsbGJhY2tfc3RhY2sucHVzaChbZnVuYywgYXJnc10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbF9yZWdpc3Rlcl9mdW5jdGlvbnMoKSB7XG4gICAgd2hpbGUoY2FsbGJhY2tfc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZmEgPSBjYWxsYmFja19zdGFjay5wb3AoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhWzBdLmNhbGwod2luZG93LCAuLi5mYVsxXSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG50eXBlIGhvd3RvY2FsbCA9IChlbGVtOiBIVE1MRWxlbWVudCwgYWRkX2Z1bmM6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG4vKiogd2hlbiB0aGUgdGltZXIgZXhwaXJlcyBqdXN0IHJlbW92ZSB0aGUgY2xhc3MgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0X3JlbW92ZV9jbGFzcyhlbGVtOiBIVE1MRWxlbWVudCwgaGFzOiBib29sZWFuLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHM6IHN0cmluZywgdGltZV9tczogbnVtYmVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuOiBob3d0b2NhbGwpIHtcbiAgICBsZXQgYWRkZWQ6IGJvb2xlYW4gPSBoYXM7XG4gICAgbGV0IHRpbWVvdXQ6IG51bWJlciA9IDA7XG4gICAgZnVuY3Rpb24gX3JlbW92ZSgpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYWRkKCkge1xuICAgICAgICBpZighYWRkZWQpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX3JlbW92ZSwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfYWRkKTtcbn1cblxuLyoqIHdoZW4gdGhlIHRpbWVyIGV4cGlyZXMganN1dCBhZGQgdGhlIGNsYXNzICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dF9hZGRfY2xhc3MoZWxlbTogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nLCBoYXM6IGJvb2xlYW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVfbXM6IG51bWJlciwgd2hlbjogaG93dG9jYWxsKSB7XG4gICAgbGV0IGFkZGVkOiBib29sZWFuID0gaGFzO1xuICAgIGxldCB0aW1lb3V0OiBudW1iZXIgPSAwO1xuICAgIGZ1bmN0aW9uIF9hZGQoKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfcmVtb3ZlKCkge1xuICAgICAgICBpZihhZGRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgICAgICBhZGRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoX2FkZCwgdGltZV9tcyk7XG4gICAgfVxuXG4gICAgd2hlbihlbGVtLCBfcmVtb3ZlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQyaHRtbChzdHI6IHN0cmluZyk6IEhUTUxFbGVtZW50IFxue1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5pbm5lckhUTUwgPSBzdHIudHJpbSgpO1xuICAgIHJldHVybiBkaXYuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudDtcbn1cblxuIl19
