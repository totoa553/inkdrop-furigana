import rubyLocator from './locator'

import { visit, CONTINUE } from 'unist-util-visit'

const regex = /｜(.+?)《(.+?)》/g;
const regex2 = /｜(\S+|)《(\S+|)》/;

export function remarkRuby() {
    return (tree) => {
      visit(tree, "text", (node, index, parent) => {
        if (!regex.test(node.value)) return [CONTINUE]

        const value = node.value
        const slices = []
        regex.lastIndex = 0
        let match = regex.exec(value)
        let start = 0

        while (match) {
          const text = (match[0])
          const position = match.index
  
          if (start !== position) {
            slices.push(value.slice(start, position))
          }
  
          slices.push(text)
          start = position + match[0].length
          match = regex.exec(value)
        }
  
        if (slices.length > 0) {
          slices.push(value.slice(start))
        }
        // console.log(slices)

        const children = slices.map((text)=>{
          if (regex.test(text)){
            let match = text.match(regex2)
            return {
              type: 'ruby',
              data: { 
                  hName: 'ruby' ,
                  hChildren: [
                      {
                          type: 'text',
                          value: match[1],
                      },
                      {
                          type:"element",
                          children: [
                              { type: 'text', value: match[2] }
                          ],
                          tagName: 'rt',
                      }
                  ]
              },
            }
          }else{
            return {
              type: "text",
              value: text
            }
          }
        })

        parent.children.splice(index, 1)

        children.reverse().forEach((item) => {
          parent.children.splice(index, 0, item)
        })

      }
    )}
}
