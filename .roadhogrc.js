const path = require('path')
const { version } = require('./package.json')
const { devProxyHost } = require('./src/utils/config')

const svgSpriteDirs = [
    path.resolve(__dirname, 'src/svg/'),
    require.resolve('antd').replace(/index\.js$/, '')
]

export default {
    entry: 'src/index.js',
    svgSpriteLoaderDirs: svgSpriteDirs,
    theme: "./theme.config.js",
    hash: true,
    publicPath: `/${version}/`,
    // outputPath : `./dist/${version}`,
    outputPath: `./dist/deploy`,
    proxy: {
        "/api/moodle": {
            "target": process.env.PROXY_HOST || devProxyHost,
            "changeOrigin": true,
            "pathRewrite": { "^/api/": "/" }
        },
    },
    autoprefixer: {
        browsers: [
            "iOS >= 8",
            "Android >= 4"
        ]
    },
    env: {
        development: {
            extraBabelPlugins: [
                'dva-hmr',
                'transform-runtime',
                ['import', { 'libraryName': 'antd', 'style': true }],
                ["module-resolver", {
                    root: ["./src"],
                    alias: {
                        components: `${__dirname}/src/components`,
                        utils: `${__dirname}/src/utils`,
                        config: `${__dirname}/src/utils/config`,
                        services: `${__dirname}/src/services`,
                        models: `${__dirname}/src/models`,
                        routes: `${__dirname}/src/routes`,
                        constants: `${__dirname}/src/constants`,
                        themes: `${__dirname}/src/themes`,
                    }
                }]
            ],
        },
        production: {
            extraBabelPlugins: [
                'transform-runtime',
                ['import', { 'libraryName': 'antd', 'style': true }],
                ["module-resolver", {
                    root: ["./src"],
                    alias: {
                        components: `${__dirname}/src/components`,
                        utils: `${__dirname}/src/utils`,
                        config: `${__dirname}/src/utils/config`,
                        services: `${__dirname}/src/services`,
                        models: `${__dirname}/src/models`,
                        routes: `${__dirname}/src/routes`,
                        constants: `${__dirname}/src/constants`,
                        themes: `${__dirname}/src/themes`,
                    }
                }]
            ],
        }
    },
    dllPlugin: {
        exclude: ["babel-runtime", "roadhog", "cross-env"],
        include: ["dva/router", "dva/saga", "dva/fetch"]
    }
}
