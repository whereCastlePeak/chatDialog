/*
 * Author: 何处青山
 * Email: ui_hyl@163.com
 * date: 2017/10/13 22:30
 */
(function(factory){
    // config
    window.CHAT_CONFIG = {
        /*
         * position 位置 可选left/center/right
         * icon 图标ID;
         * info 图标紧跟的信息;
         */
        head: [
            {'position':'left','icon':'back','href':'/'},
            {'position':'center','icon':'','info':'聊天窗口'},
            {'position':'right','icon':'user','href':'#user1'}
        ]
    };
    // run
    factory();
})(function(){
    'use strict';
    const win = window;
    const doc = win.document;
    /*构造函数*/
    let Chat = function(selector){
        return new Chat.fn.init(selector);
    };
    Chat.fn = Chat.prototype = {
        init : function(selector){
            var nodes = document.querySelectorAll(selector);
            var i = 0,len = nodes.length;
            for (; i < len; i++) {
                this[i] = nodes[i];
            }
            this.length = len;
            return this;
        },
        load : function(){
            Chat.load(this[0]);
            return this;
        },
        push : [].push,
        sort : [].sort,
        splice : [].splice,
        slice : [].slice
    };
    Chat.fn.init.prototype = Chat.fn;
    //挂载到window
    win.Chat = Chat;
    /*640为稿*/
    /*载入容器*/
    Chat.load = function(elm){
        let head = window.CHAT_CONFIG.head;
        let _doc = doc.createDocumentFragment();
        let box = doc.createElement("section");
        let content = elm || doc.body;
        let dev = content.clientWidth > 640 ? 640 : content.clientWidth;

        box.id = "chat";
        box.style.fontSize = dev/6.4 + 'px';
        box.innerHTML = `
    <div class="head">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right"></div>
    </div>
    <div class="content">
        <div class="news left">
            <a><svg><use xlink:href="svg/icons.svg#farm"></use></svg></a>
            <p>一段信息</p>
        </div>
        <div class="news right">
            <a><svg><use xlink:href="svg/icons.svg#Nile"></use></svg></a>
            <p>很长的很长的很长的很长的很长的很长的很长的很长的很长的另一段信息</p>
        </div>
    </div>
    <div class="foot">
        <div class="import">
            <p contenteditable="true" id="message"></p>
            <input id="send" type="button" value="发送" disabled="disabled">
        </div>
    </div>
    `;
        /*载入文档片段*/
        _doc.appendChild(box);

        /*遍历配置-载入头部*/
        for (let i = 0; i < head.length; i++) {
            let link = doc.createElement("a");
            let span = doc.createElement("span");
            if(head[i].icon){
                head[i].href ? link.href = head[i].href : "";
                link.innerHTML = '<svg><use xlink:href="svg/icons.svg#'+head[i].icon+'"></use></svg>';
            }
            switch(head[i].position){
                case "left":
                case "center":
                    if(head[i].info){
                        span.innerText = head[i].info;
                        link.appendChild(span);
                    }
                    _doc.querySelector("div."+head[i].position).appendChild(link);
                    break;
                case "right":
                    if(head[i].info){
                        span.innerText = head[i].info;
                        // 文字在左，图标在右
                        link.firstChild ? link.insertBefore(span,link.firstChild) : link.appendChild(span);
                    }
                    _doc.querySelector("div."+head[i].position).appendChild(link);
                    break;
            }
        }
        // 容器为body还是其他
        (content != doc.body) && (win.getComputedStyle(content).position == 'static') ? (content.style.position = 'relative') : null;
        // 按钮输入信息时变色
        let mes_el = _doc.getElementById('message');
        mes_el.oninput = function(e){
            if(this.innerText == ''){
                this.ownerDocument.getElementById('send').disabled = 'disabled';
            }else{
                this.ownerDocument.getElementById('send').disabled = '';
            }
        };
        let socket = new WebSocket('ws://localhost:8181');
        socket.onopen = function(e){
            console.log('已连接！');
        };
        socket.onmessage = function(e){
            console.log('返回信息：'+e.data);
        };
        socket.onclose = function(e){
            console.log('连接已断开！');
        };
        socket.onerror = function(e){
            console.log('发生错误！');
        };
        //发送
        _doc.getElementById('send').onclick = function(e){
            let mes_frag = doc.createDocumentFragment();
            let box = doc.createElement('div');
            box.className = 'news right';
            box.innerHTML = '<a><svg><use xlink:href="svg/icons.svg#Nile"></use></svg></a>\
            <p class="loading">'+mes_el.innerText+'</p>';
            mes_frag.appendChild(box);
            //添加到信息框
            doc.querySelector('.content').appendChild(mes_frag);
            //发送
            socket.send(mes_el.innerText);
            // console.log(mes_frag);
        };
        content.appendChild(_doc);
    };
});
Chat('body').load();
