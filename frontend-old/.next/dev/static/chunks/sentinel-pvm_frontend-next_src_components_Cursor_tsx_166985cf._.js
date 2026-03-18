(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/sentinel-pvm/frontend-next/src/components/Cursor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Cursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Cursor() {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mouseX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        stiffness: 500,
        damping: 50
    });
    const mouseY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        stiffness: 500,
        damping: 50
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Cursor.useEffect": ()=>{
            setMounted(true);
            const handleMouseMove = {
                "Cursor.useEffect.handleMouseMove": (e)=>{
                    mouseX.set(e.clientX);
                    mouseY.set(e.clientY);
                }
            }["Cursor.useEffect.handleMouseMove"];
            window.addEventListener("mousemove", handleMouseMove);
            return ({
                "Cursor.useEffect": ()=>window.removeEventListener("mousemove", handleMouseMove)
            })["Cursor.useEffect"];
        }
    }["Cursor.useEffect"], [
        mouseX,
        mouseY
    ]);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "fixed top-0 left-0 w-4 h-4 bg-accent rounded-full pointer-events-none z-[10000] mix-blend-difference",
        style: {
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%"
        }
    }, void 0, false, {
        fileName: "[project]/sentinel-pvm/frontend-next/src/components/Cursor.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(Cursor, "CixBy9F/CAGxcmVSMiBm1nCofW0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"]
    ];
});
_c = Cursor;
var _c;
__turbopack_context__.k.register(_c, "Cursor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=sentinel-pvm_frontend-next_src_components_Cursor_tsx_166985cf._.js.map