import config from './config'
import menu from './menu'
import request from './request'
import classnames from 'classnames'
import { color } from './theme'
import {  saveToken,removeToken } from './jwtToken'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

// 将服务器返回的数据格式化为tree接受的格式  listToTree(data, options) 
const  listToTree =  ( data, options ) => {
    if (data === undefined ) return ; 
    options = options || {};
    let ID_KEY = options.idKey || 'id';
    let PARENT_KEY = options.parentKey || 'parent';
    let CHILDREN_KEY = options.childrenKey || 'children';
    let TREE_NODE_KEY = 'key' ;
    
    var tree = {},
        childrenOf = {};
    let item, id, parent_id;
    for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item[ID_KEY];
        //init tree node key ,normaly , key will equal to id 
        item[TREE_NODE_KEY] = id ; 
        parent_id = item[PARENT_KEY] || 0;
        // every item may have children
        childrenOf[id] = childrenOf[id] || {};
        // init its children
        item[CHILDREN_KEY] = childrenOf[id];
        if (parent_id !== 0) {
            // init its parent's children object
            childrenOf[parent_id] = childrenOf[parent_id] || {};
            // push it into its parent's children object
            childrenOf[parent_id][item.id] = item;
        } else {
            tree[item.id] = item;
        }
    };
    return tree;
}

module.exports = {
  config,
  menu,
  request,
  color,
  classnames,
  queryURL,
  saveToken,
  removeToken,
  listToTree
}
