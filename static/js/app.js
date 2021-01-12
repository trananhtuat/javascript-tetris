let board = document.querySelector('.board-section')

for (let i = 0; i < 200; i++) {
    let block = '<div class="block"></div>'
    board.innerHTML += block
}

falls = () => {
    let fall_count = 50

    let container = document.querySelector('.container')

    for (let i = 0; i < fall_count; i++) {
        
        let img_index = Math.floor(Math.random() * 6) + 1

        let x = Math.floor(Math.random() * window.innerWidth)
        let y = Math.floor(Math.random() * window.innerHeight)

        let size = Math.random() * 40

        let duration = Math.random() * 70 + 30

        let img = document.createElement('img')

        img.className = 'fall'
        img.src = 'static/assets/images/' + img_index + '.png'

        img.style.width = 1 + size + 'px'
        img.style.height = 'auto'

        img.style.left = x + 'px'
        img.style.bottom = y + 'px'

        img.style.animationDuration = 2 + duration + 's'
        img.style.animationDelay = -duration + 's'

        container.appendChild(img)
        
    }
}

falls()

let loading_square = document.querySelector('.square')

for (let i = 0; i < 16; i++) {
    loading_square.innerHTML += '<div></div>'
}