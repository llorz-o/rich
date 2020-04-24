## 优化思路

1. tags 和 category 的查询可以额外建一个 statistics 集合进行统计

```
[{
    _id:'tagList',
    dataType:'array'
    data:[
        'tag1',
        'tag2'.
    ]
}]
```
通过对各种调用注入侦听函数,进行更新