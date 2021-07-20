import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

export default [{
    input: { index: `src/index.js`, sw: `src/serviceWorker.js` },
    output: {
        format: `es`,
        entryFileNames: `assets/js/[name].js`,
        dir: `public`,
        exports: `none`, // as we're an app, no exposing anything from a module
    },
    plugins: [
        del({
            targets: [`public`],
            runOnce: true,
        }),
        copy({
            targets: [{ src: `src/index.html`, dest: `public` }],
        }),
        json(),
    ],
}]