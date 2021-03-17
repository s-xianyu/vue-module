const path = require('path');
let Version = new Date().getTime();

// 项目的打包输出目录
const outputDir = process.env.VUE_APP_OUTPUT_DIR

const isProduction = process.env.NODE_ENV === 'production';

// 项目部署路径的BASE_URL
const publicPath = process.env.VUE_APP_TYPENAME === 'dev' ? './' : `${process.env.BASE_URL || './'}`;

const publicJs = [
  `${publicPath}static/commonJs/wfq-vue2.6.12.min.js`,
  `${publicPath}static/commonJs/wfq-vue-router3.4.9.min.js`,
  `${publicPath}static/commonJs/wfq-axios0.21.min.js`,
];

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [
      // 'https://cdn.jsdelivr.net/npm/eruda'
    ],
  },
  // 生产环境
  build: {
    css: [],
    js: publicJs,
  }
}

// 添加样式自动化导入
const addStyleResourceLoader = webpackConfig => {
  const fileTypes = ['less', 'sass', 'scss']
  const cssModules = ['vue-modules', 'vue', 'normal-modules', 'normal']
  const targetRules = fileTypes.reduce((rulesArr, fileType) => rulesArr.concat(
    cssModules.map(cssModule => webpackConfig.module.rule(fileType).oneOf(cssModule))
  ), [])
  targetRules.forEach(rule => {
    rule.use('style-resource').loader('style-resources-loader').options({
      patterns: [
        path.resolve(__dirname, `./src/style/*.${rule.names[0]}`)
      ]
    })
  })
}

// 添加包分析工具
const addBundleAnalyzer = webpackConfig => {
  if (process.argv[2] === 'build' && process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
  }
}

// 优化打包行为 —— 移除打包后的 js.map 文件和 console 输出
// 注意，只能移除默认形式的 console; 无法移除形如 let log = console.log; log(111) 这种形式的输出
const upgradeMinimizer = webpackConfig => {
  webpackConfig.optimization.minimizer('terser').tap(args => {
    args[0].terserOptions.compress.drop_console = true;
    args[0].terserOptions.compress.drop_debugger = true;
    if (process.env.VUE_APP_TYPENAME !== 'dev') { // 开发环境输出console.log
      args[0].terserOptions.compress.pure_funcs = ['console.log']
    }
    return args
  })
}

module.exports = {
  devServer: {
    port: 4000,
  },
  lintOnSave: false, // 关闭eslint
  productionSourceMap: false, // 关闭生产环境的sourcemap
  publicPath: publicPath, // 生成环境部署路径
  assetsDir:'static', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  indexPath:'index.html', // index.html 的输出路径 (相对于 outputDir)
  outputDir: outputDir, // 当运行 build 时生成的生产环境构建文件的目录
  chainWebpack: config => {
    config.plugin('html').tap((args) => {
      if (isProduction) {
        args[0].cdn = cdn.build;
        args[0].title = '贷后监控'
      } else {
        args[0].cdn = cdn.dev;
        args[0].title = '贷后监控'
      }
      return args;
    });
    addStyleResourceLoader(config)
    addBundleAnalyzer(config)
    upgradeMinimizer(config)
  },
  configureWebpack: config => {
    // config.output.chunkFilename = 'static/js/[name].[' + Version + '].js' //这种方式适合设备缓存不严重的
    config.output.chunkFilename = 'static/js/[name].js?v=' + Version    //这种是给打包后的chunk文件加版本号。
    if (isProduction) {
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'axios': 'axios'
      }
    }
  },
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({//这里是配置项，详见官方文档
            rootValue : 50, // 换算的基数
            selectorBlackList  : ['weui','mu'], // 忽略转换正则匹配项
            propList   : ['*'],
          }),
        ]
      }
    }
  }
}

