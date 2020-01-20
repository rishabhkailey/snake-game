console.log('inside game');

// document.body.appendChild('<h1>Welcome</h1>')

let game = []

let rows = 20,cols = 20

for(let i=0;i<rows;i++)
{
    let list = []
    for(let j=0;j<cols;j++)
    {
        list.push({value: false,move: 'none'})
    }
    game.push(list)
}

let displayGame = document.createElement('div')

game.forEach((row)=>{

    let displayRow = document.createElement('div')
    displayRow.className = 'row'

    row.forEach((element)=>{
        
        let block = document.createElement('div')
        block.className = 'block'
        displayRow.appendChild(block)

    })

    displayGame.appendChild(displayRow)
})
document.body.appendChild(displayGame)


let move = 'down'

snake = {
    head: {x:0,y:3},
    tail: {x:0,y:0},
    position: [
        {x:0,y:0},
        {x:0,y:1},
        {x:0,y:2},
        {x:0,y:3}
    ]
}

let blocks = document.getElementsByClassName('block');

function hidePos(pos){
    let {x,y} = pos;
    blocks[x*cols + y].style.backgroundColor = 'white'
}

function displayPos(pos){
    let {x,y} = pos
    blocks[x*cols + y].style.backgroundColor = 'black'
}

getNewPosition = (pos)=>{
    
    let {x,y} = pos
    let {move} = game[x][y]
    game[x][y].value = false


    if(move === 'right'){
        y = y+1;
    }
    else if(move === 'left'){
        y = y-1;
    }
    else if(move === 'up')
    {
        x = x-1;
    }
    else if(move === 'down'){
        x = x+1;
    }
    
    return {x,y}
}


displaySnakePosition = (snake)=>{
    snake.position.forEach((pos)=>{
        displayPos(pos)
    })
}

initialiseGame = ()=>{
    snake.position.forEach((pos)=>{
        let {x,y} = pos;
        game[x][y].value = true
        game[x][y].move = 'right'
    })
}

initialiseGame()

displaySnakePosition(snake)

updateSnakePosition = ()=>{
    
    hidePos(snake.tail)

    console.log('before',snake)

    // update move at head
    let {x,y} = snake.head
    game[x][y].move = move

    let new_pos = []

    snake.position.forEach((pos)=>{

        new_pos.push(getNewPosition(pos))

    })

    snake.position = new_pos;

    //update tail and head

    snake.tail = getNewPosition(snake.tail)
    snake.head = getNewPosition(snake.head)

    console.log('after',snake)
    
    displaySnakePosition(snake)
}

// setInterval(console.log('ha'),1000)
setInterval(function(){ updateSnakePosition() }, 3000);

updateSnakePosition()