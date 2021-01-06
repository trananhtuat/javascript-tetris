let board_section = document.querySelector('.board-section')

for (let index = 0; index < 200; index++) {
    let block = `
        <div class="block">
            <div></div>
        </div>
    `
    board_section.innerHTML += block
}

falls = () => {
	let fall_count = 50

	let container = document.querySelector('.container')

	let i = 0

	while (i < fall_count) {

		let img_index = Math.floor(Math.random() * 7) + 1;

		let x = Math.floor(Math.random() * window.innerWidth)

		let y = Math.floor(Math.random() * window.innerHeight)

		let size = Math.random() * 40
		let duration = Math.random() * 70

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

		i++
	}
}

falls()

