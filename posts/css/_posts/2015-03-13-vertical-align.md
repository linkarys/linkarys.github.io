---
title: "非固定高度元素的垂直居中"
description: ""
category: "css"
tags: ['css']
---

纯css垂直居中有若干种方案, 不过我们只会关注**look forward**或者最优的一两种方案,
并且我们希望这种一两方案具有比较强的普适性, 能满足基本的浏览器兼容需求, 以及允许无限制的嵌套.
本文将对这一目标进行一些探讨.

## 使用vertical-align来垂直居中

vertical-align有很多限制, 它只作用于inline, inline-block及table-cell上, 既然如此,
我们怎么普遍意义上使用vertical-align来垂直居中元素呢, 先看实现效果：

### 实现效果
<iframe width="300" height="240" src="/embed/vertical-align/vertical-align.html" frameborder="0" allowfullscreen></iframe>

### 相关代码


#### HTML
```html
<div class="center-wrap c1">
  <div class="center-content c2 center-wrap">
    <div class="center-content c3 center-wrap">
      <div class="center-content">
        Lorem ipsum dolor sit amet.
      </div>
    </div>
  </div>
</div>
```
#### CSS
```css{9-13,22-24}
.center-wrap {
  text-align: center;
  font-size: 0;
  width: 70%;
  margin: 0 auto;
  border-radius: 50%;

  &:after {
    display: inline-block;
    height: 100%;
    content: " ";
    width: 0;
    vertical-align: middle;
    padding-top: 100%;
  }
}

.center-content {
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  &.center-wrap {
    font-size: 0;
  }
}
```

咋眼看一，我去! 这里的`&:after`内的元素是干嘛用的？怎么还用这么写？！问题是这样的vertical-align
的对齐是基于每个 [line box](http://www.w3.org/TR/CSS21/visuren.html#inline-formatting)的，
而`.center-content`容器并非该行文本的`line box`，因此就算定义了vertical-align: middle也是没有用的。
**那怎么办呢？**我们知道`line box`元素的高度是由其内容决定，所在就在此处添加一个`&:after`，其作用是把与文本处于同一`line box`的元素撑到和父级元素一样大。

还有一个问题是: `font-size:0`是作什么用的？我们知道,inline-block元素元素之间是有间隙的（这个间隙会可以由换行符产生）,
这在内容只有单行的时候没有什么问题, 多行时间隙就会导致`line box`元素的高度和父级不一致, 产下如下悲剧:

<iframe width="300" height="240" src="/embed/vertical-align/vertical-align-break.html" frameborder="0" allowfullscreen></iframe>

## 使用flex垂直居中

未完待续...


参考资料:

[1] [http://demo.doyoe.com/css/alignment/](http://demo.doyoe.com/css/alignment/)
