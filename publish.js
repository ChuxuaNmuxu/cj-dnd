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

    console.log(`-------- ${description} --------`)

    const result = shell.exec(command);

    const err = shell.error()
    if (err) errFn(err);
    return result;
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
exec('npm publish ');

// 恢复.npmrc文件
let commitId = '';
if (isNpmrcCommit) {
    const result = shell.exec('git rev-parse HEAD~2')
    commitId = result.stdout;
} else {
    const result = shell.exec('git rev-parse HEAD~1')
    commitId = result.stdout;
}
console.log(commitId)


exec(`git checkout ${commitId} .npmrc`)


//  git push && git push --tags
exec('git push && git push --tags');

// cnpm sync @cjfed/cjfec
// exec('cnpm sync @cjfed/cjfec')

shell.echo('-------- success --------')
