var MoveScript = new function() {

    var dragObject = {};
    var self = this;

    function MouseDown(obj) {

        if (obj.which != 1) return; //нажали др кнопкой мыши

        var elem = obj.target.closest('.draggable');
        if (!elem)   //коробки нету
            return;
        dragObject.elem =elem; //запомнили саму коробку которую тащим
        dragObject.botX = obj.pageX;//забираем координаты в момент клика
        dragObject.botY = obj.pageY;

        return false;
    }


    function MouseMove(obj) {
        if(!dragObject.elem)
            return;
        if (!dragObject.carry){ //если нету то создай
            dragObject.carry = Create(obj)
            if (!dragObject.carry){ //не создал значит и не надо, отмена операции
                dragObject = {};
                return;
            }
            var XoY = getCoord(dragObject.carry);
            dragObject.moveX =dragObject.botX - XoY.left;
            dragObject.moveY = dragObject.botY - XoY.top;
            DoCarryBox(obj);
        }
        dragObject.carry.style.left = obj.pageX - dragObject.moveX + 'px';
        dragObject.carry.style.top = obj.pageY - dragObject.moveY + 'px';
        return false;
    }
    
    function Create(obj) {
        var carry = dragObject.elem;
        var ZeroPoint = {
            parent : carry.parentNode, nextSibling : carry.nextSibling, position: carry.pos || '',
            left: carry.left || '', top: carry.top || '', zIndex: carry.zIndex || ''};
        carry.getback = function () {
            ZeroPoint.parent.insertBefore(carry, ZeroPoint.nextSibling);
            carry.style.position = ZeroPoint.position;
            carry.style.left = ZeroPoint.left;
            carry.style.top = ZeroPoint.top;
            carry.style.zIndex = ZeroPoint.zIndex;
        };
        return carry;
    }
    
    function DoCarryBox(obj) {
        var carry = dragObject.carry;
        document.body.appendChild(carry);
        carry.style.zIndex = 9999;
        carry.style.position ='absolute';
    }


    function MouseUp(obj) {
        if (dragObject.carry){
            var Dropplace = FindPlace(obj);
            if (Dropplace) {
                self.MoveEnd(dragObject, Dropplace);
            } else {
                self.NotRightMove(Dropplace);
            }
        }
        dragObject = {};
    }

    function FindPlace(event) {
        dragObject.carry.hidden = true;
        var elem =document.elementFromPoint(event.clientX, event.clientY);
        dragObject.carry.hidden = false;
        if(elem == null)
            return null;
        return elem.closest('.droppable');
    }


        document.onmousemove = MouseMove;
        document.onmouseup = MouseUp;
        document.onmousedown = MouseDown;


    this.MoveEnd = function(dragObject, Dropplace) { };
    this.NotRightMove = function(dragObject) { };
};
function getCoord(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}