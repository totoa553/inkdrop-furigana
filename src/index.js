import { markdownRenderer } from 'inkdrop';
import { remarkRuby } from './remark';

export default {

  activate() {
    // console.log("hello")
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
    markdownRenderer.remarkPlugins.push(remarkRuby);
    // console.log(markdownRenderer);
  },

  deactivate() {
    this.subscription.dispose();
    markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(a!=remarkRuby);
  }

};
