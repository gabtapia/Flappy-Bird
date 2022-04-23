let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const bck = {
    spriteX: 390, 
    spriteY: 0, 
    largura: 275, 
    altura: 204, 
    x: 0, 
    y: canvas.height - 204, 
    desenha() {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(
            sprites, 
            bck.spriteX, bck.spriteY, 
            bck.largura, bck.altura, 
            bck.x, bck.y, 
            bck.largura, bck.altura
        );

        ctx.drawImage(
            sprites, 
            bck.spriteX, bck.spriteY, 
            bck.largura, bck.altura, 
            (bck.x + bck.largura), bck.y, 
            bck.largura, bck.altura
        );
    }
}

function criaChao() {
    const chao = {
        spriteX: 0, 
        spriteY: 610, 
        largura: 224, 
        altura: 112, 
        x: 0, 
        y: canvas.height - 112, 
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        }, 
        desenha() {
            ctx.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, 
                chao.largura, chao.altura, 
                chao.x, chao.y, 
                chao.largura, chao.altura
            );
    
            ctx.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, 
                chao.largura, chao.altura, 
                (chao.x + chao.largura), chao.y, 
                chao.largura, chao.altura
            );
        }
    }
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0, 
        spriteY: 0, 
        largura: 33, 
        altura: 24, 
        x: 10, 
        y: 50, 
        pulo: 4.6, 
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        }, 
        gravidade: 0.25, 
        velocidade: 0, 
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500)
                return;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y =  flappyBird.y + flappyBird.velocidade;
        }, 
        movimentos: [
            { spriteX: 0, spriteY: 0 }, 
            { spriteX: 0, spriteY: 26 }, 
            { spriteX: 0, spriteY: 52 }, 
            { spriteX: 0, spriteY: 26 }, 
        ], 
        frameAtual: 0, 
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }

        }, 
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            ctx.drawImage(
                sprites, 
                spriteX, spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y, 
                flappyBird.largura, flappyBird.altura
            );
        }
    }
    return flappyBird;
}

const msgGetReady = {
    spriteX: 134, 
    spriteY: 0, 
    largura: 174, 
    altura: 152, 
    x: (canvas.width / 2) - 174 / 2, 
    y: 50, 
    desenha() {
        ctx.drawImage(
            sprites, 
            msgGetReady.spriteX, msgGetReady.spriteY, 
            msgGetReady.largura, msgGetReady.altura, 
            msgGetReady.x, msgGetReady.y, 
            msgGetReady.largura, msgGetReady.altura
        );
    }
}

//
// Telas
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

function criaCanos() {
    const canos = {
        largura: 52, 
        altura: 400,
        chao: {
            spriteX: 0, 
            spriteY: 169,     
        }, 
        ceu: {
            spriteX: 52, 
            spriteY: 169,     
        }, 
        espaco: 80, 
        desenha() {
            canos.pares.forEach(function(par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;
    
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
    
                // [Cano Do Céu]
                ctx.drawImage(
                    sprites, 
                    canos.ceu.spriteX, canos.ceu.spriteY, 
                    canos.largura, canos.altura, 
                    canoCeuX, canoCeuY, 
                    canos.largura, canos.altura
                );
    
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                
                // [Cano do Chão]
                ctx.drawImage(
                    sprites, 
                    canos.chao.spriteX, canos.chao.spriteY, 
                    canos.largura, canos.altura, 
                    canoChaoX, canoChaoY, 
                    canos.largura, canos.altura
                );

                par.canoCeu = {
                    x: canoCeuX, 
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX, 
                    y: canoChaoY
                }
            })

        }, 
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            
            if(globais.flappyBird.x >= par.x) {
                if(cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if(peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        }, 
        pares: [], 
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames) {
                canos.pares.push({
                    x: canvas.width, 
                    y: -150 * (Math.random() + 1)
                });
            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(canos.temColisaoComOFlappyBird(par)) {
                    mudaParaTela(Telas.INICIO);
                }

                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            })
        }
    }

    return canos;
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        }, 
        desenha() {
            bck.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            msgGetReady.desenha();
        }, 
        click() {
            mudaParaTela(Telas.JOGO);
        }, 
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        bck.desenha();
        globais.chao.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    }, 
    click() {
        globais.flappyBird.pula();
    }, 
    atualiza() {
        globais.chao.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames += 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();