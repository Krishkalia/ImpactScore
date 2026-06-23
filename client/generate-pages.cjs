const fs = require('fs');
const path = require('path');

const designsDir = path.join('..', 'Designs');
const pagesDir = path.join('src', 'pages', 'generated');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

function kebabToPascal(str) {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

const folders = fs.readdirSync(designsDir);

for (const folder of folders) {
  const htmlPath = path.join(designsDir, folder, 'code.html');
  if (fs.existsSync(htmlPath)) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    
    // Extract main tag
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    let mainContent = mainMatch ? mainMatch[0] : '';
    
    if (!mainContent) {
      // Fallback to body
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      mainContent = bodyMatch ? bodyMatch[1] : '';
    }

    // Convert class to className
    mainContent = mainContent.replace(/class="/g, 'className="');
    // Self close tags like img, input, hr, br
    mainContent = mainContent.replace(/<img([^>]*[^/])>/g, '<img$1 />');
    mainContent = mainContent.replace(/<input([^>]*[^/])>/g, '<input$1 />');
    mainContent = mainContent.replace(/<hr([^>]*[^/])>/g, '<hr$1 />');
    mainContent = mainContent.replace(/<br([^>]*[^/])>/g, '<br$1 />');
    mainContent = mainContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
    // Replace inline styles
    mainContent = mainContent.replace(/style="([^"]*)"/g, (match, p1) => {
      const parts = p1.split(';').filter(p => p.trim());
      const styleObj = {};
      for (const part of parts) {
        let [key, val] = part.split(':');
        if (key && val) {
          key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          styleObj[key] = val.trim();
        }
      }
      return `style={${JSON.stringify(styleObj)}}`;
    });
    // Replace SVG stroke-width, viewBox, preserveAspectRatio, clip-rule, fill-rule
    mainContent = mainContent.replace(/stroke-width/g, 'strokeWidth');
    mainContent = mainContent.replace(/stroke-linecap/g, 'strokeLinecap');
    mainContent = mainContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
    mainContent = mainContent.replace(/viewbox/g, 'viewBox');
    mainContent = mainContent.replace(/preserveaspectratio/g, 'preserveAspectRatio');
    mainContent = mainContent.replace(/clip-rule/g, 'clipRule');
    mainContent = mainContent.replace(/fill-rule/g, 'fillRule');
    mainContent = mainContent.replace(/datetime/g, 'dateTime');

    const componentName = kebabToPascal(folder);
    
    const tsx = `import React from 'react';

export const ${componentName} = () => {
  return (
    <>
      ${mainContent}
    </>
  );
};
`;
    fs.writeFileSync(path.join(pagesDir, `${componentName}.tsx`), tsx);
    console.log(`Generated ${componentName}.tsx`);
  }
}
