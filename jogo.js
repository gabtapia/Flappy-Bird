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

const flappyBird = {
    spriteX: 0, 
    spriteY: 0, 
    largura: 33, 
    altura: 24, 
    x: 10, 
    y: 50, 
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

function loop() {
    bck.desenha();
    chao.desenha();
    flappyBird.desenha();

    requestAnimationFrame(loop);
}

loop();