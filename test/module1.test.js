const check_expr = (obj, object_name, property_name, operator, right_value) => {
  return _.every([
    _.get(obj, '[0].consequent[0].expression.left.object.name') === object_name,
    _.get(obj, '[0].consequent[0].expression.left.property.name') ===  property_name,
    _.get(obj, '[0].consequent[0].expression.operator') === operator,
    _.get(obj, '[0].consequent[0].expression.right.value') === right_value]
  );
}

describe('Module 01 - Game Loop', () => {

  it('Reference an external script @external-script', () => {
    const srcs = $('script').map(function(i, el) { return this.attribs.src }).get();
    assert(srcs.includes('https://code.createjs.com/1.0.0/createjs.min.js'), 'Did you add a `script` tag for the Createjs library?');
    assert(srcs.includes('https://code.createjs.com/1.0.0/createjs.min.js'), 'Did you add a `script` tag for the app.js file.');
  });

  it('Listen for DOMContentLoaded @listen-domcontentloaded', () => {
    assert(astq.query(ast,`
      // CallExpression [
        /:callee MemberExpression [
          /:object Identifier [ @name == 'document' ] &&
          /:property Identifier [ @name == 'addEventListener' ]
        ] &&
        /:arguments Literal [ @value == 'DOMContentLoaded' ]
      ]`).length >= 1, 'Do you have an event listner that is listening for the `DOMContentLoaded` event.');
  });
  it('Key code constants @keycode-constants', () => {
    assert(astq.query(ast,`
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [ 
            /:id Identifier [ @name == 'KEYCODE_LEFT' ] &&
            /:init Literal [ @value == 37 ]
          ]
    `).length >= 1, 'Do you have a constant called `KEYCODE_LEFT` set equal to `37`?');
    assert(astq.query(ast,`
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [ 
            /:id Identifier [ @name == 'KEYCODE_UP' ] &&
            /:init Literal [ @value == 38 ]
          ]
    `).length >= 1, 'Do you have a constant called `KEYCODE_UP` set equal to `38`?');
     assert(astq.query(ast,`
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [ 
            /:id Identifier [ @name == 'KEYCODE_RIGHT' ] &&
            /:init Literal [ @value == 39 ]
          ]
    `).length >= 1, 'Do you have a constant called `KEYCODE_RIGHT` set equal to `39`?');
    assert(astq.query(ast,`
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [
            /:id Identifier [ @name == 'KEYCODE_DOWN' ] &&
            /:init Literal [ @value == 40 ]
          ]
    `).length >= 1, 'Do you have a constant called `KEYCODE_DOWN` set equal to `37`?');
  });
  it('Create a stage @create-stage', () => {
    const stage = astq.query(ast, `
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [
            /:id Identifier [ @name == 'stage' ] &&
            /:init NewExpression
          ]
    `);
    assert(stage.length >= 1, 'Do you have a constant called `stage` set equal to a new `createjs.Sstage()`?');
    assert(stage[0].init.callee.object.name === 'createjs' && stage[0].init.callee.property.name == 'Stage', 'Are you useing the `createjs.Stage` class?');
    assert(stage[0].init.arguments[0].value === 'canvas', 'Are you providing the id of `canvas` to the Stage constructor?');
  });
  it('Create a shape @shio-shape', () => {
    const ship = astq.query(ast, `
      // BlockStatement
        / VariableDeclaration [ @kind == 'const' ]
          / VariableDeclarator [
            /:id Identifier [ @name == 'ship' ] &&
            /:init NewExpression
          ]
    `);
    assert(ship.length >= 1, 'Do you have a constant called `ship` set equal to a new `createjs.Shape()`?');
    assert(ship[0].init.callee.object.name === 'createjs' && ship[0].init.callee.property.name == 'Shape', 'Are you useing the `createjs.Shape` class?');
  });
  it('Draw the ship shape @draw-ship', () => {
    const calls = astq.query(ast, `
        // BlockStatement
          / ExpressionStatement
            / CallExpression [ count(@arguments) >= 1 ]
    `);

    const clean_calls = _.omitDeep(calls[0], ['start', 'end', 'raw', 'computed', 'type']);
    const flat_calls = _.index(clean_calls);
    const submission = _.values(flat_calls);
    const answer = ['ship', 'graphics', 'beginFill', 'white', 'moveTo', 0, 0, 'lineTo', 30, 15, 'lineTo', 0, 30, 'lineTo', 7.5, 15, 'lineTo', 0, 0];
    assert(_.isEqual(submission, answer), 'Are you drawing a `ship` path at the right points?');
  });
  it('Add a shape to the stage @ship-addchild', () => {
    const child = astq.query(ast,`
      // CallExpression [
        /:callee MemberExpression [
          /:property Identifier [ @name == 'addChild' ]
        ]
      ]`);
    const stage = child[0].callee.object.name;
    const ship = child[0].arguments[0].name;
    assert(child.length >= 1 && stage == 'stage' && ship == 'ship', 'Are you adding the `ship to the stage?');
  });
  it('Ticker event listener @ticker-event-listener', () => {
    const on = astq.query(ast,`
      // CallExpression [
        /:callee MemberExpression [
          /:property Identifier [ @name == 'on' ]
        ]
      ]`);
    const cjs = on[0].callee.object.object.name;
    const ticker = on[0].callee.object.property.name;
    assert(on.length >= 1, 'Is `createjs.Ticker.on()` listening for the `tick` event.');
    assert(cjs == 'createjs' && ticker == 'Ticker', 'Are you using the createjs.Ticker class?');
  });
  it('Ticker FPS @Ticker-fps', () => {
    const fps = astq.query(ast,`
      // CallExpression [
        /:callee MemberExpression [
          /:property Identifier [ @name == 'setFPS' ]
        ]
      ]`);
    const cjs = fps[0].callee.object.object.name;
    const ticker = fps[0].callee.object.property.name;
    assert(fps.length >= 1, 'Are you setting the frames per second with `createjs.Ticker.setFPS()`');
    assert(cjs == 'createjs' && ticker == 'Ticker', 'Are you using the createjs.Ticker class?');
  });
  it('Keyboard listener @keyboard-listener', () => {
    const keydown = astq.query(ast,`
      // CallExpression [
        /:callee MemberExpression [
          /:object Identifier [ @name == 'document' ] &&
          /:property Identifier [ @name == 'addEventListener' ]
        ] &&
        /:arguments Literal [ @value == 'keydown' ]
      ]`);
    assert(keydown.length >= 1, 'Do you have an event listner that is listening for the `keydown` event.');
  });
  it('Switch statement @switch-statement', () => {
    const switch_statement = astq.query(ast,`// SwitchStatement`);
    const switch_variable = switch_statement[0].discriminant.object.name + '.' + switch_statement[0].discriminant.property.name;
    assert(switch_statement.length >= 1 && switch_variable == 'event.keyCode', 'Do you have a `switch` statement that is testing `event.keyCode`?');
  });
  it('Left key @left-key', () => {
    const left = astq.query(ast,`
      // SwitchCase [
        /:test Identifier [ @name == 'KEYCODE_LEFT']
      ]`);

    assert(left.length >= 1, 'Do you have a case in the switch statement for the left key?');
    assert(check_expr(left, 'ship', 'x', '-=', 15), 'Are you moving the ship to the `left` by `15` pixels?');
    assert( _.get(left, '[0].consequent[1].type') === 'BreakStatement', 'Do you have a `break` statement?');
  });
  it('Up key @up-key', () => {
    const up = astq.query(ast,`
      // SwitchCase [
        /:test Identifier [ @name == 'KEYCODE_UP']
      ]`);

    assert(up.length >= 1, 'Do you have a case in the switch statement for the up key?');
    assert(check_expr(up, 'ship', 'y', '-=', 15), 'Are you moving the ship to the `up` by `15` pixels?');
    assert( _.get(up, '[0].consequent[1].type') === 'BreakStatement', 'Do you have a `break` statement?');
  });
  it('Right key @up-key', () => {
    const right = astq.query(ast,`
      // SwitchCase [
        /:test Identifier [ @name == 'KEYCODE_RIGHT']
      ]`);

    assert(right.length >= 1, 'Do you have a case in the switch statement for the right key?');
    assert(check_expr(right, 'ship', 'x', '+=', 15), 'Are you moving the ship to the `right` by `15` pixels?');
    assert( _.get(right, '[0].consequent[1].type') === 'BreakStatement', 'Do you have a `break` statement?');
  });
  it('Down key @down-key', () => {
    const down = astq.query(ast,`
      // SwitchCase [
        /:test Identifier [ @name == 'KEYCODE_DOWN']
      ]`);

    assert(down.length >= 1, 'Do you have a case in the switch statement for the down key?');
    assert(check_expr(down, 'ship', 'y', '+=', 15), 'Are you moving the ship to the `down` by `15` pixels?');
    assert( _.get(down, '[0].consequent[1].type') === 'BreakStatement', 'Do you have a `break` statement?');
  });

});