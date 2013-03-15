var assert = require('assert');

var fixture = require('./fixture/example');

var unnamed = fixture.unnamed,
    named = fixture.named;


var trace = require('../trace').trace;

var expected = 'random_'+~~(Math.random()*100)

var local_unnamed = function(text) {
  throw new Error(text);
};

try {
  local_unnamed(expected);
} catch(err) {
  var traced = trace(err);

  assert.equal(traced.frames.length, err.stack.split('\n').length - 1);
  assert.ok(!!~['<anonymous>', 'local_unnamed'].indexOf(traced.frames[0].named_location));

  assert_stacks_equal(err, traced);
}

try {
  unnamed(expected);
} catch(err) {
  var traced = trace(err);
  assert.equal(traced.frames.length, err.stack.split('\n').length - 1);

  assert_stacks_equal(err, traced);
}

try {
  named(expected);
} catch(err) {
  var traced = trace(err);
  assert.equal(traced.frames.length, err.stack.split('\n').length - 1);

  assert_stacks_equal(err, traced);
}

console.error('Tests passed');
return;

function assert_stacks_equal(err, traced) {
  assert.equal(traced.first_line, err.stack.split('\n')[0]);
  assert.strictEqual(traced.original_error, err);

  var lines = err.stack.split('\n').slice(1);
  for(var i = 0, len = lines.length; i < len; ++i) {
    assert.notStrictEqual(lines[i].indexOf(traced.frames[i].line + ':' + traced.frames[i].character), -1);
    assert.notStrictEqual(lines[i].indexOf(traced.frames[i].filename), -1);
  }
}
