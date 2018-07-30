#!/usr/bin/env node
// TODO：编译前清空目标目录

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, './');

shell.cd(root);

// console.log('执行compile');
// shell.exec('npm run compile');
// if (shell.error()) {
//     process.exit(1)
// }

// console.log('执行build');
// shell.exec('npm run build');
// if(shell.error()) {
//     process.exit(1)
// }

// .npmrc添加//registry.npmjs.org/:_authToken=${NPM_TOKEN}
fs.writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);

// npm version patch
console.log('npm version patch')
shell.exec('npm version patch');
if (shell.error()) {
    process.exit(1)
}

// npm publish
console.log('npm publish')
shell.exec('npm publish');
if (shell.error()) {
    process.exit(1)
}

// 恢复.npmrc文件
console.log('恢复.npmrc文件')
shell.exec('git checkout .npmrc');
if (shell.error()) {
    process.exit(1)
}

//  git push && git push --tags
console.log('git push && git push --tags')
shell.exec('git push && git push --tags');
if (shell.error()) {
    process.exit(1)
}

// cnpm sync @cjfed/cjfec
console.log('cnpm sync @cjfed/cjfec')
shell.exec('cnpm sync @cjfed/cjfec');
if (shell.error()) {
    process.exit(1)
}
