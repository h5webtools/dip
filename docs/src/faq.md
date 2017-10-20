## 常见问题

**Q: 如何定义命令字（cmd）。**

A: method选择`post`，在body部分填写`cmd`，并且勾上`固定值`，在`固定值和例子`填写具体值

**Q: 目前h5活动或者h5产品项目，请求mock接口失败解决办法**

A: 可以尝试带上query参数来修复：`{ mockURL }?_mockPostFix=1`

**Q: 如何使用接口代理转发**

A: 开启后请求mock地址会转发到指定地址，除此外，为便于前端代码控制，也可以在请求Mock URL时，带上query参数来设置：
转发线上：`{ mockURL }?_mockProxyStatus=1`，转发测试：`{ mockURL }?_mockProxyStatus=2`

**Q: 请求Mock URL出现404 not found。**

A: 请先确认请求协议是否正确。为严格定义接口，系统会严格判断请求协议。若发起请求类型不对，接口会返回404。

**Q: query参数类型只有string，number，boolean？**

A: Query参数本质都是字符串，接口为了适应实际需求，还另外加了number与boolean类型的校验，但不支持object与array，若有类似以批量id查询的接口，请以字符串加分隔符的格式传输。

**Q: 如何删除接口？**

A: 鼠标移动到右上角账户名，选择接口管理，可以删除接口。但仅限于接口管理员有权限（接口创建者默认为接口管理员），分组同上。

