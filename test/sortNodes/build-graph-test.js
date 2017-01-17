import buildGraph from '../../src/sortNodes/build-graph.js'
import graphify from '../../src/graphify.js'
import tape from 'tape'

tape('buildGraph() builds a graph', test => {
  const graph = graphify()([], [{source: 'a', target: 'b', type: 'c'}])
  graph.node('a').rank = 0
  graph.node('b').rank = 1

  const { G, ranks } = buildGraph(graph)

  test.deepEqual(G.nodes(), ['a', 'b'])
  test.deepEqual(G.node('a'), graph.node('a'))
  test.deepEqual(G.node('b'), graph.node('b'))

  test.deepEqual(ranks, [
    ['a'],
    ['b']
  ])

  test.end()
})

tape('buildGraph() includes dummy nodes', test => {
  const graph = graphify()([], [{source: 'a', target: 'b', type: 'c'}])
  graph.node('a').rank = 0
  graph.node('b').rank = 2
  // graph.edges()[0].dummyNodes = [{rank: 1}]

  const { G, ranks } = buildGraph(graph)

  test.deepEqual(G.nodes(), ['a', 'b', '__a_b_0'])
  test.deepEqual(G.node('a'), graph.node('a'))
  test.deepEqual(G.node('b'), graph.node('b'))
  test.deepEqual(G.node('__a_b_0'), {rank: 1, backwards: false})

  test.deepEqual(G.edges(), [
    {v: 'a', w: '__a_b_0', name: 'c'},
    {v: '__a_b_0', w: 'b', name: 'c'}
  ])

  test.deepEqual(ranks, [
    ['a'],
    ['__a_b_0'],
    ['b']
  ])

  test.end()
})
