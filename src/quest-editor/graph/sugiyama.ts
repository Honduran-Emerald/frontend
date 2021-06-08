import dagre from 'dagre';
import { IGraphModuleNode } from './ModuleGraph';

/**
 * Implementation of the sugiyama algorithm
 * 
 * Source used: "Visualisation of state machines using the Sugiyama framework" by Viktor Mazetti and Hannes Sörensson
 * https://publications.lib.chalmers.se/records/fulltext/161388.pdf
 */


// splits graph into layers by using a BFS
const getLayers = (g: dagre.graphlib.Graph<{}>): string[][] => {

    let sorted: string[][] = [];
    let edges = g.edges();
    let nodes = g.nodes();
    
    let start = nodes.filter(n => edges.filter(e => e.w === n).length === 0)
    while (start.length > 0) {
        sorted.push(start);
        edges = edges.filter(e => !(start.includes(e.v)));
        nodes = nodes.filter(n => !(start.includes(n)));
        start = nodes.filter(n => edges.filter(e => e.w === n).length === 0)
    }
    return sorted

}

// adds virtual nodes to enforce all links to only span one layer
const virtLayers = (g: dagre.graphlib.Graph<{}>, sorted: string[][]) => {

    let virt = 0;

    let edges = g.edges();
    for (let edge of edges) {
        let from_layer = sorted.findIndex(v => v.includes(edge.v));
        let to_layer = sorted.findIndex(v => v.includes(edge.w));

        if (to_layer - from_layer > 1) {
            g.setEdge(edge.v, `virt${virt}`)
            for (let i = from_layer+1; i<to_layer-1; i++) {
                sorted[i].push(`virt${virt}`)
                g.setEdge(`virt${virt}`, `virt${++virt}`)
            }
            sorted[to_layer-1].push(`virt${virt}`)
            g.setEdge(`virt${virt++}`, edge.w)
            g.removeEdge(edge.v, edge.w)
        } 
    }

    return sorted;
}

// reorder nodes to minimize edge crossings. this is only a heuristic!
const vertOrder = (g: dagre.graphlib.Graph<{}>, sorted: string[][]) => {

    const max_iter = 5;

    let best = sorted.map(l => l.slice())


    const crossings = (sorted: string[][], g: dagre.graphlib.Graph<{}>) => {
        let sum=0;
        for (let layer=0; layer<sorted.length-1; layer++) {
            let edges = sorted[layer]
                .map((n, i) => sorted[layer+1]
                .map((n2, i2) => [i, i2]))
                .reduce((p, c) => p.concat(c))
                .filter(e => g.hasEdge(sorted[layer][e[0]], sorted[layer+1][e[1]]))

            for (let e1 of edges) {
                for (let e2 of edges) {
                    if (e1[0] > e2[0] && e2[1] > e1[1]) {
                        sum += 1;
                    }
                }
            }
        }
        return sum
    }

    const wmedian = (sorted: string[][], i: number) => {
        if (i%2 === 0) {
            for (let r=1; r<sorted.length; r++) {
                let map = new Map<string, number>();
                for (let vert of sorted[r]) {
                    let indexes = sorted[r-1].map((v,i): [string, number] => [v,i]).filter(v => g.hasEdge(v[0], vert)).map(v => v[1]);
                    map.set(vert, indexes[Math.floor(indexes.length/2)])
                }
                sorted[r].sort((a, b) => map.get(a)! - map.get(b)!)
            }
        } else {
            for (let r=sorted.length-2; r>=0; r--) {
                let map = new Map<string, number>();
                for (let vert of sorted[r]) {
                    let indexes = sorted[r+1].map((v,i): [string, number] => [v,i]).filter(v => g.hasEdge(v[0], vert)).map(v => v[1]);
                    map.set(vert, indexes[Math.floor(indexes.length/2)])
                }
                sorted[r].sort((a, b) => map.get(a)! - map.get(b)!)
            }
        }
    }

    const transpose = (sorted: string[][], g: dagre.graphlib.Graph<{}>) => {
        let improved = true;
        let baseCrossings = crossings(sorted, g);
        while (improved) {
            improved = false;
            for (let r=0; r<sorted.length; r++) {
                for (let p=0; p<sorted[r].length-1; p++) {

                    let copy = sorted.map(l => l.slice());
                    let t = copy[r][p];
                    copy[r][p] = copy[r][p+1];
                    copy[r][p+1] = t;
                    
                    let newCrossings = crossings(copy, g);
                    if (newCrossings < baseCrossings) {
                        improved = true;
                        baseCrossings = newCrossings
                        sorted = copy
                    }
                }
            }
        }
        return sorted;
    }

    for (let i=0; i<23; i++) {
        wmedian(sorted, i)
        sorted = transpose(sorted, g)

        if (crossings(sorted, g) < crossings(best, g)) {
            best = sorted
        }
    }

    return sorted

}

// create sugiyama layout from lists of nodes and links (wraps function below)
export const fromLists = (nodes: IGraphModuleNode[], links: [string|number, string|number][]) => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(function() { return {}; });
    nodes.forEach(n => {
        //@ts-ignore
        g.setNode(n.id, {component: n.component})
    });
    links.forEach(l => {
        //@ts-ignore
        g.setEdge(l[0], l[1])
    })
    return dagLayout(g);
    
}

// create sugiyama from graph
export const dagLayout = (g: dagre.graphlib.Graph<{}>) => {
    console.log('Run sugiyama')
    let sorted = getLayers(g);
    sorted = virtLayers(g, sorted);
    sorted = vertOrder(g, sorted);
    console.log('Finish sugiyama')
    return {
        positions: sorted,
        graph: g
    }
}