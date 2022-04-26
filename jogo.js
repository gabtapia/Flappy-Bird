let frames = 0;

/* [Sons] */
const som_PONTO = new Audio();
som_PONTO.src = './efeitos/ponto.wav';
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';
const som_FUNDO = new Audio();
som_FUNDO.src = './efeitos/fundo.wav';
som_FUNDO.loop = true;

/* [Sprites] */
const sprites = new Image();
sprites.src = './sprites.png';

/* [Canvas] */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/* [Eventos] */
window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

/* [Cenário] */
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

/* [Objetos] */
class FlappyBird {
    constructor() {
        this.spriteX = 0;
        this.spriteY = 0;
        this.largura = 33; 
        this.altura = 24;
        this.x = 10;
        this.y = 50; 
        this.pulo = 4.6; 
        function pula() {
            this.velocidade = - this.pulo;
        }
        this.gravidade = 0.25;
        this.velocidade = 0;
        function atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();

                mudaParaTela(Telas.GAME_OVER);
                return;
            }
    
            this.velocidade = this.velocidade + this.gravidade;
            this.y =  this.y + this.velocidade;
        }
        this.movimentos = [
            { spriteX: 0, spriteY: 0 }, 
            { spriteX: 0, spriteY: 26 }, 
            { spriteX: 0, spriteY: 52 }, 
            { spriteX: 0, spriteY: 26 }, 
        ];
        this.frameAtual = 0; 
        function atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + this.frameAtual;
                const baseRepeticao = this.movimentos.length;
                this.frameAtual = incremento % baseRepeticao;
            }

        }
        function desenha() {
            atualizaOFrameAtual();
            const { spriteX, spriteY } = this.movimentos[this.frameAtual];

            ctx.drawImage(
                sprites, 
                spriteX, spriteY, 
                this.largura, this.altura, 
                this.x, this.y, 
                this.largura, this.altura
            );
        }
    }
}
let flappyBird = new FlappyBird();

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
            const cabecaDoFlappy = flappyBird.y;
            const peDoFlappy = flappyBird.y + flappyBird.altura;
            
            if((flappyBird.x + flappyBird.largura) >= par.x) {
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

function criaMedalhas() {
    const medalha = {
        largura: 44,
        altura: 44, 
        x: 73, 
        y: 136, 
        medalhaAtual: 0, 
        medalhas: [
            { spriteX: 48, spriteY: 124 }, 
            { spriteX: 48, spriteY: 78 }, 
            { spriteX: 0, spriteY: 78 }, 
            { spriteX: 0, spriteY: 124 }
        ], 
        atualiza() {            
            if (globais.placar.pontuacao <= 3) {
                return medalha.medalhaAtual = 0;
            }
            if (globais.placar.pontuacao > 3 && globais.placar.pontuacao <= 7) {
                return medalha.medalhaAtual = 1;
            }
            if (globais.placar.pontuacao > 7 && globais.placar.pontuacao <= 15) {
                return medalha.medalhaAtual = 2;
            }
            if (globais.placar.pontuacao > 15) {
                return medalha.medalhaAtual = 3;
            }
        }, 
        desenha() {
            const { spriteX, spriteY } = medalha.medalhas[medalha.medalhaAtual];

            ctx.drawImage(
                sprites, 
                spriteX, spriteY, 
                medalha.largura, medalha.altura, 
                medalha.x, medalha.y, 
                medalha.largura, medalha.altura
            );
        }
    }
    
    return medalha;
}

/* [Pontuações] */
function criaPlacar() {
    const placar = {
        pontuacao: 0, 
        desenha(x, y) {
            ctx.font = '40px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${placar.pontuacao}`, canvas.width - x, y);
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
        }
    }

    return placar;
}

function criaMelhor() {
    globais.placar = criaPlacar();

    const melhorPontuacao = {
        melhor: 0, 
        desenha() {
            ctx.font = '40px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${melhorPontuacao.melhor}`, canvas.width - 68, 193);
        }, 
        atualiza() {
            if(globais.placar.pontuacao > melhorPontuacao.melhor) {
                melhorPontuacao.melhor = globais.placar.pontuacao;
            }
        }
    }

    return melhorPontuacao;
}

/* [Mensagens] */
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

/* [Variáveis Globais] */
const globais = {};
globais.melhorPontuacao = criaMelhor();
globais.placar = criaPlacar();
globais.medalha = criaMedalhas();

/* [Telas] */
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.chao = criaChao();
            globais.canos = criaCanos();
        }, 
        desenha() {
            bck.desenha();
            flappyBird.desenha();
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
        globais.placar = criaPlacar();
    }, 
    desenha() {
        bck.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        flappyBird.desenha();
        globais.placar.desenha(10, 35);
    }, 
    click() {
        flappyBird.pula();
    }, 
    atualiza() {
        globais.chao.atualiza();
        globais.canos.atualiza();
        flappyBird.atualiza();
        globais.placar.atualiza();
        globais.melhorPontuacao.atualiza();
    }
};

Telas.GAME_OVER = {
    desenha() {
        msgGameOver.desenha();
        globais.melhorPontuacao.desenha();
        globais.placar.desenha(68, 150);
        globais.medalha.desenha();
    }, 
    atualiza() {
        globais.medalha.atualiza();
    }, 
    click() {
        mudaParaTela(Telas.INICIO);
    }
};

function criaPlacar() {
    const placar = {
        pontuacao: 0, 
        desenha(x, y) {
            ctx.font = '40px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${placar.pontuacao}`, canvas.width - x, y);
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
        }
    }

    return placar;
}

function criaMelhor() {
    globais.placar = criaPlacar();

    const melhorPontuacao = {
        melhor: 0, 
        desenha() {
            ctx.font = '40px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${melhorPontuacao.melhor}`, canvas.width - 68, 193);
        }, 
        atualiza() {
            if(globais.placar.pontuacao > melhorPontuacao.melhor) {
                melhorPontuacao.melhor = globais.placar.pontuacao;
            }
        }
    }

    return melhorPontuacao;
}

/* Loop */
function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    som_FUNDO.play();

    frames += 1;
    requestAnimationFrame(loop);
}

mudaParaTela(Telas.INICIO);
loop();