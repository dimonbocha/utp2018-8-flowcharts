var MoveScript = new function() {

    var Object = {};
    var self = this;

    function MouseDown(obj) {
        var box = obj.target.closest('.draggable');
        if (!box)   //коробки нету
            return;
        Object.box =box; //запомнили саму коробку которую тащим
        Object.botX = obj.botX;//забираем координаты в момент клика
        Object.botY = obj.botY;
        return false;

    }


    function MouseMove(obj) {
        if(!Object.box)
            return;
        if (!Object.carry){ //если нету то создай
            Object.carry = Create(obj)
            if (!Object.carry){ //не создал значит и не надо, отмена операции
                Object = {};
                return;
            }
            var XoY = getCoord(Object.carry);
            Object.moveX =Object.botX - XoY.left;
            Object.moveY = Object.botY - XoY.top;
            DoCarryBox(obj);
        }
        Object.box.style.left = obj.botX - Object.moveX + 'px';
        Object.box.style.top = obj.botY - Object.moveY + 'px';
        return false;
    }
    
    function Create(obj) {
        var carry = Object.box;
        var ZeroPoint = {
            parent : carry.parentNode, nextSubling : carry.nextSubling, pos: carry.pos || '',
            left: carry.left || '', top: carry.top || '', ZI: carry.ZI || ''};
        carry.getback = function () {
            ZeroPoint.parent.insertBefore(carry, ZeroPoint.nextSubling);
            carry.style.pos = ZeroPoint.pos;
            carry.style.left = ZeroPoint.left;
            carry.style.top = ZeroPoint.top;
            carry.style.ZI = ZeroPoint.ZI;
        };
        return carry;
    }
    
    function DoCarryBox(obj) {
        var carry = Object.carry;
        document.body.appendChild(carry);
        carry.style.ZI = 9999;
        carry.style.pos ='absolute';
    }


    function MouseUp(obj) {
        if (Object.carry){
            var Dropplace = FindPlace(obj);
            if (Dropplace) {
                self.MoveEnd(Object, Dropplace);
            } else {
                self.NotRightMove(Dropplace);
            }
        }
        Object = {};
    }

    function FindPlace(smth) {
        Object.carry.hidden = true;
        var elem =document.elementFromPoint(smth.clientX, smth.clientY);
        Object.carry.hidden = false;
        if(elem == null)
            return null;
        return elem.closest('.droppable');
    }


        document.mousemove = MouseMove;
        document.mouseup = MouseUp;
        document.mousedown = MouseDown;


    this.MoveEnd = function(Object, Dropplace) { };
    this.NotRightMove = function(Object) { };
}
function getCoord(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    }
}