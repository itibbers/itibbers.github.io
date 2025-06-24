---
title: 浏览器及HTTP缓存机制
categories:
  - frontend
tags:
  - 浏览器
  - http
  - 缓存
date: 2018-07-26 15:02:32
---

Web 缓存是一种保存 Web 资源副本并在下次请求时直接使用该副本的技术。缓存=请求资源的副本

Web 缓存可以分为这几种：浏览器缓存、CDN 缓存、服务器缓存、数据库数据缓存 。因为可能会直接使用副本免于重新发送请求或者仅仅确认资源没变无需重新传输资源实体，Web 缓存具有以下优点：

- 可以减少延迟加快网页打开速度
- 重复利用资源减少网络带宽消耗
- 降低请求次数或者减少传输内容从而减轻服务器压力。

<!--more-->

[TOC]

这篇文章主要讨论和前端密切相关的浏览器 HTTP 缓存机制。浏览器 HTTP 缓存可以分为强缓存和协商缓存。强缓存和协商缓存最大也是最根本的区别是：强缓存命中的话不会发请求到服务器（比如 chrome 中的 200 from memory cache），协商缓存一定会发请求到服务器，通过资源的请求首部字段验证资源是否命中协商缓存，如果协商缓存命中，服务器会将这个请求返回，但是不会返回这个资源的实体，而是通知客户端可以从缓存中加载这个资源（304 not modified）。简略流程图如下：

![](https://ws1.sinaimg.cn/large/006tKfTcly1ftnafr9qk3j30tq0f5400.jpg)

## 1 浏览器 HTTP 缓存由 HTTP 报文的首部字段决定

![](https://ws3.sinaimg.cn/large/006tKfTcly1ftnagybj4hj30ea08twem.jpg)

1. http header 中与缓存有关的 key
   ![](https://ws4.sinaimg.cn/large/006tKfTcly1ftnahvfa0kj31420fi77l.jpg)

2. 缓存协商策略用于重新验证缓存资源是否有效，有关的 key
   ![](https://ws1.sinaimg.cn/large/006tKfTcly1ftnais0iauj314c0fqtbt.jpg)

### 1.1 控制强缓存的字段按优先级介绍

1. Pragma
   Pragma 是 HTTP/1.1 之前版本遗留的通用首部字段，仅作为于 HTTP/1.0 的向后兼容而使用。虽然它是一个通用首部，但是它在响应报文中时的行为没有规范，依赖于浏览器的实现。RFC 中该字段只有 no-cache 一个可选值，会通知浏览器不直接使用缓存，要求向服务器发请求校验新鲜度。因为它优先级最高，当存在时一定不会命中强缓存。目前基本不使用。

2. Cache-Control
   Cache-Control 是一个通用首部字段，也是 HTTP/1.1 控制浏览器缓存的主流字段。
   浏览器缓存里, Cache-Control 是金字塔顶尖的规则, 它藐视一切其他设置, 只要其他设置与其抵触, 一律覆盖之.

不仅如此, 它还是一个复合规则, 包含多种值, 横跨 存储策略, 过期策略 两种, 同时在请求头和响应头都可设置.

语法为: “Cache-Control : cache-directive”.

Cache-directive 共有如下 12 种(其中请求中指令 7 种, 响应中指令 9 种):

![](https://ws3.sinaimg.cn/large/006tKfTcly1ftnal0pg00j31630elwjq.jpg)

- max-age（单位为 s）设置缓存的存在时间，相对于发送请求的时间。只有响应报文首部设置 Cache-Control 为非 0 的 max-age 才有可能命中强缓存。当满足这个条件，同时响应报文首部中 Cache-Control 不存在 no-cache、no-store 且请求报文首部不存在 Pragma 字段，才会真正命中强缓存。

- no-cache 表示请求必须先与服务器确认缓存的有效性，如果有效才能使用缓存（协商缓存），无论是响应报文首部还是请求报文首部出现这个字段均一定不会命中强缓存。Chrome 硬性重新加载（Command+shift+R）会在请求的首部加上 Pragma：no-cache 和 Cache-Control：no-cache。

- no-store 表示禁止浏览器以及所有中间缓存存储任何版本的返回响应，一定不会出现强缓存和协商缓存，适合个人隐私数据或者经济类数据。

- public 表明响应可以被浏览器、CDN 等等缓存。

- private 响应只作为私有的缓存，不能被 CDN 等缓存。如果要求 HTTP 认证，响应会自动设置为 private。

![](https://ws1.sinaimg.cn/large/006tKfTcly1ftnamm7mgfj30gj0got8q.jpg)
图：Cache-Control 策略优先级

Cache-Control 允许自由组合可选值，例如：

```
Cache-Control: max-age=3600, must-revalidate
```

它意味着该资源是从原服务器上取得的，且其缓存（新鲜度）的有效时间为一小时，在后续一小时内，用户重新访问该资源则无须发送请求。 当然这种组合的方式也会有些限制，比如 no-cache 就不能和 max-age、min-fresh、max-stale 一起搭配使用。

3.Expires 是 HTTP/1.1 之前版本遗留的通用首部字段，仅作为于 HTTP/1.0 的向后兼容而使用。

即到期时间, 以服务器时间为参考系, 其优先级比 Cache-Control:max-age 低, 两者同时出现在响应头时, Expires 将被后者覆盖. 如果 Expires, Cache-Control: max-age, 或 Cache-Control:s-maxage 都没有在响应头中出现, 并且也没有其它缓存的设置, 那么浏览器默认会采用一个启发式的算法, 通常会取响应头的 Date_value - Last-Modified_value 值的 10%作为缓存时间.

如下资源便采取了启发式缓存算法.
![](https://ws2.sinaimg.cn/large/006tKfTcly1ftnanz8dl3j30m3028wem.jpg)

其缓存时间为 (Date_value - Last-Modified_value) \* 10%, 计算如下:

```
const Date_value = new Date('Thu, 06 Apr 2017 01:30:56 GMT').getTime();
const LastModified_value = new Date('Thu, 01 Dec 2016 06:23:23 GMT').getTime();
const cacheTime = (Date_value - LastModified_value) / 10;
const Expires_timestamp = Date_value + cacheTime;
const Expires_value = new Date(Expires_timestamp);
console.log('Expires:', Expires_value); // Expires: Tue Apr 18 2017 23:25:41 GMT+0800 (CST)
```

可见该资源将于 2017 年 4 月 18 日 23 点 25 分 41 秒过期, 尝试以下两步进行验证:

1. 试着把本地时间修改为 2017 年 4 月 18 日 23 点 25 分 40 秒, 迅速刷新页面, 发现强缓存依然有效(依旧是 200 OK (from disk cache)).

2. 然后又修改本地时间为 2017 年 4 月 18 日 23 点 26 分 40 秒(即往后拨 1 分钟), 刷新页面, 发现缓存已过期, 此时浏览器重新向服务器发起了验证, 且命中了 304 协商缓存, 如下所示.

![](https://ws1.sinaimg.cn/large/006tKfTcly1ftnaon5w6vj30lm059js8.jpg)

3. 将本地时间恢复正常(即 2017-04-06 09:54:19). 刷新页面, 发现 Date 依然是 4 月 18 日, 如下所示.

![](https://ws1.sinaimg.cn/large/006tKfTcly1ftnap0d3a4j30nb093tai.jpg)

从 ⚠️ Provisional headers are shown 和 Date 字段可以看出来, 浏览器并未发出请求, 缓存依然有效, 只不过此时 Status Code 显示为 200 OK. (甚至我还专门打开了 charles, 也没有发现该资源的任何请求, 可见这个 200 OK 多少有些误导人的意味)

可见, 启发式缓存算法采用的缓存时间可长可短, 因此对于常规资源, 建议明确设置缓存时间(如指定 max-age 或 expires).

### 1.2 控制协商缓存的字段

上述的首部字段均能让客户端决定是否向服务器发送请求，比如设置的缓存时间未过期，那么自然直接从本地缓存取数据即可（在 chrome 下表现为 200 from cache），若缓存时间过期了或资源不该直接走缓存，则会发请求到服务器去。
我们现在要说的问题是，**如果客户端向服务器发了请求，那么是否意味着一定要读取回该资源的整个实体内容呢？**
我们试着这么想——客户端上某个资源保存的缓存时间过期了，但这时候其实服务器并没有更新过这个资源，如果这个资源数据量很大，客户端要求服务器再把这个东西重新发一遍过来，是否非常浪费带宽和时间呢？
答案是肯定的，那么是否有办法让服务器知道客户端现在存有的缓存文件，其实跟自己所有的文件是一致的，然后直接告诉客户端说“这东西你直接用缓存里的就可以了，我这边没更新过呢，就不再传一次过去了”。
举例来说：

```
C：小服，你几岁了？
S：小客，我18岁了。
=================================
C：小服 ，你几岁了？我猜你18岁了。
S：靠，你知道还问我？（304）
=================================
C：小服 ，你几岁了？我猜你18岁了。
S：小客 ，我19岁了。（200）
```

为了让客户端与服务器之间能实现缓存文件是否更新的验证、提升缓存的复用率，Http1.1 新增了几个首部字段来做这件事情。

![](https://ws2.sinaimg.cn/large/006tKfTcly1ftnaq12rn7j30dz04imx2.jpg)

1. Last-Modified/If-Modified-Since
   If-Modified-Since 是一个请求首部字段，并且只能用在 GET 或者 HEAD 请求中。
   Last-Modified 是一个响应首部字段，包含服务器认定的资源作出修改的日期及时间。
   当带着 If-Modified-Since 头访问服务器请求资源时，服务器会检查 Last-Modified，如果 Last-Modified 的时间早于或等于 If-Modified-Since 则会返回一个不带主体的 304 响应，否则将重新返回资源。
   If-Modified-Since: , :: GMT Last-Modified: , :: GMT

2. ETag/If-None-Match

ETag 是一个响应首部字段，它是根据实体内容生成的一段 hash 字符串，标识资源的状态，由服务端产生。

If-None-Match 是一个条件式的请求首部。如果请求资源时在请求首部加上这个字段，值为之前服务器端返回的资源上的 ETag，则当且仅当服务器上没有任何资源的 ETag 属性值与这个首部中列出的时候，服务器才会返回带有所请求资源实体的 200 响应，否则服务器会返回不带实体的 304 响应。ETag 优先级比 Last-Modified 高，同时存在时会以 ETag 为准。

If-None-Match: <etag_value> If-None-Match: <etag_value>, <etag_value>, … If-None-Match: \*

ETag 属性之间的比较采用的是弱比较算法，即两个文件除了每个比特都相同外，内容一致也可以认为是相同的。例如，如果两个页面仅仅在页脚的生成时间有所不同，就可以认为二者是相同的。

因为 ETag 的特性，所以相较于 Last-Modified 有一些优势：

1.  某些情况下服务器无法获取资源的最后修改时间
2.  资源的最后修改时间变了但是内容没变，使用 ETag 可以正确缓存
3.  如果资源修改非常频繁，在秒以下的时间进行修改，Last-Modified 只能精确到秒

## 2 http 其他字段

### 2.1 Age

出现此字段, 表示命中代理服务器的缓存. 它指的是代理服务器对于请求资源的已缓存时间, 单位为秒. 如下:

```
Age:2383321
Date:Wed, 08 Mar 2017 16:12:42 GMT
```

以上指的是, 代理服务器在 2017 年 3 月 8 日 16:12:42 时向源服务器发起了对该资源的请求, 目前已缓存了该资源 2383321 秒.

### 2.2 Date

指的是响应生成的时间. 请求经过代理服务器时, 返回的 Date 未必是最新的, 通常这个时候, 代理服务器将增加一个 Age 字段告知该资源已缓存了多久.

### 2.3 Vary

对于服务器而言, 资源文件可能不止一个版本, 比如说压缩和未压缩, 针对不同的客户端, 通常需要返回不同的资源版本. 比如说老式的浏览器可能不支持解压缩, 这个时候, 就需要返回一个未压缩的版本; 对于新的浏览器, 支持压缩, 返回一个压缩的版本, 有利于节省带宽, 提升体验. 那么怎么区分这个版本呢, 这个时候就需要 Vary 了.
服务器通过指定 Vary: Accept-Encoding, 告知代理服务器, 对于这个资源, 需要缓存两个版本: 压缩和未压缩. 这样老式浏览器和新的浏览器, 通过代理, 就分别拿到了未压缩和压缩版本的资源, 避免了都拿同一个资源的尴尬.

```
Vary:Accept-Encoding,User-Agent
```

如上设置, 代理服务器将针对是否压缩和浏览器类型两个维度去缓存资源. 如此一来, 同一个 url, 就能针对 PC 和 Mobile 返回不同的缓存内容.

## 3 缓存头部对比

![](https://ws4.sinaimg.cn/large/006tKfTcly1ftnasbu6u5j31dy0xeds0.jpg)

## 4 用户刷新/访问行为

![](https://ws2.sinaimg.cn/large/006tKfTcly1ftnau6q6gcj30vy0dcabl.jpg)

## 5 缓存实践

综上对各种 HTTP 缓存控制头部的对比以及用户可能出现的浏览器刷新行为的讨论，当我们在一个项目上做 http 缓存的应用时，我们实际上还是会把上述提及的大多数首部字段均使用上。

### 5.1 Expires / Cache-Control

Expires 用时刻来标识失效时间，不免收到时间同步的影响，而 Cache-Control 使用时间间隔很好的解决了这个问题。 但是 Cache-Control 是 HTTP1.1 才有的，不适用于 HTTP1.0，而 Expires 既适用于 HTTP1.0，也适用于 HTTP1.1，所以说在大多数情况下同时发送这两个头会是一个更好的选择，当客户端两种头都能解析的时候，会优先使用 Cache-Control。

### 5.2 Last-Modified / ETag

二者都是通过某个标识值来请求资源， 如果服务器端的资源没有变化，则自动返回 HTTP 304 （Not Changed）状态码，内容为空，这样就节省了传输数据量。而当资源发生比那话后，返回和第一次请求时类似。从而保证不向客户端重复发出资源，也保证当服务器有变化时，客户端能够得到最新的资源。
其中 Last-Modified 使用文件最后修改作为文件标识值，它无法处理文件一秒内多次修改的情况，而且只要文件修改了哪怕文件实质内容没有修改，也会重新返回资源内容；ETag 作为“被请求变量的实体值”，其完全可以解决 Last-Modified 头部的问题，但是其计算过程需要耗费服务器资源。

### 5.3 from-cache / 304

Expires 和 Cache-Control 都有一个问题就是服务端作为的修改，如果还在缓存时效里，那么客户端是不会去请求服务端资源的（非刷新），这就存在一个资源版本不符的问题，而强制刷新一定会发起 HTTP 请求并返回资源内容，无论该内容在这段时间内是否修改过；而 Last-Modified 和 Etag 每次请求资源都会发起请求，哪怕是很久都不会有修改的资源，都至少有一次请求响应的消耗。
对于所有可缓存资源，指定一个 Expires 或 Cache-Control max-age 以及一个 Last-Modified 或 ETag 至关重要。同时使用前者和后者可以很好的相互适应。
前者不需要每次都发起一次请求来校验资源时效性，后者保证当资源未出现修改的时候不需要重新发送该资源。而在用户的不同刷新页面行为中，二者的结合也能很好的利用 HTTP 缓存控制特性，无论是在地址栏输入 URI 然后输入回车进行访问，还是点击刷新按钮，浏览器都能充分利用缓存内容，避免进行不必要的请求与数据传输。

### 5.4 避免 304

同学们是否还记得我们在讨论用户刷新页面行为中体积的 index.css 文件，它实际上被命名为 index.03d344bd.css。而细心的同学也会发现它的 Expires 和 Cache-Control 时间出奇的长，这难道不会导致用户无法得到其最近的内容吗？

其做法实际上很简单，它把服务侧 ETag 的那一套理论搬到了前端来使用。 页面的静态资源以版本形式发布，常用的方法是在文件名或参数带上一串 md5 或时间标记符：

```
https://hm.baidu.com/hm.js?e23800c454aa573c0ccb16b52665ac26
http://tb1.bdstatic.com/tb/_/tbean_safe_ajax_94e7ca2.js
http://img1.gtimg.com/ninja/2/2016/04/ninja145972803357449.jpg
```

可以看到上面的例子中有不同的做法，有的在 URI 后面加上了 md5 参数，有的将 md5 值作为文件名的一部分，有的将资源放在特性版本的目录中。
那么在文件没有变动的时候，浏览器不用发起请求直接可以使用缓存文件；而在文件有变化的时候，由于文件版本号的变更，导致文件名变化，请求的 url 变了，自然文件就更新了。这样能确保客户端能及时从服务器收取到新修改的文件。通过这样的处理，增长了静态资源，特别是图片资源的缓存时间，避免该资源很快过期，客户端频繁向服务端发起资源请求，服务器再返回 304 响应的情况（有 Last-Modified/Etag）。

### 5.5 Tips

- 需要兼容 HTTP1.0 的时候需要使用 Expires，不然可以考虑直接使用 Cache-Control
- 需要处理一秒内多次修改的情况，或者其他 Last-Modified 处理不了的情况，才使用 ETag，否则使用 Last-Modified。
- 对于所有可缓存资源，需要指定一个 Expires 或 Cache-Control，同时指定 Last-Modified 或者 Etag。
- 可以通过标识文件版本名、加长缓存时间的方式来减少 304 响应。

## 6 问题及解决方案

1. 什么时候该设置缓存？

2. 前端如何有效设置缓存？

3. 开发中如何避免缓存？

4. 既生 Last-Modified，何生 E-tag？

5. 假设所请求资源于 4 月 5 日缓存, 且在 4 月 12 日过期.
   当 max-age 与 max-stale 和 min-fresh 同时使用时, 它们的设置相互之间独立生效, 最为保守的缓存策略总是有效. 这意味着, 如果 max-age=10 days, max-stale=2 days, min-fresh=3 days, 那么:
   由于客户端总是采用最保守的缓存策略, 因此, 4 月 9 日后, 对于该资源的请求将重新向服务器发起验证.

答案：

1. 根据缓存的作用及具体需求场景设置。

2. [1.1 控制强缓存的字段按优先级介绍](http://wiki.xiaodutv.com/pages/viewpage.action?pageId=17173670#1.1%20%E6%8E%A7%E5%88%B6%E5%BC%BA%E7%BC%93%E5%AD%98%E7%9A%84%E5%AD%97%E6%AE%B5%E6%8C%89%E4%BC%98%E5%85%88%E7%BA%A7%E4%BB%8B%E7%BB%8D)

3. [用户刷新/访问行为](http://wiki.xiaodutv.com/pages/viewpage.action?pageId=17173670#4%20%E7%94%A8%E6%88%B7%E5%88%B7%E6%96%B0/%E8%AE%BF%E9%97%AE%E8%A1%8C%E4%B8%BA)

4. 既生 Last-Modified，何生 E-tag？

你可能会觉得使用 Last-Modified 已经足以让浏览器知道本地的缓存副本是否足够新，为什么还需要 Etag（实体标识）呢？

HTTP1.1 中 Etag 的出现主要是为了解决几个 Last-Modified 比较难解决的问题：

a. Last-Modified 标注的最后修改只能精确到秒级，如果某些文件在 1 秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间

b. 如果某些文件会被定期生成，当有时内容并没有任何变化，但 Last-Modified 却改变了，导致文件没法使用缓存

c. 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形

Etag 是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。Last-Modified 与 ETag 是可以一起使用的，服务器会优先验证 ETag，一致的情况下，才会继续比对 Last-Modified，最后才决定是否返回 304。

## 7 参考

[HTTP 缓存 - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ)
[浏览器缓存机制](http://wiki.xiaodutv.com/pages/viewpage.action?pageId=9963820)
[浏览器 HTTP 缓存机制](https://juejin.im/post/5a673af06fb9a01c927ed880)
[浏览器缓存机制剖析](http://louiszhai.github.io/2017/04/07/http-cache/)
[彻底弄懂 Http 缓存机制 - 基于缓存策略三要素分解法](https://mp.weixin.qq.com/s?__biz=MzA3NTYzODYzMg==&mid=2653578381&idx=1&sn=3f676e2b2e08bcff831c69d31cf51c51)
[Header Field Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)
[超文本传输协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)
[前端必须知道的 http 缓存](https://github.com/Pines-Cheng/blog/issues/5)

---

[🔝 回到顶部](#)
