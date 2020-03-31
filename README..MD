## 应用分层

```txt
routes->services->dao->data
```

1. routes 路由层处理参数合法性校验,以及常见的权限认证,以及中间件
2. services 服务层处理业务逻辑
3. dao 层负责调用数据库
