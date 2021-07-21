import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [{
    input: `src/main.js`,
    output: {
        format: `iife`,
        entryFileNames: `assets/js/index.js`,
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
        resolve({
            browser: true,
            extensions: [`.js`, `.json`],
        }),
        json(),
        commonjs(),
    ],
},
{
    input: `src/serviceWorker.js`,
    output: {
        format: `iife`,
        entryFileNames: `assets/js/sw.js`,
        dir: `public`,
        exports: `none`, // as we're an app, no exposing anything from a module
    },
    plugins: [
        resolve({
            browser: true,
            extensions: [`.js`, `.json`],
        }),
        json(),
        commonjs(),
    ],
}]