let des = document.getElementById('des').getContext('2d')

let jogadorInimigo = new JogadorInimigo(1300, 325, 120, 100, './img/jogador_inimigo.png')
let jogadorInimigo2 = new JogadorInimigo(1500, 125, 120, 100, './img/jogador_inimigo.png')
let jogadorInimigo3 = new JogadorInimigo(1700, 400, 120, 100, './img/jogador_inimigo.png')
let jogadorInimigo4 = new JogadorInimigo(1700, 400, 120, 100, './img/jogador_inimigo.png')
let jogadorInimigo5 = new JogadorInimigo(1700, 400, 120, 100, './img/jogador_inimigo.png')
let jogadoraAmigo5 = new JogadorInimigo(1700, 400, 120, 100, './img/raio_folego.png')
let jogadoraAmigo6 = new JogadorInimigo(1700, 400, 120, 100, './img/raio_folego.png')

let fundo = new Image()

jogadorInimigo.vel = 7
jogadorInimigo2.vel = 7
jogadorInimigo3.vel = 7
jogadorInimigo4.vel = 7
jogadorInimigo5.vel = 7
jogadoraAmigo5.vel = 5
jogadoraAmigo6.vel = 5

let jogador = new Jogador(100, 325, 110, 110, './img/jogador_001.png')

let t1 = new Text()
let t2 = new Text()
let t3 = new Text()
let fase_txt = new Text()

let motor = new Audio('./img/motor.wav')
let batida = new Audio('./img/batida.mp3')
motor.volume = 0.5
motor.loop = true
batida.volume = 0.5

let jogar = true
let fase = 1

document.addEventListener('keydown', (e) => {
    if (e.repeat) return; 
    
    motor.play();
    
    if (e.key === 'w' || e.key === 'ArrowUp') {
        jogador.dir = -7;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        jogador.dir = 7; 
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
}

function ver_fase() { 
    if (jogador.pontos > 5 && fase === 1) {
        fase = 2
        jogadorInimigo.vel = 9
        jogadorInimigo2.vel = 9
        jogadorInimigo3.vel = 9
        jogadorInimigo4.vel = 9
        jogadorInimigo5.vel = 9
        jogadoraAmigo5.vel = 6
        jogadoraAmigo6.vel = 6
    } else if (jogador.pontos > 15 && fase === 2) {
        fase = 3
        jogadorInimigo.vel = 11
        jogadorInimigo2.vel = 11
        jogadorInimigo3.vel = 11
        jogadorInimigo4.vel = 11
        jogadorInimigo5.vel = 11
        jogadoraAmigo5.vel = 8
        jogadoraAmigo6.vel = 8
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
    if (jogador.colid(jogadoraAmigo5)) {
        batida.play()
        jogadoraAmigo5.recomeca()
        if(jogador.vida < 5){
            jogador.vida += 1
        }
        return;
    }
    if (jogador.colid(jogadoraAmigo6)) {
        batida.play()
        jogadoraAmigo6.recomeca()
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
        jogadoraAmigo5.des_jogador()
        jogadoraAmigo6.des_jogador()
        jogador.des_jogador()
        
        
        t1.des_text('Gols: ' + jogador.pontos, 1000, 40, 'yellow', '26px Arial')
        
        // --- LOGICA DOS RAIOS AQUI ---
        let raios = "⚡".repeat(jogador.vida); 
        t2.des_text('Fôlego: ' + raios, 40, 40, 'red', '26px Arial')
        // -----------------------------
        if(fase === 1){
            fase_txt.des_text('Jogador Várzea' +  550, 40, 'white', '26px Arial')
        }else if(fase === 2){
            fase_txt.des_text('Promessa Futsal' + 550, 40, 'white', '26px Arial')
        }else if(fase === 3){
            fase_txt.des_text('Profissional Futebol' + 550, 40, 'white', '26px Arial')
        }   
    } else {
        t1.des_text('GAME OVER', 450, 350, 'yellow', '60px Arial')
        t2.des_text('Pontuação Final: ' + jogador.pontos, 480, 400, 'white', '25px Arial')
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
        jogadoraAmigo5.mov_jogador()
        jogadoraAmigo6.mov_jogador()
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