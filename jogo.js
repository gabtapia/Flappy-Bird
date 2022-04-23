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

const chao = {
    spriteX: 0, 
    spriteY: 610, 
    largura: 224, 
    altura: 112, 
    x: 0, 
    y: canvas.height - 112, 
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
            console.log('devo pular');
            console.log('[antes]', flappyBird.velocidade);
            flappyBird.velocidade = - flappyBird.pulo;
            console.log('[depois]', flappyBird.velocidade);
        }, 
        gravidade: 0.25, 
        velocidade: 0, 
        atualiza() {
            if(fazColisao(flappyBird, chao)) {
                console.log('Fez Colisao');
    
                mudaParaTela(Telas.INICIO);
                return;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y =  flappyBird.y + flappyBird.velocidade;
        }, 
        desenha() {
            ctx.drawImage(
                sprites, 
                flappyBird.spriteX, flappyBird.spriteY, 
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

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
        }, 
        desenha() {
            bck.desenha();
            chao.desenha();
            globais.flappyBird.desenha(); 
            msgGetReady.desenha();
        }, 
        click() {
            mudaParaTela(Telas.JOGO);
        }, 
        atualiza() {

        }
    }
};

Telas.JOGO = {
    desenha() {
        bck.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
    }, 
    click() {
        globais.flappyBird.pula();
    }, 
    atualiza() {
        globais.flappyBird.atualiza();
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();