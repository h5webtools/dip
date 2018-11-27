1、mongodb 的配置
2、nginx

```javascript
server {
    listen             80;
    server_name  mock_fe.yunjiaplus.com;

    access_log  logs/mock_fe_yunjia.log  main;
    error_log  logs/mock_fe_yunjia.error.log;

    location /mock-api/ {
      proxy_pass http://172.16.1.118:7166/;
      add_header Cache-Control no-store;
    }

    location / {
      root /data/www/dipyunjia/client/dist;
      add_header Cache-Control no-store;
      index  index.html;
    }
}
```

3、域名
前端config
serverRoot: 'mock-yunjia.jyb.com/mock-api'

