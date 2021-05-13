import React, { FC } from 'react';
import { Coordinates } from '../interfaces/GeneralInterfaces';

interface BoardProps{
    width: string | number,
    height: string | number
    gridSize: number,
    snakeParts: Array<Coordinates>,
    snakeFood: Coordinates
}

const Board:FC<BoardProps> = (props)=>{

    return (
    // Board Container
    <div
        className={'board'}
        style={{
            width: props.width,
            height: props.height,
            gridTemplateColumns:`repeat(${props.gridSize}, 1fr)` ,
            gridTemplateRows:`repeat(${props.gridSize}, 1fr)` 
        }}
    >


        {/* Snake Parts  */}
        {props.snakeParts.map((coords,index)=>{
            return <div
                key={index}
                className= {index===0?'board-snake__head':'board-snake__part'}
                style={{
                    gridRowStart: coords.y,
                    gridColumnStart: coords.x
                }}
            >
            </div>
        })}

        {/* Snake Food  */}
        <div className={'board-snake__food'}
            style={{
                gridRowStart: props.snakeFood.y,
                gridColumnStart: props.snakeFood.x
            }}
        >

        </div>
    </div>);
}

export default Board;