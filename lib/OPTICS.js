/**
 * @class OPTICS - Ordering points to identify the clustering structure
 * @constructor
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * 
 * @param {array} dataset
 * @param {integer|float} epsilon
 * @param {integer} minPts
 * @param {callable} distanceFunction
 * @returns {OPTICS}
 */
function OPTICS(dataset, epsilon, minPts, distanceFunction) {
    this.init(dataset, epsilon, minPts, distanceFunction);
}

OPTICS.prototype = {
    
    /**
     * Set object properties
     * @param {array} dataset
     * @param {integer|float} epsilon
     * @param {integer} minPts
     * @param {callable} distanceFunction
     * @access public
     */
    init: function(dataset, epsilon, minPts, distanceFunction) {
        if (dataset && dataset.constructor !== Array) {
            throw Error('Dataset must be of type array, ' + typeof dataset + ' given');
            return;
        }
        
        this.dataset = dataset;
        this.clusters = [];
        this.epsilon = epsilon || 1;
        this.minPts = minPts || 1;   
        this.distance = distanceFunction || this.euclideanDistance;
        this.reachability = (dataset !== undefined) ? new Array(this.dataset.length) : [];
        this.processed = (dataset !== undefined) ? new Array(this.dataset.length) : [];
        this.coreDistance = 0;
        this.orderedList = [];
    },
    
    /**
     * Execution
     * @param {array} dataset
     * @returns {void}
     * @access public
     */
    run: function(dataset, epsilon, minPts, distanceFunction) {
        var self = this;
        this.init(dataset, epsilon, minPts, distanceFunction);

        for (var pointId = 0; pointId < this.dataset.length; pointId++) {
            if (this.processed[pointId] !== 1) {
                this.processed[pointId] = 1;
                this.clusters.push([pointId]);
                var clusterId = this.clusters.length - 1;

                this.orderedList.push(pointId);
                var priorityQueue = new PriorityQueue(null, null, 'asc');
                var neighbors = self.regionQuery(pointId);   
                
                // using priority queue assign elements to new cluster
                if (this.distanceToCore(pointId, neighbors) !== undefined) {
                    this.updateQueue(pointId, neighbors, priorityQueue);
                    this.expandCluster(clusterId, priorityQueue);
                }
            }
        }

        return this.clusters;
    },

    /**
     * Update information in queue
     * @param {array} neighbors
     * @param {Point} point
     * @param {PriorityQueue} queue
     * @param {integer|float} epsilon
     * @param {integer} minPts
     * @returns {void}
     * @access public
     */
    updateQueue: function(pointId, neighbors, queue) {
        var self = this;

        this.coreDistance = this.distanceToCore(pointId, neighbors);
        neighbors.forEach(function(pointId2, index) {
            if (self.processed[pointId2] === undefined) {

                var newReachableDistance = Math.max(self.coreDistance, self.distance(self.dataset[pointId], self.dataset[pointId2]));

                if (self.reachability[pointId2] === undefined) {
                    self.reachability[pointId2] = newReachableDistance;
                    queue.insert(pointId2, newReachableDistance);
                } else {
                    if (newReachableDistance < self.reachability[pointId2]) {
                        self.reachability[pointId2] = newReachableDistance;
                        queue.remove(pointId2);
                        queue.insert(pointId2, newReachableDistance);
                    }
                }
            }
        });
    },
    
    /**
     * Expand cluster
     * @param {integer} clusterId
     * @param {integer|float} epsilon
     * @param {integer} minPts
     * @returns {void}
     * @access public
     */
    expandCluster: function(clusterId, queue) {
        var queueElements = queue.getElements();
        for (var p = 0; p < queueElements.length; p++) {
            var pointId = queueElements[p];
            if (this.processed[pointId] === undefined) {
                var neighbors = this.regionQuery(pointId);
                this.processed[pointId] = 1;

                this.clusters[clusterId].push(pointId);
                this.orderedList.push(pointId);

                if (this.distanceToCore(pointId) !== undefined) {
                    this.updateQueue(pointId, neighbors, queue);
                    this.expandCluster(clusterId, queue);
                }
            }
        }
    },
    
    /**
     * Calculating distance to cluster core
     * @param {integer} pointId
     * @param {array} neighbors
     * @returns {integer|float}
     * @access public
     */
    distanceToCore: function(pointId, neighbors) {
        var self = this
            , minDistance = undefined;

        if (!neighbors)
            neighbors = this.regionQuery(pointId);

        // core-point should have got at least minPts-Points
        if (neighbors.length >= this.minPts) {
            var minDistance = this.epsilon;
            neighbors.forEach(function(pointId2, index) {
                var dist = self.distance(self.dataset[pointId], self.dataset[pointId2]);
                if (dist < minDistance)
                    minDistance = dist;
            });
        }

        return minDistance;
    },
    
    /**
     * Find all neighbors around given point
     *
     * @param {integer} pointId,
     * @param {integer} epsilon
     * @returns {array}
     */
    regionQuery: function(pointId) {
        var neighbors = [];
        for (var id = 0; id < this.dataset.length; id++) {
            if ((pointId !== id) && this.distance(this.dataset[pointId], this.dataset[id]) < this.epsilon)
                neighbors.push(id);
        }
        return neighbors;
    },
    
    /**
     * Calculate euclidean distance in multidimensional space
     * 
     * @param {array} p1
     * @param {array} p2
     * @returns {boolean}
     * @access public
     */   
    euclideanDistance: function(p, q) {
        var sum = 0;
        for (var i = 0; i < Math.min(p.length, q.length); i++)
            sum += (p[i] - q[i]) * (p[i] - q[i]);
        return Math.sqrt(sum);
    },

    /**
     * Generate reachability plot for all points
     *
     * @returns {array}
     * @access public
     */
    getReachabilityPlot: function() {
        var reachabilityPlot = [];

        for (var i = 0; i < this.orderedList.length; i++) {
            var pointId = this.orderedList[i];
            var distance = this.reachability[pointId];
            reachabilityPlot.push([pointId, distance]);
        }

        return reachabilityPlot;
    }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = OPTICS;