class SankeGame {
    constructor() {
        this.updateSnakePosition = this.updateSnakePosition.bind(this)
    }
    game = []
    rows = 20
    cols = 20
    snake = null
    move = null
    blocks = null
    movement = null
    target = {x: 19,y:19}
    displayGame() {
        for(let i=0 ; i<this.rows ; i++)
        {
            let list = []
            for(let j=0 ; j<this.cols ; j++)
            {
                list.push({value: false,move: 'none'})
            }
            this.game.push(list)        
        }

        let displayGame = document.createElement('div')
        this.game.forEach((row)=>{
            let displayRow = document.createElement('div')
            displayRow.className = 'row'

            row.forEach(()=>{
                
                let block = document.createElement('div')
                block.className = 'block'
                displayRow.appendChild(block)

            })

            displayGame.appendChild(displayRow)
        })
        displayGame.style.border = '1px solid black'
        displayGame.style.width = '403px'
        document.body.appendChild(displayGame)
    
        this.blocks = document.getElementsByClassName('block');
    }

    
    initialiseSnake = ()=>{
        this.snake = {
            head: {x:0,y:4},
            tail: {x:0,y:0},
            position: [
                {x:0,y:0},
                {x:0,y:1},
                {x:0,y:2},
                {x:0,y:3},
                {x:0,y:4}
            ]
        }
    }
        
    hidePos(pos){
        let {x,y} = pos;
        this.game[x][y].value = false
        // this.game[x][y].move = null
        this.blocks[x*this.cols + y].style.backgroundColor = 'white'
    }

    displayPos(pos,color){
        let {x,y} = pos
        if(!color || color === 'black') {
            //snake position
            color = 'black'
            // this.game[x][y].value = true
        }
        this.blocks[x*this.cols + y].style.backgroundColor = color
    }

    
    getNewPosition = (pos)=>{
        
        let {x,y} = pos
        let {move} = this.game[x][y]


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

    getPrevPosition = (pos)=>{
        
        let {x,y} = pos
        let {move} = this.game[x][y]


        if(move === 'right'){
            y = y-1;
        }
        else if(move === 'left'){
            y = y+1;
        }
        else if(move === 'up')
        {
            x = x+1;
        }
        else if(move === 'down'){
            x = x-1;
        }
        
        return {x,y}
    }
    
    displaySnakePosition = ()=>{
        this.snake.position.forEach((pos)=>{
            this.game[pos.x][pos.y].value = true
            this.displayPos(pos)
        })
    }

    // reseting snake position   
    hideSnakePosition = (snake)=>{
        
        snake.position.forEach((pos)=>{
            // displayPos(pos)
            this.hidePos(pos)
        })
        this.hidePos(this.target)
    }
    startMovement = ()=>{
        const fxn = this.updateSnakePosition
        this.movement = setInterval(()=>{fxn()}, 100);
    }
    startGame = ()=>{
        this.initialiseSnake()
        this.snake.position.forEach((pos)=>{
            let {x,y} = pos;
            this.game[x][y].value = true
            this.game[x][y].move = 'right'
        })
        this.move = null
        this.displaySnakePosition()
        this.startMovement()
        this.generateTarget()
    }
    generateTarget() {
        let x , y
        while(true) {
            x = parseInt(Math.random()*100)%20
            let available_ys = []
            for(let i=0 ; i<this.cols ; i++) {
                if(!this.game[x][i].value) {
                    available_ys.push(i)
                }
            }
            console.log(this.game[x],available_ys)
            if(available_ys.length != 0) {
                y = parseInt(Math.random()*100)%available_ys.length
                break
            }
        }
        this.target = {x,y}
        this.showTarget();
    }
    showTarget() {
        this.displayPos(this.target,'red')
    }
    gameover = ()=>{
        clearInterval(this.movement)
        this.hideSnakePosition(this.snake)
        alert('game over')
        this.startGame()
    }
    
    checkValidMove = ()=>{
        
        // console.log('check valid move')

        // new position of head
        let {x,y} = this.getNewPosition(this.snake.head);
        

        if(x >= this.rows || x < 0 || y >= this.cols || y < 0){
            this.gameover()
            return false
        }

        if(this.game[x][y].value === true){
            this.gameover()
            return false
        }

        return true

    }
    
    updateSnakePosition = ()=>{
        
        if(!this.move)
            return
        
        // let old_tail = this.snake.tail
        // console.log('before',snake)


        // update move at head
        let {x,y} = this.snake.head
        this.game[x][y].move = this.move


        if(!this.checkValidMove())
            return
        
        
        this.hidePos(this.snake.tail)

        let new_pos = []

        this.snake.position.forEach((pos)=>{

            // console.log('updating game')


            let new_ = this.getNewPosition(pos)

            // game[new_.x][new_.y].value = true

            new_pos.push(new_)

            // console.log('updated position',new_.x,new_.y)
        })
        
        this.snake.position = new_pos;

        let old_tail = this.snake.tail
        let old_tail_move = this.game[old_tail.x][old_tail.y].move
        
        //update tail and head
        this.snake.tail = this.getNewPosition(this.snake.tail)
        this.snake.head = this.getNewPosition(this.snake.head)
        
        // pehla ta nhhi kita kyu ki hidepos ch move = null so new position of tail = problem
        // and consume target also uses move of tail
     

        console.log(old_tail,old_tail_move)
        // console.log('after',snake)
        
        this.displaySnakePosition()
        
        // x,y = tail
        if(x == this.target.x && y == this.target.y) {
            console.log('target consumed',this.target)
            this.consumeTarget(old_tail,old_tail_move)
        }
    }

    consumeTarget(old_tail,old_tail_move) {
        // get previous position of tail and make that tail and append that in snake.positoins
        // let tail = this.snake.tail
        // let {x,y} = this.getPrevPosition(tail)
        
        // this.game[x][y].move = this.game[tail.x][tail.y].move
        // this.snake.tail = {x,y}
        // this.snake.position.push({x,y})
        // this.generateTarget()
        console.log(old_tail_move)
        this.snake.tail = old_tail
        this.snake.position.push(old_tail)
        this.game[old_tail.x][old_tail.y].move = old_tail_move
        console.log(this.game[old_tail.x][old_tail.y])
        this.generateTarget()
    }

}

const gameObject = new SankeGame()
gameObject.displayGame()
gameObject.startGame()

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        gameObject.move = 'up'
    }
    else if (e.keyCode == '40') {
        // down arrow
        gameObject.move = 'down'
    }
    else if (e.keyCode == '37') {
       // left arrow
       gameObject.move = 'left'
    }
    else if (e.keyCode == '39') {
       // right arrow
       gameObject.move = 'right'
    }

}


// setInterval(console.log('ha'),1000)

// updateSnakePosition()