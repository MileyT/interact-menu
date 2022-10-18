// 使用模块时需要用require('模块名')
const url = require('url');
var http = require('http'); //引用http模块
var fs = require("fs");

// http模块实例化，别名挂载
var app = http.createServer(function(req, res){
    console.log("haha")
    const urlObject = url.parse(req.url);
    const { pathname } = urlObject;
    console.log(pathname)
    // api开头的是API请求
  // read the html file content
    /**fs.readFile("index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      if (err) {
      console.error(
        "an error occurred while reading the html file content: ",
        err
      );
      throw err;
    }

    console.log("operation success!");

    res.write(data);
    res.end();
    return;
  });*/
  if (pathname.startsWith('/devices')) {
      // 再判断路由
      if (pathname === '/devices/getDevices') {
        // 获取HTTP动词
        const method = req.method;
        if (method === 'GET') {
          // 写一个假数据
         let map = new Map([["pad", "pad.png"],["phone", "phone.png"],["pc","pc.png"]])
          let style = new Map([["pad", "pad"],["phone", "phone"],["pc","pc"]]);
          const resData =[{
            title: "电脑",
            pic: map.get("pc"),
            style: style.get("pc")
          }, {
            title: "手机",
            pic: map.get("phone"),
            style: style.get("phone")
          },{
            title: "pad",
            pic: map.get("pad"),
            style: style.get("pad")
          }];
          res.setHeader('Content-Type', 'application/json');
          if( req.headers.origin == 'http://127.0.0.1:5500' || req.headers.origin == 'http://10.5.139.38:5500' ){
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
          }
          //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
          console.log("haha2")
          res.end(JSON.stringify(resData));
          return;
        }
      }
    }
});

app.listen(3005, function(){
   // 传入了两个参数
   // 第一个参数是3000是端口号，第二个参数是一个函数，表示服务器启动后执行的事
   // 在终端控制台上打印，方便了解服务器是否启动成功
   console.log("服务器启动成功，浏览器地址：http://127.0.0.1:3005/")
})