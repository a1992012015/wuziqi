import React from "react";
/*
* 五子棋*/
//棋盘
class Checkerboard extends React.Component {

    componentDidMount(){
        let canvas = document.getElementById('myCanvas');
        let cxt = canvas.getContext('2d');
        //边框
        cxt.moveTo(0,0);
        cxt.lineTo(700,0);
        cxt.lineTo(700,700);
        cxt.lineTo(0,700);
        cxt.lineTo(0,0);
        cxt.stroke();
        //每一排&&每一列
        for (let i = 1;i <= 13;i++){
            let clo = i * 50;
            cxt.moveTo(clo,0);
            cxt.lineTo(clo,700);
            cxt.stroke();
            cxt.moveTo(0,clo);
            cxt.lineTo(700,clo);
            cxt.stroke();
        }
    }

    render(){
        return (
            <canvas id='myCanvas' height='700' width='700'></canvas>
        );
    }
}

//棋子的每一列
function Row(props) {
    let list = props.row.map((v, i) => {
        const name = v.stepNumber !== null && v.xIsNext !== null?`chess ${v.xIsNext?'chess-white':'chess-black'}`:'disappear';
        return (
            <li className='checker-board-col' key={i} onClick={() => props.onClick(props.index, i)}>
                <button  className={name}></button>
            </li>
        );
    });

    return (list);
}

//棋子的每一排
class Piece extends React.Component {
    constructor(props) {
        super(props);
        let arr = new Array();
        for(let i = 0; i < 15; i++) {
            arr[i] = new Array();
            for(let j = 0; j < 15; j++) {
                arr[i][j] = {
                    stepNumber: null,
                    xIsNext: null,
                };
            }
        }
        this.state = {
            arr : arr,
            stepNumber: 1,//步数
            xIsNext: true,//执棋手true为白棋false为黑棋
            flag: false,//赢了还是输了
        }
    }

    goOn(index, item){
        console.log('=========获取输赢=========');
        console.log(this.state.flag);
        if(this.state.flag){
            console.log('游戏结束');
            return;
        }
        if(this.state.arr[index][item].stepNumber !== null && this.state.arr[index][item].xIsNext !== null){
            console.log('重复落子无效');
            return;
        }
        this.state.arr[index][item].stepNumber = this.state.stepNumber;
        this.state.arr[index][item].xIsNext = this.state.xIsNext;
        this.setState({
            arr: this.state.arr,
            xIsNext: !this.state.xIsNext,
        });
        this.state.flag = this.referee(index, item);
        this.setState({
            flag: this.referee(index, item)
        });
        if(this.state.flag){
            let result = this.state.xIsNext?'白棋获胜':'黑棋获胜';
            console.log(result);
        }
        console.log('=========继续落子=========');
    }

    referee(numStr, numEnd, flag = 1, direction = 0) {
        console.log("改变？");
        if(flag > 4)return false;
        let count = 0, //count&&计算有几个连着的
        arr = this.state.arr;
        for(let i = 0; i < 5; i++) {
            let [y,x] = this.direction(numStr, numEnd, i, flag, direction);
            if(x >= 0 && x <= 14 && y >= 0 && y <= 14){
                if(arr[y][x].xIsNext === this.state.xIsNext){
                    count+=1
                }else{
                    break;
                }
            }else{
                break;
            }
        }
        direction = 1;
        for(let i = 1; i < 5; i++) {
            let [y,x] = this.direction(numStr, numEnd, i, flag, direction);//获取周围的坐标
            if(x >= 0 && x <= 14 && y >= 0 && y <= 14){//判断坐标是否合法
                if(arr[y][x].xIsNext === this.state.xIsNext){//判断当前坐标是否是自己的落子
                    count+=1
                }else{
                    break;
                }
            }else{
                break;
            }
        }
        console.log('========计数========');
        let position = null;
        if(flag === 1){
            position = '垂直';
        }else if(flag === 2){
            position = '水平';
        }else if(flag === 3){
            position = '右斜45度';
        }else if(flag === 4){
            position = '左斜135度';
        }
        console.log('========' + position + '========');
        console.log(count);
        if(count >= 5){
            return true;
        }else{
            return this.referee(numStr, numEnd, flag + 1)
        }
    }

    direction(numStr, numEnd, num, accelerator, direction) {
        let str = null;
        switch(accelerator) {
            case 1: //垂直 y变化
                if(direction) {
                    str = [numStr - num, numEnd];
                } else {
                    str = [numStr + num, numEnd];
                }
                break;
            case 2: //水平 x变化
                if(direction) {
                    str = [numStr, numEnd - num];
                } else {
                    str = [numStr, numEnd + num];
                }
                break;
            case 3: //3=45度
                if(direction) {
                    str = [numStr - num, numEnd + num];
                } else {
                    str = [numStr + num, numEnd - num];
                }
                break;
            case 4: //4=135度
                if(direction) {
                    str = [numStr - num, numEnd - num];
                } else {
                    str = [numStr + num, numEnd + num];
                }
                break;
        }
        return str;
    }

    componentWillUpdate(){
        //this.referee();
    }

    render(){
        console.log(this.state.arr);
        return (
            <div style={{overflow: 'hidden',position: 'relative',height: '852px',width: '852px'}}>
                <Checkerboard />
                <ul className='checker-board'>
                    {
                        this.state.arr.map((v, i) => {
                            return (
                                <li className='checker-board-row' key={i}>
                                    <ul>
                                        <Row
                                            index={i}
                                            onClick={(i,a) => this.goOn(i,a)}
                                            row={v}
                                        />
                                    </ul>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Piece;