# minpro-template

**项目运行**

``` bash
$ npm install
$ gulp dev
$ gulp build
```

> 小程序开发工具导入打包后`dist`目录下的文件，运行调试项目

---

- 预编译语言选用scss（ps：学天课堂小程序为了与h5一致选用了stylus，使用期间有两个问题：1. gulp-stylus对省略括号冒号的写法不能正确解析； 2. 图片别名在stylus下使用有问题）
- 公共样式放app.scss里，带前缀`xt-`

---

**图标的使用**

1. 登录阿里巴巴矢量图标库管理项目图标
2. 具体步骤参照`https://blog.csdn.net/fairyier/article/details/80811251`

**ES7语法 async/await的使用**
1. 微信开发者工具 -> 详情 -> 本地设置 -> 勾选 增强编译
2. 使用的文件里引入`@Libs/regenerator-runtime`
