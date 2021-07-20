export default [{
    input: { index: `src/index.js`, sw: `src/serviceWorker.js` },
    output: {
        format: `iife`,
        entryFileNames: `assets/js/[name].js`,
        dir: `public`,
        exports: `none`, // as we're an app, no exposing anything from a module
    }
}]