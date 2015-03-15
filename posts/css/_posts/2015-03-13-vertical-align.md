vertical-align只作用于inline, inline-block及table-cell上, 所以注意使用此法的局限性.
首先介绍一种比较绕的解法方法, 看代码：

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

```css
.center-wrap {
  text-align: center;
  font-size: 0;
  width: 70%;
  margin: 0 auto;
  border-radius: 50%;

  &:after {
    display: inline-block;
    padding-top: 100%;
    height: 100%;
    content: " ";
    width: 0;
    vertical-align: middle;
  }
}

.center-content {
  display: inline-block;
  vertical-align: middle;
  font-size: 30px;
  &.center-wrap {
    font-size: 0;
  }
}
```

咋眼看一，我去! 这里的`line-box-helper`是干嘛用的？怎么还用这么写？！问题是这样的，vertical-align 的对齐是基于每个 [line box](http://www.w3.org/TR/CSS21/visuren.html#inline-formatting)的，而demo容器并非该行文本的`line box`，因此就算定义vertical-align: middle也是没有用的。那怎么办呢？我们知道`line box`元素的高度是由其内容决定，所在就在此处添加一个`line-box-helper`，其作用是把与文本处于同一`line box`的元素撑到和父级元素一样大。

[1] http://demo.doyoe.com/css/alignment/
