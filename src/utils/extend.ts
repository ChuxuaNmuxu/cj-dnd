const includes = require('lodash/includes')

/**
 * 将origin的方法扩展到target
 * @param {class} target 
 * @param {class} origin 
 */
export function extend(Target: any, ...mixins: any[]) : any {
    class Extend extends Target {}

    for (let mixin of mixins) {
        // TODO: 实例属性复制不了
        copyProperties(Extend, mixin); // 拷贝静态属性
        copyProperties(Extend.prototype, mixin.prototype); // 拷贝原型属性,es6类class方法都在prototype上
    }
  
    return Extend;
}

/**
 * 拷贝对象除（consturctor, prototype, name）之外的自身属性属性， 包括不可枚举属性
 * @param {object} target 
 * @param {object} source 
 */
export function copyProperties(target: any, source: any) {
    for (let key of Reflect.ownKeys(source)) {
        if (!includes(['constructor', 'prototype', 'name'], key as any)) {
            // 拷贝自身属性的一对方法，拷贝的结果通过 对象.属性 来使用，拷贝prototype时可以用来混合类的属性及方法
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc as any);
        }
    }
}