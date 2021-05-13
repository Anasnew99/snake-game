
export const getRandomCoordinates = (min_size:number,max_size: number)=>{
    return({
        x: Math.floor(min_size+Math.random()*(max_size - min_size)),
        y: Math.floor(min_size+Math.random()*(max_size - min_size))
    })
}