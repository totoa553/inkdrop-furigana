'use babel';

const { markdownRenderer } = require('inkdrop')
const ruby = require('./index');

module.exports = {

  activate() {
    this.subscription = inkdrop.commands.add(document.body, {
      'furigana:furigana': () => {
        if(/｜(\S+|)《(\S+|)》/.test(inkdrop.getActiveEditor().cm.getSelection())){
          inkdrop.getActiveEditor().cm.replaceSelection(inkdrop.getActiveEditor().cm.getSelection().split("《")[0].replace("｜",""));
        }else{
          inkdrop.getActiveEditor().cm.replaceSelection(`｜${inkdrop.getActiveEditor().cm.getSelection()}《》`);
          const {line, ch} = inkdrop.getActiveEditor().cm.getCursor();
          inkdrop.getActiveEditor().cm.setCursor({line, ch: ch - 1});
        }
      }
    });
    markdownRenderer.remarkPlugins.push(ruby);
    console.log(markdownRenderer);
  },

  deactivate() {
    this.subscription.dispose();
    markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(a!=ruby);
  }

};
