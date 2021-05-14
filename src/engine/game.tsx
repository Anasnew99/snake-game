import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import Board from '../components/board';
import { Coordinates } from '../interfaces/GeneralInterfaces';
import { getRandomCoordinates } from './gameFunctions';
interface GameProps {
    play: boolean,
    onGameOver: (score: number) => void,
    initialGameSpeed?: number,
    onGameClose: () => void
}

interface GameSounds{
    background?: HTMLAudioElement,
    onEat: HTMLAudioElement,
    onGameOver: HTMLAudioElement,
    onDirectionChange: HTMLAudioElement
}

const GRID_SIZE = 20;

const Game: FC<GameProps> = (props) => {
    const sounds = useRef<null|GameSounds>(null);
    const { onGameOver, play, initialGameSpeed, onGameClose } = props;
    const direction = useRef({ x: 1, y: 0 });
    const lastRenderTime = useRef(0);
    const speed = useRef(initialGameSpeed || 2);
    const animFrameId = useRef<null | number>(null);
    const boardRef = useRef<null | HTMLDivElement>(null);
    const currStart = useRef<null | Coordinates>(null);

    const [food, setFood] = useState(getRandomCoordinates(3, GRID_SIZE));
    const [score, setScore] = useState(0);
    const [dimension, setDimension] = useState(0);
    const [parts, setParts] = useState<Array<Coordinates>>([{ x: 1, y: 1 }]);

    useEffect(() => {
        const adjustBoardSize = () => {
            if (boardRef.current) {
                const { height, width } = boardRef.current.getBoundingClientRect();
                setDimension(Math.min(height, width));
            }
        }
        adjustBoardSize();
        window.addEventListener('resize', adjustBoardSize);
        sounds.current = {
            onEat: new Audio(require('../assets/sounds/on-eat.wav').default),
            onDirectionChange: new Audio(require('../assets/sounds/on-dir-change.wav').default),
            onGameOver: new Audio(require('../assets/sounds/on-game-over.wav').default)
        }
        return () => {
            window.removeEventListener('resize', adjustBoardSize);
        }
    }, []);
    const onKeyPress = useCallback(
        (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction.current.x !== 0) {
                        direction.current = { x: 0, y: -1 };
                        sounds.current?.onDirectionChange.play();
                    }
                    break;
                case 'ArrowDown':
                    if (direction.current.x !== 0) {
                        direction.current = { x: 0, y: 1 };
                        sounds.current?.onDirectionChange.play();

                    }
                    break;
                case 'ArrowRight':
                    if (direction.current.y !== 0) {
                        direction.current = { x: 1, y: 0 };
                        sounds.current?.onDirectionChange.play();

                    }
                    break;
                case 'ArrowLeft':
                    if (direction.current.y !== 0) {
                        direction.current = { x: -1, y: 0 };
                        sounds.current?.onDirectionChange.play();
                    }
                    break;
                default: return;
            }

        }, []);


    const moveSnake = useCallback(() => {
        setParts((parts) => {
            let snakeParts = [...parts];
            for (let i = snakeParts.length - 2; i >= 0; i--) {
                snakeParts[i + 1] = { ...snakeParts[i] };
            }
            snakeParts[0] = {
                x: snakeParts[0].x + direction.current.x,
                y: snakeParts[0].y + direction.current.y
            }
            return snakeParts;
        });
    }, []);

    const gameLoop = useCallback((currTime: number) => {
        animFrameId.current = window.requestAnimationFrame(gameLoop);
        if ((currTime - lastRenderTime.current) / 1000 < (1 / speed.current)) return;
        moveSnake();
        lastRenderTime.current = currTime;
    }, [moveSnake]);

    useEffect(() => {
        if (play) {
            if (animFrameId.current === null) {
                window.addEventListener('keydown', onKeyPress);
                window.requestAnimationFrame(gameLoop);
            }
        } else {
            if (animFrameId.current) {
                window.removeEventListener('keydown', onKeyPress);
                window.cancelAnimationFrame(animFrameId.current);
                animFrameId.current = null;
            }
        }
        return () => {
            if (animFrameId.current) {
                window.removeEventListener('keydown', onKeyPress);
                window.cancelAnimationFrame(animFrameId.current);
                animFrameId.current = null;
            }

        }
    }, [play, onKeyPress, animFrameId, moveSnake, gameLoop]);


    const isCollided = () => {
        const head = parts[0];
        if (head.x > GRID_SIZE || head.x <= 0 || head.y > GRID_SIZE || head.y <= 0) {
            return true;
        } else {
            for (let i = 1; i <= parts.length - 1; i++) {
                if (head.x === parts[i].x && head.y === parts[i].y) return true;
            }
        }
        return false;
    }

    const isFoodEaten = () => {
        return (
            parts[0].x === food.x && parts[0].y === food.y
        );
    }

    if (isCollided()) {
        onGameOver(score);
        sounds.current?.onGameOver.play();
    }



    if (isFoodEaten()) {
        speed.current += .25;
        // new Audio(require('../assets/sounds/on-eat.wav')).play();
        setFood(getRandomCoordinates(2, GRID_SIZE));
        setScore(score => score + 1);
        sounds.current?.onEat.play();
        isFoodEaten.current = true;
        let newParts = [
            {
                x: parts[0].x + direction.current.x,
                y: parts[0].y + direction.current.y
            },
            ...parts
        ];
        setParts(newParts);
    }

    const handleTouchStart = (e: React.TouchEvent)=>{
        if(!props.play) return;
        if((currStart.current===null) && e.touches.length === 1){
            e.preventDefault();
            e.stopPropagation();
            currStart.current = { x: e.nativeEvent.touches[0].clientX , y: e.nativeEvent.touches[0].clientY}
        }
    }

    const handleTouchEnd = (e: React.TouchEvent)=>{
        if(!props.play) return ;
        if((currStart.current !== null) && e.nativeEvent.changedTouches.length === 1){
            e.preventDefault();
            e.stopPropagation();
            const  finalTouchPositon = {x: e.nativeEvent.changedTouches[0].clientX, y: e.nativeEvent.changedTouches[0].clientY};
            const diffX = finalTouchPositon.x - currStart.current.x , diffY = finalTouchPositon.y - currStart.current.y;
            if(Math.abs(diffY) > Math.abs(diffX)){
                if (direction.current.x !== 0) {
                    if(diffY < 0){
                        direction.current = { x: 0, y: -1 };
                        sounds.current?.onDirectionChange.play();
                    }else{
                        direction.current = { x: 0, y: +1 };
                        sounds.current?.onDirectionChange.play(); 
                        
                    }
                    
                }
                
            }else{
                if(direction.current.y !== 0){
                    if(diffX > 0){
                        direction.current = { x: 1, y: 0 };
                        sounds.current?.onDirectionChange.play();
                    }else{
                        direction.current = { x: -1, y: 0 };
                        sounds.current?.onDirectionChange.play();
                    }
                }
            }

            currStart.current = null;
        }
        
    }


    return (
        <div className={'g-b-container'} >
            <div className={'g-b-container__close'}>
                <button className={'close-button rounded-btn'} onClick={onGameClose}> X </button>
            </div>
            <div className={'g-b-container__board'} ref={boardRef} onTouchStart = {handleTouchStart} onTouchEnd = {handleTouchEnd} >
                <Board
                    width={dimension}
                    height={dimension}
                    gridSize={GRID_SIZE}
                    snakeFood={food}
                    snakeParts={parts}
                />
            </div>
            
            <div className={'g-b-container__score'}>
                <p>Score : {score}</p>
            </div>
        </div>
    );
}

export default Game;