import logo from './logo.svg';
import './App.css';
import pad from '../src/images/pad.webp';
import phone from '../src/images/phone.webp';
import pc from '../src/images/pc.webp';
import { useEffect } from 'react';
import { Components } from './components';
let map = new Map([["pad", pad],["phone", phone],["pc",pc]])
let style = new Map([["pad", "pad"],["phone", "phone"],["pc","pc"]])
function App() {
  return (
    <div className="App">
      <Components data={[{
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
      }]}/>
    </div>
  );
}

function useLongPress(ele){
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

  ele.addEventListener('touchend', function () {
    endTime = +new Date()
    clearTimeout(timer)
    if (endTime - startTime < 700) {

    }
  })

}

export default App;
