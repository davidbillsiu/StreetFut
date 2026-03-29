let des = document.getElementById('des').getContext('2d')

let jogadorInimigo = new JogadorInimigo(1300, 325, 125, 105, './img/jogador_inimigo.png')
let jogadorInimigo2 = new JogadorInimigo(1500, 125, 125, 105, './img/jogador_inimigo.png')
let jogadorInimigo3 = new JogadorInimigo(1700, 400, 125, 105, './img/jogador_inimigo.png')
let jogadorInimigo4 = new JogadorInimigo(1700, 400, 125, 105, './img/jogador_inimigo.png')
let jogadorInimigo5 = new JogadorInimigo(1700, 400, 125, 105, './img/jogador_inimigo.png')
let jogadorInimigo6 = new JogadorInimigo(1700, 400, 125, 105, './img/jogador_inimigo.png')
let jogadoraAmigo5 = new JogadorInimigo(1700, 400, 95, 100, './img/raio_img.png')
let jogadoraAmigo6 = new JogadorInimigo(1700, 400, 95, 100, './img/raio_img.png')
let jogadoraAmigo7 = new JogadorInimigo(1700, 400, 95, 100, './img/raio_img.png')

let fundo = new Image()

jogadorInimigo.vel = 8
jogadorInimigo2.vel = 8
jogadorInimigo3.vel = 8
jogadorInimigo4.vel = 8
jogadorInimigo5.vel = 8
jogadorInimigo6.vel = 8
jogadoraAmigo5.vel = 6
jogadoraAmigo6.vel = 6
jogadoraAmigo7.vel = 6

let jogador = new Jogador(100, 325, 112, 112, './img/jogador_001.png')

let t1 = new Text()
let t2 = new Text()
let t3 = new Text()
let fase_txt = new Text()

let motor = new Audio('./img/youNever.mp3')
let batida = new Audio('./img/juiz_apito.m4a')
motor.volume = 0.5
motor.loop = true
batida.volume = 0.5

let jogar = true
let fase = 1
let ganhou = false

document.getElementById('des').addEventListener('click', (e) => {
    if (jogar) return

    let rect = document.getElementById('des').getBoundingClientRect()
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top

    // jogar novamente (tanto no game over quanto no venceu)
    if (mouseX >= 120 && mouseX <= 470 && mouseY >= 500 && mouseY <= 670) {
        window.location.href = './street_fut.html'
    }

    // menu (tanto no game over quanto no venceu)
    if (mouseX >= 700 && mouseX <= 1020 && mouseY >= 500 && mouseY <= 650) {
        window.location.href = './index.html'
    }
})

document.addEventListener('keydown', (e) => {
    if (e.repeat) return; 
    
    motor.play();
    
    if (e.key === 'w' || e.key === 'ArrowUp') {
        jogador.dir = -11;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        jogador.dir = 11; 
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'ArrowDown') {
        jogador.dir = 0;
    }
});

function game_over() {
    if (jogador.vida <= 0) {
        jogar = false
        motor.pause()
    }
    if (jogador.pontos >= 600) {
        ganhou = true
        jogar = false
        motor.pause()
    }
}

function ver_fase() { 
    if (jogador.pontos > 50 && fase === 1) {
        fase = 2
        jogadorInimigo.vel = 10
        jogadorInimigo2.vel = 10
        jogadorInimigo3.vel = 10
        jogadorInimigo4.vel = 10
        jogadorInimigo5.vel = 10
        jogadorInimigo6.vel = 10
        jogadoraAmigo5.vel = 7
        jogadoraAmigo6.vel = 7
        jogadoraAmigo7.vel = 7
    } else if (jogador.pontos > 140 && fase === 2) {
        fase = 3
        jogadorInimigo.vel = 12
        jogadorInimigo2.vel = 12
        jogadorInimigo3.vel = 12
        jogadorInimigo4.vel = 12
        jogadorInimigo5.vel = 12
        jogadorInimigo6.vel = 12
        jogadoraAmigo5.vel = 8
        jogadoraAmigo6.vel = 8
        jogadoraAmigo7.vel = 8
    }
}

function colisao() {
    if (jogador.colid(jogadorInimigo)) {
        batida.play()
        jogadorInimigo.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadorInimigo2)) {
        batida.play()
        jogadorInimigo2.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadorInimigo3)) {
        batida.play()
        jogadorInimigo3.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadorInimigo4)) {
        batida.play()
        jogadorInimigo4.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadorInimigo5)) {
        batida.play()
        jogadorInimigo5.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadorInimigo6)) {
        batida.play()
        jogadorInimigo6.recomeca()
        jogador.vida -= 1
        return;
    }
    if (jogador.colid(jogadoraAmigo5)) {
        jogador.pontos += 1
        jogadoraAmigo5.recomeca()
        if(jogador.vida < 5){
            jogador.vida += 1
        }
        return;
    }
    if (jogador.colid(jogadoraAmigo6)) {
        jogador.pontos += 1
        jogadoraAmigo6.recomeca()
        if(jogador.vida < 5){
            jogador.vida += 1
        }
        return;
    }
    if (jogador.colid(jogadoraAmigo7)) {
        jogador.pontos += 1
        jogadoraAmigo7.recomeca()
        if(jogador.vida < 5){
            jogador.vida += 1
        }
        return;
    }
    console.log('vida: ', jogador.vida)
}

function pontuacao() {
    if (jogador.point(jogadorInimigo)) {
        jogador.pontos += 1
        jogadorInimigo.recomeca()
    }
    if (jogador.point(jogadorInimigo2)) {
        jogador.pontos += 1
        jogadorInimigo2.recomeca()
    }
    if (jogador.point(jogadorInimigo3)) {
        jogador.pontos += 1
        jogadorInimigo3.recomeca()
    }
    if (jogador.point(jogadorInimigo4)) {
        jogador.pontos += 1
        jogadorInimigo4.recomeca()
    }
    if (jogador.point(jogadorInimigo5)) {
        jogador.pontos += 1
        jogadorInimigo5.recomeca()
    }
    if (jogador.point(jogadorInimigo6)) {
        jogador.pontos += 1
        jogadorInimigo6.recomeca()
    }
}


function desenha() {
    // Define o fundo de acordo com a fase
if (fase === 1) {
    fundo.src = './img/campo_areia.png'
} else if (fase === 2) {
    fundo.src = './img/quadra.png'
} else if (fase === 3) {
    fundo.src = './img/campo.png'
}

// Desenha o fundo
des.drawImage(fundo, 0, 0, 1200, 700)

    if (jogar) {    
        jogadorInimigo.des_jogador()
        jogadorInimigo2.des_jogador()
        jogadorInimigo3.des_jogador()
        jogadorInimigo4.des_jogador()
        jogadorInimigo5.des_jogador()
        jogadorInimigo6.des_jogador()
        jogadoraAmigo5.des_jogador()
        jogadoraAmigo6.des_jogador()
        jogadoraAmigo7.des_jogador()
        jogador.des_jogador()
        
        t1.des_placar_com_logo(
        jogador.pontos,1000,20,'#2AA8E6','bold 30px Impact, Verdana','./img/gols.png'
    );
        // --- LOGICA DOS RAIOS AQUI ---
         for (let i = 0; i < jogador.vida; i++) {
            t2.des_imagem('./img/raio_img.png', 40 + (i * 40), 10, 35, 35)
        } 

        // imagem da fase
        if (fase === 1) {
            fase_txt.des_imagem('./img/jogador_varzea.png', 510, -50, 200, 170)
        } else if (fase === 2) {
            fase_txt.des_imagem('./img/promessa_futsal.png', 510, -50, 200, 170)
        } else if (fase === 3) {
            fase_txt.des_imagem('./img/jogador_profissional.png', 510, -50, 200, 170)
        }

    } else if (ganhou) {
    // tela de vitória
    t1.des_imagem('./img/venceu.png', 260, 150, 700, 350)
    t2.des_text('Gols Feitos: ' + jogador.pontos, 490, 100, '#2AA8E6', 'bold 30px Impact, Verdana')
    t1.des_imagem('./img/jogar_novamente.png', 120, 500, 350, 170)
    t1.des_imagem('./img/menu.png', 700, 500, 320, 150)

} else {
    // tela de game over
    t1.des_imagem('./img/game_over.png', 260, 150, 700, 350)
    t2.des_text('Gols Feitos: ' + jogador.pontos, 490, 100, '#2AA8E6', 'bold 30px Impact, Verdana')
    t1.des_imagem('./img/jogar_novamente.png', 120, 500, 350, 170)
    t1.des_imagem('./img/menu.png', 700, 500, 320, 150)
}
}

function atualiza() {
    if (jogar) {
        jogador.mov_jogador()
        jogador.anim('jogador_00')
        jogadorInimigo.mov_jogador()
        jogadorInimigo2.mov_jogador()
        jogadorInimigo3.mov_jogador()
        jogadorInimigo4.mov_jogador()
        jogadorInimigo5.mov_jogador()
        jogadorInimigo6.mov_jogador()
        jogadoraAmigo5.mov_jogador()
        jogadoraAmigo6.mov_jogador()
        jogadoraAmigo7.mov_jogador()
        colisao()
        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()