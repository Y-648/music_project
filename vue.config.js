module.exports={
    // 判断是否为生产环境，改变网站二级目录
    publicPath:process.env.NODE_ENV==='production'?"./":"/",
    outputDir:'dist',//编译的输出目录
    assetsDir:'static',//打包资源文件 js css img
    runtimeCompiler:true,
    // configureWebpack:{
    //     devServer:{
    //         proxy:{//代理
    //             '/personalized/newsong':{//路径
    //                 target:'http://music.kele8.cn/personalized',//代理域名地址
    //                 changeOrigin:true//是否可以跨域
    //             }
    //         }
    //     }
    // }
}