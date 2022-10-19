(function a(){
    var layerData = null;
    var source = null;
    var model = null;
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
            padding: 1px
          }
          .widgetMove{
            border: 1px solid #bdd7ba;
            padding: 0px
          }
          .title{
            width: 100%;
            white-space: nowrap;
            text-align: center;
          }
          #picContainer{
            width: 50px;
            height: 50px;
            pointer-events: none;
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
        /**document.addEventListener("touchstart", (e) =>{
          console.log("点击了2")
          e.target.setAttribute('class', `widget widgetMove`);
          //this.props.onClick(data);
        })*/
        layerData.layerItemMaps.delete(data.id);
        var layerTo = content.querySelector('#container');
        layerData.layerItemMaps.set(data.id, (type, e, name) => {
          if (type === "touchmove") {
            var rect = layerTo.getBoundingClientRect()
            if (e.targetTouches[0].clientX >= rect.x && e.targetTouches[0].clientX <= rect.right && e.targetTouches[0].clientY >= rect.y && e.targetTouches[0].clientY <= rect.bottom){
              layerTo.setAttribute('class', `widget widgetMove`);
            } else {
              layerTo.setAttribute('class', `widget`);
            }
          } else if (type === "touchend"){
            var rect = layerTo.getBoundingClientRect();
            layerTo.setAttribute('class', `widget`);
            if (e.changedTouches[0].clientX >= rect.x && e.changedTouches[0].clientX <= rect.right && e.changedTouches[0].clientY >= rect.y && e.changedTouches[0].clientY <= rect.bottom){
              fetch(`http://10.5.139.38:3005/devices/moveToDevices?id=${data.id}&component=${name}`)
              .then(res =>{
                  res.text().then(function(data){
                    console.log(data)
                 });
              })
            }
          }
        })

        content.querySelector('#picContainer>img').setAttribute('src', `${data.category}.png`);
        content.querySelector('#picContainer>img').setAttribute('class', `${data.category}`);
        content.querySelector('#title').innerText = data.title;
        content.querySelector('#title').setAttribute('class', `title title_${data.category}`);

        shadow.appendChild(content);
    }
    }

    function showLayer(x, y){
      let str = `position:fixed;left:${x - 10}px; top:${y - 100}px`;
      if (!layerData){
        const p = document.createElement("user-Devices");
        const d = document.createElement("div");
        d.style.cssText = str;
        d.appendChild(p);
        document.body.appendChild(d);
        layerData = {};
        layerData.layerItemMaps = new Map();
        layerData.layer = d;
      } else {
        layerData.layer.style.cssText = str;
      }
    }

    function hideLayer(){
      document.body.removeChild(layerData.layer);
      layerData.layerItemMaps = new Map();
      layerData = null;
    }

    function notifyLayerEvent(type, value, name){
      if (!layerData) return;
      var layerItemMaps = layerData.layerItemMaps;
      if (layerItemMaps){
        Array.from(layerItemMaps.keys()).forEach(key =>{
          var fun = layerItemMaps.get(key);
          if (fun) fun(type, value, name);
        })
      }
    }

    window.customElements.define('user-device', Device);
    window.customElements.define('user-devices', Devices);
    window.click = (ele) =>{
      ele.addEventListener('click', function (e) {
        showLayer(e.clientX, e.clientY);
      });
      document.addEventListener("click", function(e){
        if (e.target !== ele && layerData){
          hideLayer();
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
          if (e.target !== ele && layerData){
            hideLayer();
          }
        })
      }
      window.drag = (ele, name) =>{
        console.log("要拖动" + name)
        ele.addEventListener('touchstart', function (e) {
          if (!model) { // 在没有遮罩的时候创建遮罩
            model = document.createElement('div')
          }
          document.body.appendChild(model)
          showLayer(ele.offsetLeft, ele.offsetTop - 20, name);
          let element = e.targetTouches[0]
          let target = e.target.cloneNode(true) // 拷贝目标元素

          // 记录初始点击位置 client，用于计算移动距离
          source = {start: {}};
          source.client = {
            x: element.clientX,
            y: element.clientY
          }

          // 算出目标元素的固定位置
          let disX = source.start.left = element.target.getBoundingClientRect().left
          let disY = source.start.top = element.target.getBoundingClientRect().top

          model.style.cssText = `position: fixed; left: ${disX}px; top: ${disY}px; z-index: 999; opacity: 0.5; pointer-events: none;`

          // 将拷贝的元素放到遮罩中
          model.appendChild(target);
          dragTarget = target;
          notifyLayerEvent("touchstart", e, name);
        })

        ele.addEventListener('touchmove', function (e) {
            let element = e.targetTouches[0]

            // 根据初始点击位置 client 计算移动距离
            let left = source.start.left + element.clientX - source.client.x
            let top = source.start.top + element.clientY - source.client.y

            // 移动当前元素
            model.style.left = `${left}px`
            model.style.top = `${top}px`
            notifyLayerEvent("touchmove", e, name);
        })
        document.addEventListener('touchend', function (e) {
          // 删除遮罩层
          if (source){
            document.body.removeChild(model);
            model.removeChild(dragTarget);
            source = null;
          }
          // 处理结果
          console.log("结束" + name)
          notifyLayerEvent("touchend", e, name);
          setTimeout(hideLayer, 1000);
        })
      }

    //test
    //const p = document.createElement("user-Devices");
    //document.body.appendChild(p);

})();

