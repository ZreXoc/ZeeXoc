import React, {Component} from "react";

const LBasic = {
    /**
     *
     * @param {DOM} dragEle.container - 拖拽体
     * @param {DOM} [dragEle.handler = body] - 拖拽把手
     * @param {DOM} [dragEle.parent = body.parent] - 父级区域
     * @param {boolean,string} dragEle.dragType - 拖拽类型:true||false||"return"
     */
    setDrag: function (dragEle) {
        const dContainer = dragEle.container;
        const dHandler = dragEle.handler || dContainer;
        const dParent = dragEle.parent || dContainer.parentNode;
        let draggable
        switch (dragEle.dragType) {
            case false:
                draggable = false;
                break;
            default:
                draggable=true
        }
        let sent = {
            l: dParent.left||0,
            r: dParent.offsetWidth - dContainer.offsetWidth,
            t: dParent.top||0,
            b: dParent.offsetHeight - dContainer.offsetHeight,
            n: 10
        }
        let isDrag;
        let sentX;
        let sentY;
        let dmW;
        let dmH;
        dHandler.addEventListener('mousedown',function (e){
            if (!draggable) return;
            e.stopPropagation();
            isDrag=true
            sentX = e.clientX - dContainer.offsetLeft;
            sentY = e.clientY - dContainer.offsetTop;
            dmW = document.documentElement.clientWidth || document.body.clientWidth;
            dmH = document.documentElement.clientHeight || document.body.clientHeight;
            sent.r = sent.r || dmW - dContainer.offsetWidth;
            sent.t = sent.t;
            sent.b = sent.b || dmH - dContainer.offsetHeight;
            sent.n = sent.n;
            document.addEventListener('mousemove', function (e) {
                if (!isDrag) return;

                let slideLeft = e.clientX - sentX;
                let slideTop = e.clientY - sentY;


                if (slideLeft <= sent.l) {
                    slideLeft = sent.l;
                }
                if (slideLeft >= sent.r) {
                    slideLeft = sent.r;
                }
                if (slideTop <= sent.t) {
                    slideTop = sent.t;
                }
                if (slideTop >= sent.b) {
                    slideTop = sent.b;
                }

                dContainer.style.left = slideLeft + 'px';
                dContainer.style.top = slideTop + 'px';
            });
        });
        document.addEventListener('mouseup',function() {
            isDrag=false;
            if(dragEle.dragType=='return') {
                dContainer.style.left = sentX + 'px';
                dContainer.style.top = sentY + 'px';
            }
        });
    }
}
export default LBasic;

