//var browsers = {
//    chrome: {
//        fixed: 22
//    }
//};

//var browser = (function () {
//    var N = navigator.appName;
//    var ua = navigator.userAgent;
//    var tem;
//    var M = ua.match(
//        /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
//    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) {
//        M[2] = tem[1];
//    }
//    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
//    return {
//        name: M[0].toLowerCase(),
//        version: M[1]
//    };
//})();

//var isFixedStackingCtx = (function () {
//    return browsers[browser.name].fixed >= parseInt(browser.version, 10);
//})();

//function isFunction(thing) {
//    return typeof thing === "function";
//}

//function isPosAndHasZindex(el) {
//    return el.style.position !== "static" && el.style.zIndex !== "auto";
//}

//function doesStyleCreateStackingCtx(el) {
//    var styles = el.style;

//    if (styles.opacity < 1) {
//        return true;
//    }
//    if (styles.transform !== "none") {
//        return true;
//    }
//    if (styles.transformStyle === "preserve-3d") {
//        return true;
//    }
//    if (styles.perspective !== "none") {
//        return true;
//    }
//    if (styles.flowForm !== "none" && styles.content !== "normal") {
//        return true;
//    }
//    if (styles.position === "fixed" && isFixedStackingCtx) {
//        return true;
//    }
//    return false;
//}

//var jenga = (function (global) {
//    'use strict';

//    return {
//        isStackingCtx: function (el) { },

//        getStackingCtx: function (el) { },

//        bringToFront: function (el, createStackingCtx, root) { },

//        sendToBack: function (el, createStackingCtx, root) { },
//    };
//})(this);
