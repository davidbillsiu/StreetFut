// =============================================
//   CONSTANTES
// =============================================

const LARGURA     = 1200
const ALTURA      = 700
const GOLEIRAALT  = 200
const GOLEIRATORY = (ALTURA - GOLEIRAALT) / 2
const PONTOS_MAX  = 7

// =============================================
//   IMAGENS
// =============================================

const IMGS = {}

function carregarImagens(lista, callback) {
    let total = lista.length
    let carregadas = 0

    lista.forEach(({ nome, src }) => {
        const img = new Image()
        img.onload = () => {
            carregadas++
            if (carregadas === total) callback()
        }
        img.onerror = () => {
            carregadas++
            if (carregadas === total) callback()
        }
        img.src = src
        IMGS[nome] = img
    })
}

// =============================================
//   CLASSES
// =============================================

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
        if (img && img.complete && img.naturalWidth > 0) {
            des.drawImage(img, this.x, this.y, this.w, this.h)
        } else {
            des.fillStyle = (this.nomeImg === 'bola') ? '#fff' : '#ffcc00'
            des.fillRect(this.x, this.y, this.w, this.h)
        }
    }
}

class Raquete extends ObjBase {
    constructor(x, y, w, h, nomeImg) {
        super(x, y, w, h, nomeImg)
        this.vel = 0
        this.pontos = 0
    }

    mover() {
        this.y += this.vel
        if (this.y < 20) this.y = 20
        if (this.y + this.h > 680) this.y = 680 - this.h
    }
}

class Bola extends ObjBase {
    constructor() {
        const tam = 60
        super(LARGURA / 2 - tam / 2, ALTURA / 2 - tam / 2, tam, tam, 'bola')
        this._velX = 0
        this._velY = 0
    }

    lanca(direcao = 1) {
        const angulo = (Math.random() * 60 - 30) * (Math.PI / 180)
        const spd = 7
        this._velX = direcao * spd * Math.cos(angulo)
        this._velY = spd * Math.sin(angulo)
    }

    mover() {
        this.x += this._velX
        this.y += this._velY

        if (this.y <= 0) {
            this.y = 0
            this._velY *= -1
        }
        if (this.y + this.h >= ALTURA) {
            this.y = ALTURA - this.h
            this._velY *= -1
        }
    }

    // 🔥 CORREÇÃO COMPLETA AQUI
    rebate(raquete) {
        if (
            this.x < raquete.x + raquete.w &&
            this.x + this.w > raquete.x &&
            this.y < raquete.y + raquete.h &&
            this.y + this.h > raquete.y
        ) {
            const centro = raquete.y + raquete.h / 2
            const relativo = (this.y + this.h / 2 - centro) / (raquete.h / 2)

            let angulo = relativo * 60 * (Math.PI / 180)

            // evita ângulo muito vertical
            const LIMITE = 25 * (Math.PI / 180)
            if (Math.abs(angulo) > (Math.PI / 2 - LIMITE)) {
                angulo = (angulo > 0 ? 1 : -1) * (Math.PI / 2 - LIMITE)
            }

            const velocidadeAtual = Math.sqrt(this._velX**2 + this._velY**2)
            let spd = Math.min(velocidadeAtual + 0.5, 18)

            this._velX = (this._velX > 0 ? -1 : 1) * spd * Math.cos(angulo)
            this._velY = spd * Math.sin(angulo)

            // força velocidade mínima no X
            const MIN_X = 4
            if (Math.abs(this._velX) < MIN_X) {
                this._velX = (this._velX > 0 ? 1 : -1) * MIN_X
            }

            if (this._velX > 0) this.x = raquete.x + raquete.w + 2
            else this.x = raquete.x - this.w - 2

            return true
        }
        return false
    }

    saiu() {
        if (this.x + this.w < 0) return 'esquerda'
        if (this.x > LARGURA) return 'direita'
        return null
    }

    golNaGoleira() {
        const centro = this.y + this.h / 2
        return centro > GOLEIRATORY && centro < GOLEIRATORY + GOLEIRAALT
    }

    resetar() {
        this.x = LARGURA / 2 - this.w / 2
        this.y = ALTURA / 2 - this.h / 2
        this._velX = 0
        this._velY = 0
    }
}

// =============================================
//   VARIÁVEIS
// =============================================

const des = document.getElementById('des').getContext('2d')

let jogEsq, jogDir, bola
let jogar = false
let fim = false
let vencedor = ''
let contagem = 0
const teclas = {}

// =============================================
//   INICIALIZAÇÃO
// =============================================

function inicializarJogo() {
    jogEsq = new Raquete(30, ALTURA / 2 - 60, 60, 120, 'jogador_esquerdo')
    jogDir = new Raquete(1110, ALTURA / 2 - 60, 60, 120, 'jogador_direito')
    bola = new Bola()

    iniciarPartida()

    document.addEventListener('keydown', e => {
        teclas[e.key] = true
    })
    document.addEventListener('keyup', e => {
        teclas[e.key] = false
    })

    main()
}

function iniciarPartida() {
    jogar = true
    bola.lanca(1)
}

// =============================================
//   LÓGICA
// =============================================

function controles() {
    const spd = 9

    jogEsq.vel = 0
    if (teclas['w'] || teclas['W']) jogEsq.vel = -spd
    if (teclas['s'] || teclas['S']) jogEsq.vel = spd

    jogDir.vel = 0
    if (teclas['ArrowUp']) jogDir.vel = -spd
    if (teclas['ArrowDown']) jogDir.vel = spd
}

function atualiza() {
    if (!jogar) return

    controles()
    jogEsq.mover()
    jogDir.mover()
    bola.mover()

    // 🔥 MELHOR COLISÃO
    for (let i = 0; i < 2; i++) {
        bola.rebate(jogEsq)
        bola.rebate(jogDir)
    }
}

// =============================================
//   DESENHO
// =============================================

function desenha() {
    des.clearRect(0, 0, LARGURA, ALTURA)
    jogEsq.desenha()
    jogDir.desenha()
    bola.desenha()
}

// =============================================
//   LOOP
// =============================================

function main() {
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

// =============================================
//   START
// =============================================

carregarImagens([
    { nome: 'jogador_esquerdo', src: './img2players/jogador_esquerdo.png' },
    { nome: 'jogador_direito', src: './img2players/jogador_direito.png' },
    { nome: 'bola', src: './img2players/bola.png' }
], inicializarJogo)