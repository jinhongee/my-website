import GeometryOfLearning, { meta as m1 } from './GeometryOfLearning'
import RepresentationAsCompression, { meta as m2 } from './RepresentationAsCompression'
import ScaleAndCriticality, { meta as m3 } from './ScaleAndCriticality'

const essays = [
  { ...m1, component: GeometryOfLearning },
  { ...m2, component: RepresentationAsCompression },
  { ...m3, component: ScaleAndCriticality },
]

export default essays
