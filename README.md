# Cloud Commander

> 源项目 https://github.com/coderaiser/cloudcmd  <br>
> 官网  https://cloudcmd.io/

## 环境要求
nodejs >= v16.19.0 

## 说明
1. 前端页面已经编译好，无需执行`npm run build`重新编译。
2. 默认端口为8081，可在`cloudcmd/json/config.json`中第16行进行更改。
3. 自带`gritty`终端，无需全局安装`gritty `。
4. 开启用户名密码认证，需要将`cloudcmd/json/config.json`文件中`auth`设置为`true`，`username`设置为自定义用户名，`password`要填`sha512WithRSAEncryption`算法处理过的字符串，建议全局安装cloudcmd后执行命令`cloudcmd --username name --password password --auth --save --no-server`，会在家目录下生成`~/.cloudcmd.json`文件，拷贝其中的`password`字段值到`cloudcmd/json/config.json`中对应位置，然后重启cloudcmd即可。如果是在docker容器部署的web网页中进行auth开启，由于会重启node进程从而导致整个容器重启，所以这样往往不会开启成功，甚至会无法登陆，因为你也不知道密码是啥，还是建议现在`cloudcmd/json/config.json`中把密码填好，再进行后续操作。补充一下，官方提供的默认用户名是`root`，密码是`toor`。

## 启动步骤
### 1. 重新编译`node-pty`
由于该项目依赖微软的`node-pty`(https://github.com/microsoft/node-pty),  `node-pty`对nodejs版本有严格要求，不同nodejs版本上编译出来的`node-pty`在其他nodejs版本的平台上是无法运行的，所以这里需要重新编译`node-pty`。

#### 1.1 安装c++ 编译环境
以下提供Ubuntu/Debian 安装命令，centos以及其他linux发行版请自行google
``` shell
sudo apt update
sudo apt install build-essential gdb
sudo apt install cmake
```
#### 1.2 rebuild `node-pty`
``` shell
cd cloudcmd/node_modules/node-pty
npm rebuild
```

### 2. 启动`Cloud Commander`
安装npm依赖
``` shell
npm install
```

命令行启动
```shell
node cloudcmd/bin/cloudcmd.mjs
```

或者pm2守护该进程
```shell
pm2 start cloudcmd/bin/cloudcmd.mjs
```
然后浏览器访问http://yourIP:8081,  不出意外就会显示相关页面。

### 3. nginx反向代理`Cloud Commander`(该步骤不是必要)
#### 3.1 配置Cloud Commander全局路由前缀
编辑`cloudcmd/json/config.json`第19行的`prefix`属性，这里我设置为`cc`
``` json
    "prefix": "cc",
```
#### 3.2 配置nginx反向代理
这里我以443端口的https server为例，设置最大传输报文体为1024MB，并配置反向代理`Cloud Commander`，http协议同理。
``` nginx
http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    client_max_body_size 1024m;
	
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name localhost;

        ssl_certificate /root/cert.crt;
        ssl_certificate_key /root/private.key;

        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        location / {
            root html;
            index index.html index.htm;
        }
		
	#https://github.com/coderaiser/cloudcmd  start
	location /cc {
		proxy_pass http://127.0.0.1:8081;
		proxy_http_version 1.1;
		proxy_read_timeout 5000;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
	#https://github.com/coderaiser/cloudcmd  end
    }
}
```

## 补充说明
如果您因网络原因无法下载该项目的全量依赖，可自行下载如下网盘中的文件，解压后按照上述步骤安装运行即可
```
链接: https://pan.baidu.com/s/1hd_0OBw-XUBqpI4uie1aqw 
提取码: 8888
```


