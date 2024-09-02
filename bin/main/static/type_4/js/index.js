$(document).ready(function () {
  const circle ='<svg viewBox="0 0 67.4 67.4"><circle class="circle" cx="33.7" cy="33.7" r="33.7"/></svg>'

                // '<svg viewBox="0 0 67.4 67.4"><circle class="circle" cx="33.7" cy="33.7" r="33.7"/></svg>';
  
  class Particle {
    constructor(svg, coordinates, friction) {
      this.svg = svg;
      this.steps = $(window).height() / 2;
      this.item = null; 
      this.friction = friction; // 이동시 마찰?
      this.coordinates = coordinates; //초기위치값
      this.position = this.coordinates.y; // 현재 y좌표?
      this.dimensions = this.render();
      this.move(); //움직일수 있도록 호출 / 움직임 처리
      this.rotation = Math.random() > 0.5 ? "-" : "+"; // 랜덤하게 입자가 회전할 방향 지정
      this.scale = 0.5 + (Math.random() * 2); //0.4~2값 사이의 랜덤값을 더해 나오는 도형 크기 지정
      this.siner = $(window).width() / 2.5 * Math.random();
    }

    destroy() {
      this.item.remove();
    }

    move() {
      this.position -= this.friction;
      let top = this.position;
      let left = this.coordinates.x + Math.sin(this.position * Math.PI / this.steps) * this.siner;
      this.item.css({
        transform: `translateX(${left}px) translateY(${top}px) scale(${this.scale}) rotate(${this.rotation}${this.position + this.dimensions.height}deg)`
      });

      if (this.position < -(this.dimensions.height)) {
        this.destroy();
        return false;
      } else {
        return true;
      }
    }

    render() {
      this.item = $(this.svg).css({
        transform: `translateX(${this.coordinates.x}px) translateY(${this.coordinates.y}px)`
      });
      $("#particles").append(this.item);
      return {
        width: this.item.width(),
        height: this.item.height()
      };
    }
  }

  let isPaused = false;
  window.onblur = function () {
    isPaused = true;
  };
  window.onfocus = function () {
    isPaused = false;
  };

  let particles = [];
  const maxParticles = 100;  // 최대 볼 개수 제한

  function createParticle() {
    if (!isPaused && particles.length < maxParticles) {
      particles.push(
        new Particle(circle, {
          x: (Math.random() * $(window).width()),
          y: $(window).height() + 100
        }, (1 + Math.random()))
      );
    }
  }

  setInterval(createParticle, 500);  // 볼 생성 간격을 늘려서 개수를 조절

  function update() {
    particles = particles.filter(function (p) {
      return p.move();
    });
    requestAnimationFrame(update);
  }
  update();
});
