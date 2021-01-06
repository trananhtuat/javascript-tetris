let board_section = document.querySelector('.board-section')

for (let index = 0; index < 200; index++) {
    let block = `
        <div class="block">
            <div></div>
        </div>
    `
    board_section.innerHTML += block
}