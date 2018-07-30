#!/usr/bin/env node
// TODO：编译前清空目标目录

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const isString = require('lodash/isString');
const isFunction = require('lodash/isFunction');

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

const exec = (command, maybeDescription, maybeErrFn) => {
    let [description, errFn] = [command, () => {process.exit(1)}];

    if (isString(maybeDescription)) description = maybeDescription;
    if (isFunction(maybeDescription)) errFn = maybeDescription;
    if (isFunction(maybeErrFn)) errFn = maybeErrFn;

    console.log(description)
    shell.exec(command);
    const err = shell.error()
    if (err) errFn(err);
}

// npm version patch
let isNpmrcCommit = false;
exec('npm version patch', err => {
    if (/Git working directory not clean/.test(err)) {
        // commit .npmrc
        exec('git add .');
        exec(`git commit -m 'update' `);
        exec('npm version patch');
        isNpmrcCommit = true;
    }
})

// npm publish
// console.log('npm publish')
// shell.exec('npm publish');
// if (shell.error()) {
//     process.exit(1)
// }

exec('npm publish ')

// 恢复.npmrc文件
// console.log('恢复.npmrc文件')
// shell.exec('git checkout .npmrc');
// if (shell.error()) {
//     process.exit(1)
// }
if (isNpmrcCommit) {
    exec('git reset HEAD^ --hard');    
} 
exec('git checkout .npmrc', '恢复.npmrc文件')


//  git push && git push --tags
// console.log('git push && git push --tags')
// shell.exec('git push && git push --tags');
// if (shell.error()) {
//     process.exit(1)
// }
exec('git push && git push --tags');


// cnpm sync @cjfed/cjfec
// console.log('cnpm sync @cjfed/cjfec')
// shell.exec('cnpm sync @cjfed/cjfec');
// if (shell.error()) {
//     process.exit(1)
// }
// exec('cnpm sync @cjfed/cjfec')
