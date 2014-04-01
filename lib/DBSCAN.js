/**
 * @class DBSCAN - Density based clustering
 * @constructor
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * 
 * @param {array} dataset
 * @param {integer|float} epsilon
 * @param {integer} minPts
 * @param {callable} distanceFunction
 * @returns {DBSCAN}
 */
var DBSCAN = function(dataset, epsilon, minPts, distanceFunction) {
    this.init(dataset, epsilon, minPts, distanceFunction);
};

DBSCAN.prototype = {

    /**
     * Set object properties
     * @param {array} dataset
     * @param {integer|float} epsilon
     * @param {integer} minPts
     * @param {callable} distanceFunction
     * @returns {void}
     * @access public
     */
    init: function(dataset, epsilon, minPts, distanceFunction) {
        if (dataset && dataset.constructor !== Array) {
            throw Error('Dataset must be of type array, ' + typeof dataset + ' given');
            return;
        }
        
        this.dataset = dataset || [];
        this.epsilon = epsilon || 1;
        this.minPts = minPts || 2;
        this.distance = distanceFunction || this.euclideanDistance;
        this.clusters = [];
        this.visited = new Array(this.dataset.length);
        this.noise = [];
        this.assigned = new Array(this.dataset.length);
    },

    /**
     * Execution
     * @param {integer} epsilon
     * @param {integer} minPts
     * @returns {void}
     */
    run: function(dataset, epsilon, minPts, distanceFunction) {
        this.init(dataset, epsilon, minPts, distanceFunction);
        
        for (var pointId = 0; pointId < this.dataset.length; pointId++) {
       
            // if point is not visited, check if it forms a cluster
            if (this.visited[pointId] !== 1) {
                this.visited[pointId] = 1;
       
                // if closest neighborhood is too small to form a cluster, mark as noise
                var neighbors = this.regionQuery(pointId);
                
                // create new cluster aroud point and add neighbors
                var clusterId = this.clusters.length;
                this.clusters.push([pointId]);
                this.assigned[pointId] = 1;
                
                if (neighbors.length < this.minPts) {
                    this.noise.push(pointId);
                } else {
                    this.expandCluster(clusterId, neighbors);
                }
            }
        }
        
        return this.clusters;
    },
    
    /**
     * Expand cluster to closest points of given neighborhood 
     *  
     * @param {integer} clusterId
     * @param {array} neighbors
     */
    expandCluster: function(clusterId, neighbors) {
        for (var i = 0; i < neighbors.length; i++) {
            var pointId2 = neighbors[i];
            
            if (this.visited[pointId2] !== 1) {
                this.visited[pointId2] = 1;
                
                var neighbors2 = this.regionQuery(pointId2, this.epsilon);
                if (neighbors2.length >= this.minPts)
                    neighbors = this.mergeArrays(neighbors, neighbors2);
            }
            
            // add to cluster
            if (this.assigned[pointId2] !== 1) {
                this.assigned[pointId2] = 1;
                this.clusters[clusterId].push(pointId2);
            }
        }
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
    
    /**************************************************************/
    // helpers

    /**
     * @param {array} a
     * @param {array} b
     * @returns {array}
     * @access public
     */
    mergeArrays: function(a, b) {
        var source = (a.length > b.length) ? a : b
            , dest = (a.length > b.length) ? b : a;
            
        for (var i = 0; i < source.length; i++) {
            var P = source[i];
            if (dest.indexOf(P) < 0)
                dest.push(P);
        }
        
        return dest;
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
    }
};

if (module && module.exports)
    module.exports = DBSCAN;