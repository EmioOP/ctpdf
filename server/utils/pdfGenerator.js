import {chromium} from 'playwright'
import {createHighlighter} from 'shiki'
import path from 'path'

const buildHtmlTemplate = (highlightedCode,{fileName,language,theme,})=>{
    const isDark = ['dracula', 'github-dark', 'monokai', 'nord'].includes(theme)
    const bgColor = isDark ? '#282a36' : '#ffffff';
    const textColor = isDark ? '#f8f8f2' : '#24292e';

      return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            background: ${bgColor};
            color: ${textColor};
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          }

          /* Header bar */
          .header {
            background: ${isDark ? '#1e1f29' : '#f0f0f0'};
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid ${isDark ? '#44475a' : '#ddd'};
          }

          .filename {
            font-size: 13px;
            font-weight: bold;
            color: ${isDark ? '#f8f8f2' : '#333'};
          }

          .language-badge {
            font-size: 11px;
            background: ${isDark ? '#44475a' : '#ddd'};
            color: ${isDark ? '#bd93f9' : '#555'};
            padding: 2px 8px;
            border-radius: 4px;
            text-transform: uppercase;
          }

          /* Code block */
          pre {
            padding: 20px;
            font-size: 13px;
            line-height: 1.7;
            overflow: visible;
            white-space: pre-wrap;      /* wraps long lines */
            word-break: break-all;
          }

          code { font-family: inherit; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="filename">${fileName}</span>
          <span class="language-badge">${language}</span>
        </div>
        ${highlightedCode}
      </body>
    </html>
  `;
}



const generateCodePDF = async({code,language,theme='github-light',fileName='code'})=>{
    const highlighter = await createHighlighter({themes:[theme]})
    await highlighter.loadLanguage('c')
    const highlightedCode =  highlighter.codeToHtml(code,{lang:'c',theme:'github-light'})
    // const filePath = path.join(outputPath,fileName)


    const html = buildHtmlTemplate(highlightedCode,{fileName,language,theme})

    
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    const pdfBuffer = await page.pdf({format:'A4',printBackground:true,margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' }}) //todo :allow user to change all these
    await browser.close()

    return pdfBuffer

}

export {generateCodePDF}




