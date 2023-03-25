module.exports = breaks

var rubyLocator = require('./locator')


function breaks(options){
    const { Parser } = this;
    if (!Parser) {
        return;
    }
    const {inlineTokenizers, inlineMethods} = Parser.prototype;

    rubyTokenizer.locator = rubyLocator;
    inlineTokenizers.ruby = rubyTokenizer;
    inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ruby');
}

function rubyTokenizer(eat, value, silent) {
    if (value.charAt(0) !== '｜') {
        return;
    }
    const rtStartIndex = value.indexOf('《');
    const rtEndIndex = value.indexOf('》', rtStartIndex);
    if (rtStartIndex <= 0 || rtEndIndex <= 0) {
        return;
    }
    const rubyRef = value.slice(1, rtStartIndex);
    const rubyText = value.slice(rtStartIndex + 1, rtEndIndex);
    if (silent) {
        return true; // Silentモードはconsumeせずtrueを返す
    }
    const now = eat.now(); // テキスト中の現在の位置を取得
    now.column += 1;
    now.offset += 1;
    console.log(rubyText,this.tokenizeInline(rubyRef, now))
    return eat(value.slice(0, rtEndIndex + 1))({
        type: 'ruby',
        text: this.tokenizeInline(rubyRef, now)[0].value,
        base: this.tokenizeInline(rubyRef, now)[0].value,
        data: { 
            hName: 'ruby' ,
            hChildren: [
                {
                    type: 'text',
                    value: this.tokenizeInline(rubyRef, now)[0].value,
                },
                {
                    type:"element",
                    children: [
                        { type: 'text', value: rubyText }
                    ],
                    tagName: 'rt',
                }
            ]
        },
    });
}