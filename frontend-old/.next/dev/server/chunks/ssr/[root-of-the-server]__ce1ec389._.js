module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/sentinel-pvm/frontend-next/src/components/Cursor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Cursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sentinel-pvm/frontend-next/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function Cursor() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const mouseX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        stiffness: 500,
        damping: 50
    });
    const mouseY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(0, {
        stiffness: 500,
        damping: 50
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const handleMouseMove = (e)=>{
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return ()=>window.removeEventListener("mousemove", handleMouseMove);
    }, [
        mouseX,
        mouseY
    ]);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$sentinel$2d$pvm$2f$frontend$2d$next$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ce1ec389._.js.map