import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import autoprefixer from 'autoprefixer'
export default {
    input: 'src/index.js',
    output: {
        file: './dist/videoCreator.js',
        name: "videoCreator",
        sourcemap: true,
        format: 'umd',
        globals: {
            "jQuery": "$"
        },
    },
    plugins: [
        resolve() ,
        postcss({
            plugins: [
                autoprefixer()
            ],
            minimize: true,
            extract: "css/video.css",
            sourceMap: true,
        }),

        babel({ babelHelpers: 'bundled', exclude: '**/node_modules/**' }),
        commonjs(),
        terser()
    ],
    external: ["jQuery"]
};