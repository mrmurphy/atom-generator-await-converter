"use babel";

function generatorToAsyncAwait(block) {
  // /* $FlowIssue yield */ -> nothing
  block = block.replace(
    /.*\/\*\s?\$FlowIssue\s?yield\s?\*\/\n/g,
    ''
  )

  // // $FlowIssue yield -> nothing
  block = block.replace(
    /.*\/\/\s?\$FlowIssue\s?yield.*/g,
    ''
  )

  // function* -> async function (no space between function and *)
  block = block.replace(
    /function\*/g,
    'async function'
  )

  // function * -> async function (space between function and *)
  block = block.replace(
    /function \*/g,
    'async function '
  )

  // *foo() -> async foo()
  block = block.replace(
    /\*(?=\w*\(.*\).*?\{)/g,
      'async '
    )

    // yield -> async
    block = block.replace(
      /yield/g,
      'await'
    )

    return block
  }


  function go(editor) {
    let wholeFile = editor.getSelectedText() == ''

    if (wholeFile) {
      let text = editor.getText()
      editor.setText(generatorToAsyncAwait(text))
    } else {
      let text = editor.replaceSelectedText({}, text => {
        return generatorToAsyncAwait(text)
      })
    }
  }

  module.exports = {
    activate: function() {
      atom.commands.add('atom-workspace', {
        'generatorToAwait:go': () => {
          let editor = atom.workspace.getActiveTextEditor()
          go(editor)
        }
      })
    }
  }
