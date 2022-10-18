import React, { useRef, useState } from 'react';
import './App.css';

export class Components extends React.Component{
    componentDidMount(){
    }
    render(){
        let data = this.props.data;
        return <div className="components" >
            {data.map(item =>{
                return <Widget data={item}/>
            })}
        </div>
    }
}

export class Widget extends React.Component{
    componentDidMount(){
    }
    render(){
        let data = this.props.data;
        return <div className="widget" onClick={() => {
            this.props.onClick(data);
        }}>
            <img ref={(node) => this.myRef = node} className={`${data.style}`} src={data.pic}></img>
            <div className={`title title_${data.style}`}>{data.title}</div>
        </div>
    }
}