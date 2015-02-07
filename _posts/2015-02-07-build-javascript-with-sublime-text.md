---
layout: post
title: "build javascript with sublime text"
description: ""
category:
tags: []
---

## 前言
调试js代码经常是在浏览器中完成的, 如果编辑器也能完成部分的调试工作, 那我相信前端和node的世界将美好很多. OK, 先上图:

![sublime build demo][1]

## 实现

### 首先安装[nodejs](http://nodejs.org/)
当然你可以使用其它诸如[jsc](https://trac.webkit.org/wiki/JSC)之类的环境来运行js, 本文使用的是[nodejs](http://nodejs.org/). 首先确保你的电脑已经安装好nodejs, 并已将其添加到环境变量中 (一般安装时自动添加或者询问是否添加)

### 添加[build system](https://sublime-text-unofficial-documentation.readthedocs.org/en/sublime-text-2/file_processing/build_systems.html)
在sublime text中依次打开Tools -> Build System -> New Build System... 粘贴以下代码后保存(如Node.sublime-build), 然后把Build System设成Automatic

    {
        "cmd": ["node", "--use-strict", "--harmony", "$file"],
        "selector": "source.js"
    }

### 说明

在以上的build文件中(Node.sublime-build), node是执行命令, --harmony和--use-strict是执行参数, $file是当前文件名, 所以一次build操作实际上相当于在命令行中执行了`node  --use-strict --harmony filename`. `--harmony`表示启用[ES Harmony features](http://kangax.github.io/compat-table/es6/), 而这些features目前只能在strict模式下运行, 所以需要同时添加use-strict参数(详见[what-is-extended-mode](http://stackoverflow.com/questions/17253509/what-is-extended-mode)).

如果不想启用es6的特性,把build文件更改成以下代码保存即可.


    {
        "cmd": ["node", "$file"],
        "selector": "source.js"
    }


## 使用
在sublime test中新建一个test.js文件, 然后输入你的测试代码, 比如:


    for (let i = 0; i < 3; i++) {
        console.log('i:', i);
    }


使用快捷键`ctrl + b`, 将得到以下执行结果:


    i: 0
    i: 1
    i: 2
    [Finished in 0.1s]


注: 文件必须是存在于磁盘中的, 而不是untitled的, 否则sublime无法找到相应的文件.

以上.


  [1]: http://sfault-image.b0.upaiyun.com/160/788/1607889778-546eacc1a7253
