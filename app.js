document.addEventListener("DOMContentLoaded", () => {

  const KEYCODE_LEFT = 37;
  const KEYCODE_UP = 38;
  const KEYCODE_RIGHT = 39;
  const KEYCODE_DOWN = 40;

  const stage = new createjs.Stage("canvas");
  const ship = new createjs.Shape();
  ship.graphics.beginFill('white').moveTo(0, 0)
                                  .lineTo(30, 15)
                                  .lineTo(0, 30)
                                  .lineTo(7.5, 15)
                                  .lineTo(0, 0);
  stage.addChild(ship);

  createjs.Ticker.on("tick", () => stage.update());
  createjs.Ticker.setFPS(30);

  document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
      case KEYCODE_LEFT:
        ship.x -= 15;
        break;
      case KEYCODE_UP:
        ship.y -= 15;
        break;
      case KEYCODE_RIGHT:
        ship.x += 15;
        break;
      case KEYCODE_DOWN:
        ship.y += 15;
        break;
    }
  });

});
