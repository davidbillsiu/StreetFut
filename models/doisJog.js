const LARGURA = 1200
const ALTURA = 700
const PONTOS_MAX = 7

const IMGS = {}

function carregarImagens(lista, callback) {
    let total = lista.length
    let carregadas = 0

    lista.forEach(({ nome, src }) => {
        const img = new Image()
        img.onload = () => { carregadas++; if (carregadas === total) callback() }
        img.onerror = () => { carregadas++; if (carregadas === total) callback() }
        img.src = src
        IMGS[nome] = img
    })
}

class ObjBase {
    constructor(x, y, w, h, nomeImg) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.nomeImg = nomeImg
    }

    desenha() {
        const img = IMGS[this.nomeImg]
        if (img && img.complete) {
            des.drawImage(img, this.x, this.y, this.w, this.h)
        } else {
            des.fillStyle = '#fff'
            des.fillRect(this.x, this.y, this.w, this.h)
        }
    }
}

class Jogador extends ObjBase {
    constructor(x, y, w, h, nomeImg) {
        super(x, y, w, h, nomeImg)
        this.vel = 0
        this.pontos = 0
    }

    mover() {
        this.y += this.vel

        if (this.y < 0) this.y = 0
        if (this.y + this.h > ALTURA) this.y = ALTURA - this.h
    }
}

class Bola extends ObjBase {
    constructor() {
        super(LARGURA / 2 - 30, ALTURA / 2 - 30, 60, 60, 'bola')
        this.velX = 0
        this.velY = 0
        this.gol = false
    }

    lancar() {
        this.velX = (Math.random() > 0.5 ? 1 : -1) * 6
        this.velY = (Math.random() * 4 - 2)
        this.gol = false
    }

   mover() {
    this.x += this.velX
    this.y += this.velY

    if (this.y <= 0) {
        this.y = 0           // ✅ Gruda na borda superior
        this.velY *= -1
    }

    if (this.y + this.h >= ALTURA) {
        this.y = ALTURA - this.h  // ✅ Gruda na borda inferior
        this.velY *= -1
    }
}

    resetar() {
        this.x = LARGURA / 2 - 30
        this.y = ALTURA / 2 - 30
        this.velX = 0
        this.velY = 0
        this.gol = false
    }
}

// =============================================

const des = document.getElementById('des').getContext('2d')

let jog1, jog2, bola
let teclas = {}

// =============================================

function iniciar() {
    jog1 = new Jogador(50, 300, 130, 130, 'jog1')
    jog2 = new Jogador(1100, 300, 130, 130, 'jog2')
    bola = new Bola()

    bola.lancar()

    document.addEventListener('keydown', e => teclas[e.key] = true)
    document.addEventListener('keyup', e => teclas[e.key] = false)

    loop()
}

// =============================================
// CONTROLES
// =============================================

function controles() {
    jog1.vel = 0
    jog2.vel = 0

    if (teclas['w'] || teclas['W']) jog1.vel = -8
    if (teclas['s'] || teclas['S']) jog1.vel = 8

    if (teclas['ArrowUp']) jog2.vel = -8
    if (teclas['ArrowDown']) jog2.vel = 8
}

// =============================================
// COLISÃO COM VELOCIDADE PROGRESSIVA
// =============================================

function colisao(bola, jogador) {
    const bolaEsq = bola.x
    const bolaDirE = bola.x + bola.w
    const bolaTopo = bola.y
    const bolaBase = bola.y + bola.h

    const jogEsq = jogador.x
    const jogDir = jogador.x + jogador.w
    const jogTopo = jogador.y
    const jogBase = jogador.y + jogador.h

    const colidiu =
        bolaDirE > jogEsq &&
        bolaEsq < jogDir &&
        bolaBase > jogTopo &&
        bolaTopo < jogBase

    if (!colidiu) return

    // Calcula sobreposição em cada lado
    const overlapEsq = bolaDirE - jogEsq   // bola vindo da esquerda
    const overlapDir = jogDir - bolaEsq    // bola vindo da direita
    const overlapTopo = bolaBase - jogTopo // bola vindo de cima
    const overlapBase = jogBase - bolaTopo // bola vindo de baixo

    const menorH = Math.min(overlapEsq, overlapDir)
    const menorV = Math.min(overlapTopo, overlapBase)

    const AUMENTO = 1
    const VELOCIDADE_MAX = 15

    let velocidade = Math.sqrt(bola.velX ** 2 + bola.velY ** 2)
    velocidade = Math.min(velocidade + AUMENTO, VELOCIDADE_MAX)

    if (menorH < menorV) {
        // Colisão lateral
        let velocidade = Math.sqrt(bola.velX ** 2 + bola.velY ** 2)
        velocidade = Math.min(velocidade + AUMENTO, VELOCIDADE_MAX) // ✅ sempre aumenta
    
        bola.velX *= -1
    
        if (overlapEsq < overlapDir) {
            bola.x = jogEsq - bola.w
        } else {
            bola.x = jogDir
        }
    
        let impacto = (bola.y + bola.h / 2) - (jogador.y + jogador.h / 2)
        impacto /= (jogador.h / 2)  // valor entre -1 e 1
    
        const dirX = bola.velX > 0 ? 1 : -1
    
        // ✅ Garante velocidade mínima em X para não "engolar" a bola
        const velYNova = impacto * velocidade
        const velXMinimo = velocidade * 0.6  // pelo menos 60% da velocidade vai pro X
        const velXNova = Math.max(Math.abs(velYNova) < velocidade
            ? Math.sqrt(velocidade ** 2 - velYNova ** 2)
            : velXMinimo, velXMinimo)
    
        bola.velX = dirX * velXNova
        bola.velY = velYNova
    } else {
        // Colisão vertical (bola bate no topo/base do personagem)
        bola.velY *= -1
    
        let velocidade = Math.sqrt(bola.velX ** 2 + bola.velY ** 2)
        velocidade = Math.min(velocidade + AUMENTO, VELOCIDADE_MAX) // ✅ aumenta aqui também
    
        // Mantém direção mas aplica nova velocidade
        const dirX = bola.velX > 0 ? 1 : -1
        const dirY = bola.velY > 0 ? 1 : -1
        bola.velX = dirX * velocidade * 0.7
        bola.velY = dirY * velocidade * 0.7
    
        if (overlapTopo < overlapBase) {
            bola.y = jogTopo - bola.h
        } else {
            bola.y = jogBase
        }
    }
}

// =============================================
// GOL
// =============================================

function verificarGol() {
    if (bola.gol) return

    if (bola.x <= 0) {
        jog2.pontos++
        bola.gol = true
    }

    if (bola.x + bola.w >= LARGURA) {
        jog1.pontos++
        bola.gol = true
    }

    if (bola.gol) {
        setTimeout(() => {
            bola.resetar()
            bola.lancar()
        }, 1000)
    }
}

// =============================================

function atualizar() {
    controles()

    jog1.mover()
    jog2.mover()
    bola.mover()

    colisao(bola, jog1)
    colisao(bola, jog2)

    verificarGol()
}

function desenhar() {
    des.clearRect(0, 0, LARGURA, ALTURA)

    jog1.desenha()
    jog2.desenha()
    bola.desenha()

    des.fillStyle = 'yellow'
    des.font = '40px Arial'
    des.fillText(jog1.pontos, 550, 50)
    des.fillText(jog2.pontos, 650, 50)
}

function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

// =============================================

carregarImagens([
    { nome: 'jog1', src: './img2players/jogador_esquerdo.png' },
    { nome: 'jog2', src: './img2players/jogador_direito.png' },
    { nome: 'bola', src: './img2players/bola.png' }
], iniciar)