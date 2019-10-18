<template>
  <div>

  </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
// Promise的重要性我认为我没有必要多讲，概括起来说就是必须得掌握，而且还要掌握透彻。这篇文章的开头，主要跟大家分析一下，为什么会有Promise出现。
// 地狱回调
// 在实际的使用当中，有非常多的应用场景我们不能立即知道应该如何继续往下执行。最重要也是最主要的一个场景就是ajax请求。通俗来说，由于网速的不同，可能你得到返回值的时间也是不同的，这个时候我们就需要等待，结果出来了之后才知道怎么样继续下去。

// 简单的实现ajax
// var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-02-26/2017-06-10';
// var result;

// var XHR = new XMLHttpRequest();
// XHR.open('get',url, true);
// XHR.send();

// XHR.onreadystatechange = function(){
//     if(XHR.readyState == 4 && XHR.status == 200){
//         result = XHR.response;
//         console.log(result)
//     }
// }
// 在ajax的原生实现中，利用了onreadystatechange事件，当该事件触发并且符合一定条件时，才能拿到我们想要的数据，之后我们才能开始处理数据。

// 这样做看上去并没有什么麻烦，但是如果这个时候，我们还需要做另外一个ajax请求，这个新的ajax请求的其中一个参数，得从上一个ajax请求中获取，这个时候我们就不得不如下这样做：

// var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-02-26/2017-06-10';
// var result;

// var XHR = new XMLHttpRequest();
// XHR.open('GET', url, true);
// XHR.send();

// XHR.onreadystatechange = function() {
//     if (XHR.readyState == 4 && XHR.status == 200) {
//         result = XHR.response;
//         console.log(result);

//         // 伪代码
//         var url2 = 'http:xxx.yyy.com/zzz?ddd=' + result.someParams;
//         var XHR2 = new XMLHttpRequest();
//         XHR2.open('GET', url, true);
//         XHR2.send();
//         XHR2.onreadystatechange = function() {
//             ...
//         }
//     }
// }
// 当出现第三个ajax(甚至更多)仍然依赖上一个请求的时候，我们的代码就变成了一场灾难。这场灾难，往往也被称为回调地狱。

// 因此我们需要一个叫做Promise的东西，来解决这个问题。

// 当然，除了回调地狱之外，还有一个非常重要的需求：为了我们的代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来。上面的写法，是完全没有区分开，当数据变得复杂时，也许我们自己都无法轻松维护自己的代码了。这也是模块化过程中，必须要掌握的一个重要技能，请一定重视。

// 关于promise
// 从前面几篇文中的知识我们可以知道，当我们想要确保某代码在谁谁之后执行时，我们可以利用函数调用栈，将我们想要执行的代码放入回调函数中。

// 一个简单的封装
function want(){
    console.log('这是你想要执行的代码');
}
function fn(want){
    console.log('已经要执行的一段代码') //这里比如是ajax请求参数
    
    want&&want();  // ajax处理参数
}

fn(want);
console.log('执行完毕');

/*
控制台打印为：

已经要执行的一段代码
这是你想要执行的代码
执行完毕

*/

// 利用回调函数封装，是我们在初学JavaScript时常常会使用的技能。

// 确保我们想要的代码压后执行，除了利用函数调用栈的执行顺序之外，我们还可以利用上一篇文章所述的队列机制。

function want(){
    console.log('这是你想要执行的代码');
}
function fn(want){
    console.log('已经要执行的一段代码') //这里比如是ajax请求参数
    
    want&&setTimeout(want,0);  // ajax处理参数
}

fn(want);
console.log('执行完毕');

/*
控制台打印为：

已经要执行的一段代码
执行完毕
这是你想要执行的代码

*/
// 如果浏览器已经支持了原生的Promise对象，那么我们就知道，浏览器的js引擎里已经有了Promise队列，这样就可以利用Promise将任务放在它的队列中去。

function want(){
    console.log('这是你想要执行的代码');
}

function fn(want){
    console.log('已经要执行的一段代码') //这里比如是ajax请求参数
    return new Promise(function(resolve,reject){
        if(want instanceof Function){
            resolve(want)
        } else {
            reject('TypeError: '+ want +'不是一个函数')
        }
    })
}

fn(want).then(function(want,a){
    want();
})

fn('123').catch(function(err){
    console.log(err)
})
/*
控制台打印为：

已经要执行的一段代码
已经要执行的一段代码
这是你想要执行的代码
123不是一个函数
*/
// 看上去变得更加复杂了。可是代码变得更加健壮，处理了错误输入的情况。

// 为了更好的往下扩展Promise的应用，这里需要先跟大家介绍一下Promsie的基础知识。

// 一、 Promise对象三种状态E
// pending: 等待中，或者进行中，表示还没有得到结果

// resolved(Fulfilled): 已经完成，表示得到了我们想要的结果，可以继续往下执行

// rejected: 也表示得到结果，但是由于结果并非我们所愿，因此拒绝执行

// 这三种状态不受外界影响，而且状态只能从pending改变为resolved或者rejected，并且不可逆。在Promise对象的构造函数中，将一个函数作为第一个参数。而这个函数，就是用来处理Promise的状态变化。

new Promise(function(resolve, reject) {
    if(true) { resolve() };
    if(false) { reject() };
})
// 上面的resolve和reject都为一个函数，他们的作用分别是将状态修改为resolved和rejected。

// 二、 Promise对象中的then方法
// 可以接收构造函数中处理的状态变化，并分别对应执行。then方法有2个参数，第一个函数接收resolved状态的执行，第二个参数接收reject状态的执行。

function fn(num) {
    return new Promise(function(resolve, reject) {
        if (typeof num == 'number') {
            resolve();
        } else {
            reject();
        }
    }).then(function() {
        console.log('参数是一个number值');
    }, function() {
        console.log('参数不是一个number值');
    })
}

fn('hahha');
fn(1234);
// then方法的执行结果也会返回一个Promise对象。因此我们可以进行then的链式执行，这也是解决回调地狱的主要方式。

function fn(num) {
    return new Promise(function(resolve, reject) {
        if (typeof num == 'number') {
            resolve();
        } else {
            reject();
        }
    })
    .then(function() {
        console.log('参数是一个number值');
    })
    .then(null, function() {
        console.log('参数不是一个number值');
    })
}

fn('hahha');
fn(1234);
then(null, function() {})// 就等同于catch(function() {})

// 三、Promise中的数据传递
// 大家自行从下面的例子中领悟吧。

function fn(num) {
    return new Promise(function(resolve, reject) {
        if (typeof num == 'number') {
            resolve(num);
        } else {
            reject('typeError');
        }
    })
}

fn(2).then(function(num){
    console.log('first: ' + num);
    return num + 1;
}).then(function(num){
    console.log('second: ' + num);
    return num + 1;
}).then(function(num) {
    console.log('third: ' + num);
    return num + 1;
});
//当fn()执行成功时（即promise返回resolve），执行then,返回一个promise
//当then执行成功后,（即新的promise返回resolve），继续执行then，以此类推
/*
控制台打印为：

first: 2
second: 3
third: 4
*/
// OK，了解了这些基础知识之后，我们再回过头，利用Promise的知识，对最开始的ajax的例子进行一个简单的封装。看看会是什么样子。

var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-02-26/2017-06-10';

// 封装一个get请求的方法
function getJSON(url) {
    return new Promise(function(resolve, reject) {
        var XHR = new XMLHttpRequest();
        XHR.open('GET', url, true);
        XHR.send();

        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4) {
                if (XHR.status == 200) {
                    try {
                        var response = JSON.parse(XHR.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(XHR.statusText));
                }
            }
        }
    })
}

getJSON(url).then(resp => console.log(resp));
// 为了健壮性，处理了很多可能出现的异常，总之，就是正确的返回结果，就resolve一下，错误的返回结果，就reject一下。并且利用上面的参数传递的方式，将正确结果或者错误信息通过他们的参数传递出来。

// 现在所有的库几乎都将ajax请求利用Promise进行了封装，因此我们在使用jQuery等库中的ajax请求时，都可以利用Promise来让我们的代码更加优雅和简单。这也是Promise最常用的一个场景，因此我们一定要非常非常熟悉它，这样才能在应用的时候更加灵活。

// 四、Promise.all
// 当有一个ajax请求，它的参数需要另外2个甚至更多请求都有返回结果之后才能确定，那么这个时候，就需要用到Promise.all来帮助我们应对这个场景。

// Promise.all接收一个Promise对象组成的数组作为参数，当这个数组所有的Promise对象状态都变成resolved或者rejected的时候，它才会去调用then方法。

var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-02-26/2017-06-10';
var url1 = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType/2017-03-26/2017-06-10';

function renderAll() {
    return Promise.all([getJSON(url), getJSON(url1)]);
}

renderAll().then(function(value) {
    // 建议大家在浏览器中看看这里的value值
    console.log(value);
})
// 五、 Promise.race
// 与Promise.all相似的是，Promise.race都是以一个Promise对象组成的数组作为参数，不同的是，只要当数组中的其中一个Promsie状态变成resolved或者rejected时，就可以调用.then方法了。而传递给then方法的值也会有所不同，大家可以再浏览器中运行下面的例子与上面的例子进行对比。

function renderRace() {
    return Promise.race([getJSON(url), getJSON(url1)]);
}

renderRace().then(function(value) {
    console.log(value);
})
// 最后总结一下，这篇文章，涉及到的东西，有点多。大概包括Promise基础知识，ajax基础知识，如何利用Promise封装ajax。

// 延伸阅读1：Promise简单实现（正常思路版）
// Promise/A+规范：
// 首先重新阅读了下A+的规范:

// promise代表了一个异步操作的最终结果，主要是通过then方法来注册成功以及失败的情况，
// Promise/A+历史上说是实现了Promise/A的行为并且考虑了一些不足之处，他并不关心如何创建，完成，拒绝Promise，只考虑提供一个可协作的then方法。
// 术语：
// promise是一个拥有符合上面的特征的then方法的对象或者方法。
// thenable是定义了then方法的对象或者方法
// value是任何合法的js的值（包括undefined，thenable或者promise）
// exception是一个被throw申明抛出的值
// reason是一个指明了为什么promise被拒绝
// 2.1 状态要求：
// promise必须是在pending，fulfilled或者rejected之间的一种状态。
// promise一旦从pending变成了fulfilled或则rejected，就不能再改变了。
// promise变成fulfilled之后，必须有一个value，并且不能被改变
// promise变成rejected之后，必须有一个reason，并且不能被改变
// 2.2 then方法的要求：
// promise必须有个then方法来接触当前的或者最后的value或者reason
// then方法接受两个参数，onFulfilled和onRejected，这两个都是可选的，如果传入的不是function的话，就会被忽略
// 如果onFulfilled是一个函数，他必须在promise完成后被执行(不能提前)，并且value是第一个参数，并且不能被执行超过一次
// 如果onRejected是一个函数，他必须在promise拒绝后被执行(不能提前)，并且reason是第一个参数，并且不能被执行超过一次
// onFulfilled或者onRejected只能在执行上下文堆只包含了平台代码的时候执行(就是要求onfulfilled和onrejected必须异步执行，必须在then方法被调用的那一轮事件循环之后的新执行栈执行，这里可以使用macro-task或者micro-task，这两个的区别参见文章)
// onFulfilled或者onRejected必须作为function被执行(就是说没有一个特殊的this，在严格模式中，this就是undefined，在粗糙的模式，就是global)
// then方法可能在同一个promise被调用多次，当promise被完成，所有的onFulfilled必须被顺序执行，onRejected也一样
// then方法必须也返回一个promise(这个promise可以是原来的promise，实现必须申明什么情况下两者可以相等)promise2 = promise1.then(onFulfilled, onRejected);
// 如果onFulfilled和onRejected都返回一个value x，执行2.3Promise的解决步骤[[Resolve]](promise2, x)
// 如果onFulfilled和onRejected都抛出exception e，promise2必须被rejected同样的e
// 如果onFulfilled不是个function，且promise1 is fulfilled，promise2也会fulfilled，和promise1的值一样
// 如果onRejected不是个function，且promise1 is rejected，promise2也会rejected，理由和promise1一样
// 2.3 Promise的解决步骤==[[Resolve]](promise2, x)
// 这个是将promise和一个值x作为输入的一个抽象操作。如果这个x是支持then的，他会尝试让promise接受x的状态；否则，他会用x的值来fullfill这个promise。运行这样一个东西，遵循以下的步骤
// 如果promise和x指向同一个对象，则reject这个promise使用TypeError。
// 如果x是一个promise，接受他的状态
// 如果x在pending，promise必须等待x的状态改变
// 如果x被fullfill，那么fullfill这个promise使用同一个value
// 如果x被reject，那么reject这个promise使用同一个理由
// 如果x是一个对象或者是个方法
// 如果x.then返回了错误，则reject这个promise使用错误。
// 如果then是一个方法，使用x为this，resolvePromise为一参，rejectPromise为二参，
// 如果resolvePromise被一个值y调用，那么运行[[Resolve]](promise, y)
// 如果rejectPromise被reason r，使用r来reject这个promise
// 如果resolvePromise和rejectPromise都被调用了，那么第一个被调用的有优先权，其他的beihulue
// 如果调用then方法得到了exception，如果上面的方法被调用了，则忽略，否则reject这个promise
// 如果then方法不是function，那么fullfill这个promise使用x
// 如果x不是一个对象或者方法，那么fullfill这个promise使用x
// 如果promise产生了环形的嵌套，比如[[Resolve]](promise, thenable)最终唤起了[[Resolve]](promise, thenable)，那么实现建议且并不强求来发现这种循环，并且reject这个promise使用一个TypeError。

// 接下来正式写一个promise
// 思路都是最正常的思路，想要写一个Promise，肯定得使用一个异步的函数，就拿setTimeout来做。

 var p = new Promise(function(resove){
            setTimeout(resove, 100);
        })

 p.then(function(){console.log('success')},function(){console.log('fail')});
初步构建
上面是个最简单的使用场景我们需要慢慢来构建

function Promise(fn){
  //需要一个成功时的回调
  var doneCallback;
  //一个实例的方法，用来注册异步事件
  this.then = function(done){
    doneCallback = done;
  }
  function resolve(){
    doneCallback();
  }
  fn(resolve);
}
// 加入链式支持
// 下面加入链式，成功回调的方法就得变成数组才能存储

function Promise(fn){
  //需要成功以及成功时的回调
  var doneList = [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done ,fail){
    doneList.push(done);
    return this;
  }
  function resolve(){
    doneList.forEach(function(fulfill){
      fulfill();
    });
  }
  fn(resolve);
}
// 这里promise里面如果是同步的函数的话，doneList里面还是空的，所以可以加个setTimeout来将这个放到js的最后执行。这里主要是参照了promiseA+的规范，就像这样

function resolve(){
  setTimeout(function(){
    doneList.forEach(function(fulfill){
      fulfill();
    });
  },0);
}
加入状态机制
// 这时如果promise已经执行完了，我们再给promise注册then方法就怎么都不会执行了，这个不符合预期，所以才会加入状态这种东西。更新过的代码如下

function Promise(fn){
  //需要成功以及成功时的回调
  var state = 'pending';
  var doneList = [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done){
    switch(state){
      case "pending":
        doneList.push(done);
        return this;
        break;
      case 'fulfilled':
        done();
        return this;
        break;
    }
  }
  function resolve(){
    state = "fulfilled";
    setTimeout(function(){
      doneList.forEach(function(fulfill){
        fulfill();
      });
    },0);
  }
  fn(resolve);
}
支持串行
// 这样子我们就可以将then每次的结果交给后面的then了。但是我们的promise现在还不支持promise的串行写法。比如我们想要

var p = new Promise(function(resolve){
    setTimeout(function(){
      resolve(12);
    }, 100);
});
var p2 = new Promise(function(resolve){
    setTimeout(function(){
      resolve(42);
    }, 100);
});
p.then(
      function(name){
        console.log(name);return 33;
      }
  )
  .then(function(id){console.log(id)})
  .then(p2)
  .then(function(home){console.log(home)});
// 所以我们必须改下then方法。

// 当then方法传入一般的函数的时候，我们目前的做法是将它推进了一个数组，然后return this来进行链式的调用，并且期望在resolve方法调用时执行这个数组。

// 最开始我是研究的美团工程师的一篇博客,到这里的时候发现他的解决方案比较跳跃，于是我就按照普通的正常思路先尝试了下：

// 如果传入一个promise的话，我们先尝试继续推入数组中，在resolve的地方进行区分，发现是可行的，我先贴下示例代码，然后会有详细的注释。

function Promise(fn){
  //需要成功以及成功时的回调
  var state = 'pending';
  var doneList = [];
  this.then = function(done){
    switch(state){
      case "pending":
        doneList.push(done);
        return this;
        break;
      case 'fulfilled':
        done();
        return this;
        break;
    }
  }
  function resolve(newValue){
    state = "fulfilled";
    setTimeout(function(){
      var value = newValue;
      //执行resolve时，我们会尝试将doneList数组中的值都执行一遍
      //当遇到正常的回调函数的时候，就执行回调函数
      //当遇到一个新的promise的时候，就将原doneList数组里的回调函数推入新的promise的doneList，以达到循环的目的
      for (var i = 0;i<doneList.length;i++){
        var temp = doneList[i](value)
        if(temp instanceof Promise){
            var newP =  temp;
            for(i++;i<doneList.length;i++){
                newP.then(doneList[i]);
            }
        }else{
            value = temp;
        }
      }
    },0);
  }
  fn(resolve);
}
var p = function (){
    return new Promise(function(resolve){
        setTimeout(function(){
          resolve('p 的结果');
        }, 100);
    });
}
var p2 = function (input){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log('p2拿到前面传入的值：' + input)
            resolve('p2的结果');
        }, 100);
    });
}
p()
.then(function(res){console.log('p的结果:' + res); return 'p then方法第一次返回'})
.then(function(res){console.log('p第一次then方法的返回：'+res); return 'p then方法第二次返回'})
.then(p2)
.then(function(res){console.log('p2的结果：' + res)});
// 加入reject
// 我按照正常思路这么写的时候发现出了点问题，因为按照最上面的规范。即使一个promise被rejected，他注册的then方法之后再注册的then方法会可能继续执行resolve的。即我们在then方法中为了链式返回的this的status是可能会被改变的，假设我们在实现中来改变状态而不暴露出来(这其实一点也不推荐)。

// 我直接贴实现的代码，还有注释作为讲解

function Promise(fn){
  var state = 'pending';
  var doneList = [];
  var failList= [];
  this.then = function(done ,fail){
    switch(state){
      case "pending":
        doneList.push(done);
        //每次如果没有推入fail方法，我也会推入一个null来占位
        failList.push(fail || null);
        return this;
        break;
      case 'fulfilled':
        done();
        return this;
        break;
      case 'rejected':
        fail();
        return this;
        break;
    }
  }
  function resolve(newValue){
    state = "fulfilled";
    setTimeout(function(){
      var value = newValue;
      for (var i = 0;i<doneList.length;i++){
        var temp = doneList[i](value);
        if(temp instanceof Promise){
            var newP =  temp;
            for(i++;i<doneList.length;i++){
                newP.then(doneList[i],failList[i]);
            }
        }else{
            value = temp;
        }
      }
    },0);
  }
  function reject(newValue){
    state = "rejected";
    setTimeout(function(){
      var value = newValue;
      var tempRe = failList[0](value);
      //如果reject里面传入了一个promise，那么执行完此次的fail之后，将剩余的done和fail传入新的promise中
      if(tempRe instanceof Promise){
        var newP = tempRe;
        for(i=1;i<doneList.length;i++){
            newP.then(doneList[i],failList[i]);
        }
      }else{
        //如果不是promise，执行完当前的fail之后，继续执行doneList
        value =  tempRe;
        doneList.shift();
        failList.shift();
        resolve(value);
      }
    },0);
  }
  fn(resolve,reject);
}
var p = function (){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
          reject('p 的结果');
        }, 100);
    });
}
var p2 = function (input){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log('p2拿到前面传入的值：' + input)
            resolve('p2的结果');
        }, 100);
    });
}
p()
.then(function(res){console.log('p的结果:' + res); return 'p then方法第一次返回'},function(value){console.log(value);return 'p then方法第一次错误的返回'})
.then(function(res){console.log('p第一次then方法的返回：'+res); return 'p then方法第二次返回'})
.then(p2)
.then(function(res){console.log('p2的结果：' + res)});
// 延伸阅读2：理解 JavaScript 的 async/await
// async 和 await 在干什么
// 任意一个名称都是有意义的，先从字面意思来理解。async 是“异步”的简写，而 await 可以认为是 async wait 的简写。所以应该很好理解 async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。

// async 起什么作用
// 这个问题的关键在于，async 函数是怎么处理它的返回值的！

// 我们当然希望它能直接通过 return 语句返回我们想要的值，但是如果真是这样，似乎就没 await 什么事了。所以，写段代码来试试，看它到底会返回什么：

async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);  // Promise {<resolved>: "hello"}
// 看到输出就恍然大悟了——输出的是一个 Promise 对象。

// 所以，async 函数返回的是一个 Promise 对象。从文档中也可以得到这个信息。async 函数（包含函数语句、函数表达式、Lambda表达式）会返回一个 Promise 对象，如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

// async 函数返回的是一个 Promise 对象，所以在最外层不能用 await 获取其返回值的情况下，我们当然应该用原来的方式：then() 链来处理这个 Promise 对象，就像这样

testAsync().then(v => {
    console.log(v);    // 输出 hello async
});
// 现在回过头来想下，如果 async 函数没有返回值，又该如何？很容易想到，它会返回 Promise.resolve(undefined)。

// 联想一下 Promise 的特点——无等待，所以在没有 await 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。

// 那么下一个关键点就在于 await 关键字了。

// await 到底在等啥
// 一般来说，都认为 await 是在等待一个 async 函数完成。不过按语法说明，await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。

// 因为 async 函数返回一个 Promise 对象，所以 await 可以用于等待一个 async 函数的返回值——这也可以说是 await 在等 async 函数，但要清楚，它等的实际是一个返回值。注意到 await 不仅仅用于等 Promise 对象，它可以等任意表达式的结果，所以，await 后面实际是可以接普通函数调用或者直接量的。所以下面这个示例完全可以正确运行

function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2);
}

test();
// await 等到了要等的，然后呢
// await 等到了它要等的东西，一个 Promise 对象，或者其它值，然后呢？我不得不先说，await 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。

// 如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。

// 如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

// 看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。

// async/await 帮我们干了啥
// 作个简单的比较
// 上面已经说明了 async 会将其后的函数（函数表达式或 Lambda）的返回值封装成一个 Promise 对象，而 await 会等待这个 Promise 完成，并将其 resolve 的结果返回出来。

// 现在举例，用 setTimeout 模拟耗时的异步操作，先来看看不用 async/await 会怎么写

function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

takeLongTime().then(v => {
    console.log("got", v);
});
// 如果改用 async/await 呢，会是这样

function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

async function test() {
    const v = await takeLongTime();
    console.log(v);
}

test();
// 眼尖的同学已经发现 takeLongTime() 没有申明为 async。实际上，takeLongTime() 本身就是返回的 Promise 对象，加不加 async 结果都一样，如果没明白，请回过头再去看看上面的“async 起什么作用”。

// 又一个疑问产生了，这两段代码，两种方式对异步调用的处理（实际就是对 Promise 对象的处理）差别并不明显，甚至使用 async/await 还需要多写一些代码，那它的优势到底在哪？

// async/await 的优势在于处理 then 链
// 单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then 链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它）。

// 假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用 setTimeout 来模拟异步操作：

/**
 * 传入参数 n，表示这个函数执行的时间（毫秒）
 * 执行的结果是 n + 200，这个值将用于下一步骤
 */
function takeLongTime(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve(n + 200), n);
    });
}

function step1(n) {
    console.log(`step1 with ${n}`);
    return takeLongTime(n);
}

function step2(n) {
    console.log(`step2 with ${n}`);
    return takeLongTime(n);
}

function step3(n) {
    console.log(`step3 with ${n}`);
    return takeLongTime(n);
}
// 现在用 Promise 方式来实现这三个步骤的处理

function doIt() {
    console.time("doIt");
    const time1 = 300;
    step1(time1)
        .then(time2 => step2(time2))
        .then(time3 => step3(time3))
        .then(result => {
            console.log(`result is ${result}`);
            console.timeEnd("doIt");
        });
}

doIt();
// step1 with 300
// step2 with 500
// step3 with 700
// result is 900
// doIt: 1507.251ms
// 输出结果 result 是 step3() 的参数 700 + 200 = 900。doIt() 顺序执行了三个步骤，一共用了 300 + 500 + 700 = 1500 毫秒，和 console.time()/console.timeEnd() 计算的结果一致。

// 如果用 async/await 来实现呢，会是这样

async function doIt() {
    console.time("doIt");
    const time1 = 300;
    const time2 = await step1(time1);
    const time3 = await step2(time2);
    const result = await step3(time3);
    console.log(`result is ${result}`);
    console.timeEnd("doIt");
}

doIt();
// 结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，几乎跟同步代码一样

// 除了觉得执行时间变长了之外，似乎和之前的示例没啥区别啊！别急，认真想想如果把它写成 Promise 方式实现会是什么样子？

function doIt() {
    console.time("doIt");
    const time1 = 300;
    step1(time1)
        .then(time2 => {
            return step2(time1, time2)
                .then(time3 => [time1, time2, time3]);
        })
        .then(times => {
            const [time1, time2, time3] = times;
            return step3(time1, time2, time3);
        })
        .then(result => {
            console.log(`result is ${result}`);
            console.timeEnd("doIt");
        });
}

doIt();
// 没有感觉有点复杂的样子？那一堆参数处理，就是 Promise 方案的死穴—— 参数传递太麻烦了，看着就晕！
//     },
// }
</script>