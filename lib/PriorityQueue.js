/**
 * @class Priority queue - elements are sorted according to their value 
 * @constructor
 * @type object
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 *
 * @todo manipulate using arrays not objects
 * queue: [1,2,3,4]
 * priorities: [4,1,2,3]
 * -----
 * result = [1,4,2,3]
 * 
 * @param {array} elements
 * @param {array} priorities
 * @param {string} sorting - asc / desc
 * @returns {PriorityQueue}
 */
var PriorityQueue = function(elements, priorities, sorting) {
    this.init(elements, priorities, sorting);
};

PriorityQueue.prototype = {

    /**
     * Initialize queue from given elements
     *
     * @param {array} elements
     * @param {array} priorities
     * @returns {void}
     * @access public
     */
    init: function(elements, priorities, sorting) {
        this._queue = [];
        this._priorities = [];
        this._sorting = sorting || 'desc'; // by descending priority
        if (elements && priorities) {
            if (elements.length !== priorities.length)
               throw new Error('Elements and priorities arrays must have the same length');
            for (var i = 0; i < elements.length; i++)
                this.insert(elements[i], priorities[i]);
        }
    },

    /**
     * Insert element
     *
     * @param {object} ele
     * @param {object} priority
     * @returns {void}
     * @access public
     */
    insert: function (ele, priority) {
        var indexToInsert = this._queue.length;
        
        for (var index = this._queue.length - 1; index >= 0; index--) {
            var priority2 = this._priorities[index];
            if (this._sorting === 'desc') {
                if (priority > priority2)
                    indexToInsert = index;
            } else {
                if (priority < priority2)
                    indexToInsert = index;
            }
        }

        this._insertAt(ele, priority, indexToInsert);
    },

    /**
     * Remove element
     *
     * @param {object} ele
     * @returns {void}
     * @access public
     */
    remove: function (ele) {
        var length = this._queue.length;

        for (var index = 0; index < length; index++) {
            var ele2 = this._queue[index];
            var priority2 = this._priorities[index];
            if (ele === ele2) {
                this._queue.splice(index, 1);
                this._priorities.splice(index, 1);
                break;
            }
        }
    },
    
    /**
     * Insert element at given position
     *
     * @todo refactoring
     * @param {object} ele
     * @param {integer} index
     * @returns {void}
     * @access protected
     */
    _insertAt: function (ele, priority, index) {
        if (this._queue.length === index) {
            this._queue.push(ele);
            this._priorities.push(priority);
        } else {
            this._queue.splice(index, 0, ele);
            this._priorities.splice(index, 0, priority);
        }
    },

    /**
     * For each loop wrapper
     *
     * @param {callable} func
     * @returs {void}
     * @access public
     */
    forEach: function (func) {
        this._queue.forEach(func);
    },

    /**
     * @returns {array}
     * @access public
     */
    getElements: function () {
        return this._queue;
    },
    
    /**
     * @param {integer} index
     * @returns {object}
     * @access public
     */
    getElementPriority: function(index) {
        return this._priorities[index];
    },
    
    /**
     * @returns {array}
     * @access public
     */
    getPriorities: function () {
        return this._priorities;
    },
    
    /**
     * @returns {array}
     * @access public
     */
    getElementsWithPriorities: function () {
        var result = [];
        
        for (var i = 0; i < this._queue.length; i++)
            result.push([this._queue[i], this._priorities[i]]);
            
        return result;
    }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = PriorityQueue;