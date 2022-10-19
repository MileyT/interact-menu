(function a(){
    var layer = null;
    class Devices extends HTMLElement{
      constructor() {
        super();
        let map = new Map([["pad", "pad.png"],["phone", "phone.png"],["pc","pc.png"]])
        let style = new Map([["pad", "pad"],["phone", "phone"],["pc","pc"]]);
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
          .container{
            background-color: #d4e9d6;
            border-radius: 4px;
            text-align: center;
            color: red
          }
          .components{
            display: flex;
            padding-left: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
            flex-direction: "row";
            width: 200px;
            color: black;
            font-size: 14px
          }
        </style>
        <div class="container">
        组件展示到
        <div id="devices" class="components"/>
        </div>
      `;
        var shadow = this.attachShadow( { mode: 'closed' } );
        fetch('http://10.5.139.38:3005/devices/getDevices')
        .then(res =>{
          console.log(res)
          res.json().then(function(data){
            var content = template.content.cloneNode(true);
          /**let data = [{
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
          }]*/
          data.map(item =>{
            //console.log(JSON.stringify(item));
            const p = document.createElement("user-device");
            p.setAttribute("data", JSON.stringify(item));
            content.querySelector('#devices').appendChild(p);
          })
          shadow.appendChild(content);
         });

      })

      }
    }
    class Device extends HTMLElement {
        constructor() {
          super();
      }
      static get observedAttributes() {return ['data']; }
      attributeChangedCallback(name, oldValue, newValue) {
        console.log("111");
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
          .widget{
            margin-right: 20px;
            text-align: center;
          }
          .title{
            width: 100%;
            white-space: nowrap;
            text-align: center;
          }
          #picContainer{
            width: 50px;
            height: 50px;
          }
          .phone{
            width: 28px;
            height: auto;
          }
          .pc{
            padding-top: 2px;
            width: 52px;
            height: auto
          }
          .pad{
            width: 35px;
            height: auto;
          }
          .components{
            display: flex;
            flex-direction: "row";
            width: 200px;
          }
        </style>
        <div id="container" class="widget">
          <div id="picContainer"><img></img></div>
          <div id="title">{data.title}</div>
        </div>
      `;
        var shadow = this.attachShadow( { mode: 'closed' } );

        var content = template.content.cloneNode(true);

        console.log(this.getAttribute('data'));
        let data= JSON.parse(this.getAttribute('data'));
        content.querySelector('#container').addEventListener("click", () =>{
          console.log("点击了")
          //this.props.onClick(data);
        })
        content.querySelector('#picContainer>img').setAttribute('src', `${data.category}.png`);
        content.querySelector('#picContainer>img').setAttribute('class', `${data.category}`);
        content.querySelector('#title').innerText = data.title;
        content.querySelector('#title').setAttribute('class', `title title_${data.category}`);

        shadow.appendChild(content);
    }
    }

    function showLayer(x, y){
      let str = `position:absolute;left:${x - 10}px; top:${y - 100}px`;
      if (!layer){
        const p = document.createElement("user-Devices");
        const d = document.createElement("div");
        d.style.cssText = str;
        d.appendChild(p);
        document.body.appendChild(d);
        layer = d;
      } else {
        layer.style.cssText = str;
      }
    }
    window.customElements.define('user-device', Device);
    window.customElements.define('user-devices', Devices);
    window.click = (ele) =>{
      ele.addEventListener('click', function (e) {
        showLayer(e.clientX, e.clientY);
      });
      document.addEventListener("click", function(e){
        if (e.target !== ele && layer){
          document.body.removeChild(layer);
          layer = null;
        }
      })
    }
    window.longpress = (ele) =>{
        console.log("添加事件")
        let timer = null
        let startTime = ''
        let endTime = ''

        ele.addEventListener('touchstart', function () {
          startTime = +new Date()
          timer = setTimeout(function () {
            showLayer(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
          }, 700)
        })

        ele.addEventListener('touchend', function (e) {
          endTime = +new Date()
          clearTimeout(timer)
          if (endTime - startTime > 700) {
            showLayer(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
          }
        })
        document.addEventListener("click", function(e){
          if (e.target !== ele && layer){
            document.body.removeChild(layer);
            layer = null;
          }
        })
      }

    //test
    //const p = document.createElement("user-Devices");
    //document.body.appendChild(p);

})();

