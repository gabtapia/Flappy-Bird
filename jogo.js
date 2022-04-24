let frames = 0;

const som_PONTO = new Audio();
som_PONTO.src = './efeitos/ponto.wav';
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

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

                mudaParaTela(Telas.GAME_OVER);
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

const msgGameOver = {
    spriteX: 134, 
    spriteY: 153, 
    largura: 226, 
    altura: 200, 
    x: (canvas.width / 2) - 226 / 2, 
    y: 50, 
    desenha() {
        ctx.drawImage(
            sprites, 
            msgGameOver.spriteX, msgGameOver.spriteY, 
            msgGameOver.largura, msgGameOver.altura, 
            msgGameOver.x, msgGameOver.y, 
            msgGameOver.largura, msgGameOver.altura
        );
    }
}


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
            
            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
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
                    som_HIT.play();
                    mudaParaTela(Telas.GAME_OVER);
                }

                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            })
        }
    }

    return canos;
}

function criaPlacar(tamfont, pos1, pos2) {
    const placar = {
        melhor: 0, 
        pontuacao: 0, 
        desenha() {
            ctx.font = tamfont;
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${placar.pontuacao}`, canvas.width - pos1, pos2);
        }, 
        desenhamelhor() {
            ctx.font = tamfont;
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${placar.melhor}`, canvas.width - pos1, pos2)
        }, 
        atualiza() {
            const intervaloDeFrames = 150;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            
            let pontuacao = placar.pontuacao;
            let melhor = placar.melhor;

            if(passouOIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
                som_PONTO.play();
            }
            if(pontuacao > melhor) {
                melhor = pontuacao;
            }
        }
    }

    return placar;
}

//
// Telas
//
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
            globais.chao.desenha();
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
    inicializa() {
        globais.placar = criaPlacar('35px "VT323"', 10, 35);
    }, 
    desenha() {
        bck.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    }, 
    click() {
        globais.flappyBird.pula();
    }, 
    atualiza() {
        globais.chao.atualiza();
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    }
};

Telas.GAME_OVER = {
    inicializa() {
        globais.placar = criaPlacar('10px "VT323"', 20, 45);
    }, 
    desenha() {
        msgGameOver.desenha();
        globais.placar.desenhamelhor();
}, 
    atualiza() {

    }, 
    click() {
        mudaParaTela(Telas.INICIO);
    }
}

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