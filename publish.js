#!/usr/bin/env node
// TODO：编译前清空目标目录

const shell = require('shelljs');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const isString = require('lodash/isString');
const isFunction = require('lodash/isFunction');

program
    .version('0.0.1')
    .option('-p --patch [value]', 'npm package patch version')
    .parse(process.argv)

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

const exec = (command, maybeDescription, maybeErrFn) => {
    let [description, errFn] = [command, () => { process.exit(1) }];

    if (isString(maybeDescription)) description = maybeDescription;
    if (isFunction(maybeDescription)) errFn = maybeDescription;
    if (isFunction(maybeErrFn)) errFn = maybeErrFn;

    console.log(`-------- ${description} --------`)

    const result = shell.exec(command);

    const err = shell.error()
    if (err) errFn(err);
    return result;
}

// .npmrc添加//registry.npmjs.org/:_authToken=${NPM_TOKEN}
fs.writeFileSync(path.resolve(root, '.npmrc'), `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);

// commit .npmrc
exec('git add .');
exec(`git commit -m 'update' `);

// npm version patch
console.log(56, program.patch)
if (isString(program.patch)) {
    exec(`npm version patch ${program.patch}`);
}
exec('npm version patch');

// console.log('执行compile');
// exec('npm run compile');

// npm publish
exec('npm publish');

// 恢复.npmrc文件
const result = shell.exec('git rev-parse HEAD~2')
const commitId = result.stdout.replace('\n', '');

exec(`git checkout ${commitId} .npmrc`, '恢复.npmrc')
exec('git add .');
exec(`git commit -m 'update' `, err => {
    if (!/nothing to commit/.test(err)) process.exit(1)
});

//  git push && git push --tags
exec('git push')
exec('git push --tags', () => {
    // @link https://stackoverflow.com/questions/36309363/windows-git-fatal-taskcanceledexception-encountered
    exec('git config --global credential.helper manager');
    exec('git push --tags');
});

// cnpm sync @cjfed/cjfec
// exec('cnpm sync @cjfed/cjfec')

shell.echo('-------- success --------')
