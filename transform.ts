const lodash = require('lodash');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const fileList: string[] = childProcess.execSync('echo src/assets/icons/*.svg', {
  encoding: 'utf-8',
})
  .trim()
  .split(/\s+/);

let publicContent: string = '';
let docContent: string = '';

fileList.forEach((filename: string) => {
  const name: string = lodash.snakeCase(
    `flat_${filename.split('/').splice(-1)[0].replace('.svg', '')}`,
  );

  let content: string = `import {IconDefinition} from '@ant-design/icons-angular';\n\n`;

  const iconClassName: string = `${name.charAt(0).toUpperCase()}${lodash.camelCase(name).substr(1)}`;

  content =
    `${content}export const ${iconClassName}: IconDefinition = {
  name: '${name}',
  theme: 'outline',
  icon: \`${fs.readFileSync(filename, {encoding: 'utf-8'}).trim()}\`,
};\n`;

  fs.writeFileSync(`src/icons/${iconClassName}.ts`, content);

  publicContent = `${publicContent}export {${iconClassName}} from './icons/${iconClassName}';\n`;

  docContent += `- <img src="https://flat-icons-for-ant-design.thanhtunguet.info/${filename}" width="20px" height="20px"/>: \`${name}\`\n`;

  docContent = fs.readFileSync('README.template.md', {
    encoding: 'utf-8',
  })
    .replace('%content%', docContent);

  fs.writeFileSync('src/public_api.ts', publicContent);
  fs.writeFileSync('README.md', docContent);
});
