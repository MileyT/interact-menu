(function a(){
    class Devices extends HTMLElement{
      constructor() {
        super();
        let map = new Map([["pad", "pad.webp"],["phone", "phone.webp"],["pc","pc.webp"]])
        let style = new Map([["pad", "pad"],["phone", "phone"],["pc","pc"]]);
        let data = [{
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
        }]
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
          .components{
            display: flex;
            flex-direction: "row";
            width: 200px;
            background-color: #0F0;
          }
        </style>
        <div id="devices" class="components"/>
      `;
        var shadow = this.attachShadow( { mode: 'closed' } );

        var content = template.content.cloneNode(true);
        data.map(item =>{
          //console.log(JSON.stringify(item));
          const p = document.createElement("user-device");
          p.setAttribute("data", JSON.stringify(item));
          content.querySelector('#devices').appendChild(p);
        })
        shadow.appendChild(content);
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
            width: 100px
          }
          .title{
            width: 100%;
          }
          .phone{
            width: 30px;
            height: auto;
          }
          .title_phone{
            width: 50px;
          }
          .pc{
            width: 50px;
            height: auto
          }
          .pad{
            width: 80px;
            height: auto;
            margin-top: -13px;
            margin-bottom: -17px;
          }
          .components{
            display: flex;
            flex-direction: "row";
            width: 200px;
          }
        </style>
        <div id="container" className="widget">
          <img></img>
          <div>{data.title}</div>
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
        content.querySelector('img').setAttribute('src', data.pic);
        content.querySelector('img').setAttribute('class', `${data.style}`);
        content.querySelector('#container>div').innerText = data.title;
        content.querySelector('#container>div').setAttribute('class', `title title_${data.style}`);

        shadow.appendChild(content);
    }
    }

    window.customElements.define('user-device', Device);
    window.customElements.define('user-devices', Devices);
    window.click = (ele) =>{
      ele.addEventListener('click', function (e) {
        const p = document.createElement("user-Devices");
        const d = document.createElement("div");
        var _x=e.clientX;
        var _y=e.clientY;
        let str = `position:absolute;left:${_x - 10}px; top:${_y - 100}px`;
        d.style.cssText = str;
        d.appendChild(p);
        document.body.appendChild(d);
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
            var div= document.createElement("div");
            div.innerText = "helloworld";
          }, 700)
        })

        ele.addEventListener('touchend', function (e) {
          endTime = +new Date()
          clearTimeout(timer)
          if (endTime - startTime < 700) {
            const p = document.createElement("user-Devices");
            var _x=e.changedTouches[0].pageX;
            var _y=e.changedTouches[0].pageY;
            p.style.cssText =`position:absolute;left:${_x};top:${_y}`;
            document.body.appendChild(p);
          }
        })
      }

    //test
    //const p = document.createElement("user-Devices");
    //document.body.appendChild(p);

})();
