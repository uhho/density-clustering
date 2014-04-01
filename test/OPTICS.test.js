require("should");
require('../lib/index.js');

describe('OPTICS', function() {

    describe('#run()', function() {
        it('should return correct clusters for regular density set', function() {
            var dataset = [
                [1,1],[0,1],[1,0],
                [10,10],[10,11],[11,10],
                [50,50],[51,50],[50,51],
                [100,100]
            ];
            
            var optics = new OPTICS();
            var clusters = optics.run(dataset, 2, 2);

            clusters.should.be.eql([
                [0,1,2],
                [3,4,5],
                [6,7,8],
                [9]
            ]);
        });
    });
    
    describe('#run()', function() {
        it('should return correct results for various density set', function() {
            var dataset = [
                [0,0],[6,0],[-1,0],[0,1],[0,-1],
                [45,45],[45.1,45.2],[45.1,45.3],[45.8,45.5],[45.2,45.3],
                [50,50],[56,50],[50,52],[50,55],[50,51]
            ];
            var optics = new OPTICS();
            var clusters = optics.run(dataset, 6, 2);

            clusters.should.be.eql([
                [0, 2, 3, 4],
                [1],
                [5, 6, 7, 9, 8],
                [10, 14, 12, 13],
                [11]
            ]);
        });
    });

    describe('#regionQuery()', function() {
        it('should return nearest neighborhood of a point', function() {
            var optics = new OPTICS();
            optics.dataset = [
                [1,1],[2,2],[3,3],
                [50,50],[51,51]
            ];
            optics.epsilon = 2;
            optics.regionQuery(1).should.eql([0,2]);
            optics.regionQuery(4).should.eql([3]);

            optics.epsilon = 100;
            optics.regionQuery(1).should.eql([0,2,3,4]);
        });
    });

    describe('#euclideanDistance()', function() {
        it('should return distance between two points', function() {
            var optics = new OPTICS();
            optics.euclideanDistance([1, 1],[3, 1]).should.eql(2);
            optics.euclideanDistance([1, 1],[1, 3]).should.eql(2);
        });
    });

    describe('#getReachabilityPlot()', function() {
        it('should return reachability plot', function() {
            var dataset = [
                [1,1],[0,1],[1,0],
                [10,10],[10,11],[11,10]
            ];

            var optics = new OPTICS();
            optics.run(dataset, 2, 2);
            var plot = optics.getReachabilityPlot();
            plot.should.eql([
                [ 0, undefined ],  [ 1, 1 ], [ 2, 1 ],
                [ 3, undefined ], [ 4, 1 ], [ 5, 1 ]
            ]);
            
            // reachability plot should be always the same for different epsilon values
            optics.run(dataset, 10, 2);
            var plot = optics.getReachabilityPlot();
            plot.should.eql([
                [ 0, undefined ],  [ 1, 1 ], [ 2, 1 ],
                [ 3, undefined ], [ 4, 1 ], [ 5, 1 ]
            ]);
        });
    });

});