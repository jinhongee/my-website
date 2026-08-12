import SonarViz from '../components/viz/SonarViz'
import SequenceViz from '../components/viz/SequenceViz'
import SwarmViz from '../components/viz/SwarmViz'
import NetworkViz from '../components/viz/NetworkViz'
import LatticeViz from '../components/viz/LatticeViz'

const work = [
  {
    slug: 'sovereign-models',
    title: 'Sovereign Open-Weight Models',
    org: 'Foundation Models',
    figure: 'FIG. 01 — DISTRIBUTED PRETRAINING LATTICE',
    figureRight: 'TP×PP SHARDING',
    viz: LatticeViz,
    tagline:
      'Open weights adapted into sovereign stacks — multilingual continual pretraining, tokenizer adaptation, and alignment on domestic compute.',
    tags: ['continual pretraining', 'tokenizer adaptation', 'RLHF', 'distributed training'],
    summary: [
      'Worked on adapting open-weight foundation models into sovereign stacks: models whose weights, data pipeline, and serving infrastructure remain under national or organizational control. The technical spine is multilingual continual pretraining — curating and deduplicating domestic-language corpora, extending the tokenizer vocabulary and re-initializing embeddings to cut fertility on non-Latin scripts, and scheduling replay against the original distribution to bound catastrophic forgetting.',
      'Downstream of pretraining sits the alignment pipeline: supervised finetuning on locally authored instruction data, preference optimization against reward models trained on in-culture annotations, and evaluation harnesses that measure capability in the target language rather than through translation artifacts. Training runs are laid out with tensor/pipeline-parallel sharding sized to the available accelerator fleet; serving uses quantization and paged attention to hit latency targets on constrained domestic hardware.',
    ],
    papers: [
      {
        authors: 'H. Touvron, T. Lavril, G. Izacard, X. Martinet, M.-A. Lachaux, T. Lacroix, et al.',
        title: 'LLaMA: Open and Efficient Foundation Language Models',
        venue: 'arXiv preprint',
        year: 2023,
        link: 'https://arxiv.org/abs/2302.13971',
      },
      {
        authors: 'J. Hoffmann, S. Borgeaud, A. Mensch, E. Buchatskaya, T. Cai, E. Rutherford, et al.',
        title: 'Training Compute-Optimal Large Language Models',
        venue: 'Proc. NeurIPS',
        year: 2022,
        link: 'https://arxiv.org/abs/2203.15556',
      },
      {
        authors: 'L. Ouyang, J. Wu, X. Jiang, D. Almeida, C. Wainwright, P. Mishkin, et al.',
        title: 'Training Language Models to Follow Instructions with Human Feedback',
        venue: 'Proc. NeurIPS',
        year: 2022,
        link: 'https://arxiv.org/abs/2203.02155',
      },
      {
        authors: 'T. Le Scao, A. Fan, C. Akiki, E. Pavlick, S. Ilić, D. Hesslow, et al. (BigScience)',
        title: 'BLOOM: A 176B-Parameter Open-Access Multilingual Language Model',
        venue: 'arXiv preprint',
        year: 2022,
        link: 'https://arxiv.org/abs/2211.05100',
      },
    ],
  },
  {
    slug: 'supply-chain-agents',
    title: 'Autonomous Supply-Chain Agents',
    org: 'Operations Research × LLM Agents',
    figure: 'FIG. 02 — MULTI-ECHELON FLOW OPTIMIZATION',
    figureRight: 'MIN-COST FLOW / REROUTE',
    viz: NetworkViz,
    tagline:
      'Agentic orchestration over multi-echelon supply networks — hierarchical planners grounded in constrained solvers and probabilistic demand forecasts.',
    tags: ['combinatorial optimization', 'demand forecasting', 'hierarchical RL', 'agentic orchestration'],
    summary: [
      'Designed agent systems that operate multi-echelon supply networks end-to-end: a hierarchical planner decomposes network-level objectives (service level, working capital, landed cost) into node-level decisions — replenishment quantities, allocation, routing — each grounded in a constrained solver rather than free-form generation. The LLM layer handles the ill-posed parts: interpreting demand signals and supplier communications, proposing constraint relaxations under infeasibility, and translating disruptions into re-planning triggers.',
      'The optimization substrate is a rolling-horizon min-cost flow with capacity and lead-time constraints, warm-started across replans; demand is modeled with probabilistic sequence forecasters whose quantile outputs parameterize safety-stock policies. Disruption response is treated as constrained re-optimization: when an arc drops, the planner re-solves under the residual network and the agent layer renegotiates commitments — the closed loop between stochastic forecast, deterministic solve, and agentic exception handling is the product.',
    ],
    papers: [
      {
        authors: 'W. Kool, H. van Hoof, M. Welling',
        title: 'Attention, Learn to Solve Routing Problems!',
        venue: 'Proc. ICLR',
        year: 2019,
        link: 'https://arxiv.org/abs/1803.08475',
      },
      {
        authors: 'A. Oroojlooyjadid, M. Nazari, L. V. Snyder, M. Takáč',
        title: 'A Deep Q-Network for the Beer Game: Deep Reinforcement Learning for Inventory Optimization',
        venue: 'Manufacturing & Service Operations Management 24(1)',
        year: 2022,
        link: 'https://arxiv.org/abs/1708.05924',
      },
      {
        authors: 'Y. Bengio, A. Lodi, A. Prouvost',
        title: 'Machine Learning for Combinatorial Optimization: A Methodological Tour d’Horizon',
        venue: 'European Journal of Operational Research 290(2)',
        year: 2021,
        link: 'https://arxiv.org/abs/1811.06128',
      },
      {
        authors: 'C. D. Hubbs, H. D. Perez, O. Sarwar, N. V. Sahinidis, I. E. Grossmann, J. M. Wassick',
        title: 'OR-Gym: A Reinforcement Learning Library for Operations Research Problems',
        venue: 'arXiv preprint',
        year: 2020,
        link: 'https://arxiv.org/abs/2008.06319',
      },
    ],
  },
  {
    slug: 'hydroacoustic-classification',
    title: 'Hydroacoustic Target Classification',
    org: 'Republic of Korea Navy — Intelligence',
    figure: 'FIG. 03 — PASSIVE SONAR / LOFAR ANALYSIS',
    figureRight: 'BEARING-TIME PROCESSING',
    viz: SonarViz,
    tagline:
      'Passive-sonar target recognition — representation learning on LOFAR/DEMON spectrograms under low SNR and heavy clutter.',
    tags: ['passive sonar', 'spectrogram CNNs', 'signal processing', 'low-SNR classification'],
    summary: [
      'Served as an intelligence agent working on machine-learning classification of submarine hydroacoustic signals. Passive sonar reduces to a weak-signal detection problem: narrowband tonals from rotating machinery and broadband cavitation signatures sit far below ambient noise, so the pipeline begins with array beamforming and spectro-temporal decomposition — LOFAR grams for narrowband structure, DEMON analysis for propeller shaft-rate modulation — before any learning happens.',
      'On top of that front end, convolutional classifiers operate on normalized spectrogram patches to discriminate contact classes by their tonal line structure and harmonic spacing. The operating constraints dominate the design: severe class imbalance, label scarcity, and a hard requirement on false-alarm rates, addressed with augmentation over synthetic propagation conditions and calibrated decision thresholds rather than raw softmax scores.',
    ],
    papers: [
      {
        authors: 'S. Hershey, S. Chaudhuri, D. P. W. Ellis, J. F. Gemmeke, A. Jansen, R. C. Moore, et al.',
        title: 'CNN Architectures for Large-Scale Audio Classification',
        venue: 'Proc. IEEE ICASSP',
        year: 2017,
        link: 'https://arxiv.org/abs/1609.09430',
      },
      {
        authors: 'K. J. Piczak',
        title: 'Environmental Sound Classification with Convolutional Neural Networks',
        venue: 'Proc. IEEE MLSP',
        year: 2015,
        link: 'https://doi.org/10.1109/MLSP.2015.7324337',
      },
      {
        authors: 'H. Purwins, B. Li, T. Virtanen, J. Schlüter, S.-Y. Chang, T. Sainath',
        title: 'Deep Learning for Audio Signal Processing',
        venue: 'IEEE Journal of Selected Topics in Signal Processing 13(2)',
        year: 2019,
        link: 'https://arxiv.org/abs/1905.00078',
      },
      {
        authors: 'A. Krizhevsky, I. Sutskever, G. E. Hinton',
        title: 'ImageNet Classification with Deep Convolutional Neural Networks',
        venue: 'Proc. NeurIPS',
        year: 2012,
        link: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
      },
    ],
  },
  {
    slug: 'financial-sequence-modeling',
    title: 'Financial Sequence Modeling',
    org: 'Naver Corp — Software Engineering',
    figure: 'FIG. 04 — RECURRENT STATE-SPACE FORECASTING',
    figureRight: 'LSTM UNROLL / σ√τ CONE',
    viz: SequenceViz,
    tagline:
      'LSTM state-space models for equity time-series forecasting, alongside large-scale catalog normalization and entity resolution.',
    tags: ['LSTM', 'time-series forecasting', 'entity resolution', 'data pipelines'],
    summary: [
      'Built an LSTM-based forecasting system for equity price series: gated recurrent cells maintain a latent state h_t summarizing the observed path, trained on windows of engineered features (returns, realized volatility, volume imbalance) with walk-forward validation to respect the arrow of time. The interesting failure modes are statistical, not architectural — nonstationarity and regime shifts mean the model is best read as a conditional quantile estimator with honest uncertainty, not a point-prediction oracle.',
      'Separately, automated catalog ingestion for commerce data: normalization and entity resolution over noisy product feeds — deduplicating listings, aligning attributes across heterogeneous schemas, and flagging low-confidence merges for human review. Same discipline, different domain: sequence models and similarity learning wrapped in pipelines engineered for throughput and auditability.',
    ],
    papers: [
      {
        authors: 'S. Hochreiter, J. Schmidhuber',
        title: 'Long Short-Term Memory',
        venue: 'Neural Computation 9(8)',
        year: 1997,
        link: 'https://doi.org/10.1162/neco.1997.9.8.1735',
      },
      {
        authors: 'T. Fischer, C. Krauss',
        title: 'Deep Learning with Long Short-Term Memory Networks for Financial Market Predictions',
        venue: 'European Journal of Operational Research 270(2)',
        year: 2018,
        link: 'https://doi.org/10.1016/j.ejor.2017.11.054',
      },
      {
        authors: 'D. Bahdanau, K. Cho, Y. Bengio',
        title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
        venue: 'Proc. ICLR',
        year: 2015,
        link: 'https://arxiv.org/abs/1409.0473',
      },
      {
        authors: 'B. Lim, S. Zohren',
        title: 'Time-Series Forecasting with Deep Learning: A Survey',
        venue: 'Philosophical Transactions of the Royal Society A 379',
        year: 2021,
        link: 'https://arxiv.org/abs/2004.13408',
      },
    ],
  },
  {
    slug: 'simulation-agents',
    title: 'Generative Simulation Agents',
    org: 'Multi-Agent Systems',
    figure: 'FIG. 05 — POPULATION-SCALE AGENT DYNAMICS',
    figureRight: 'N-BODY / POLICY ROLLOUT',
    viz: SwarmViz,
    tagline:
      'Persona-conditioned LLM policies rolled out at population scale — memory, reflection, and counterfactual experiments over synthetic societies.',
    tags: ['LLM agents', 'agent-based modeling', 'cognitive architectures', 'counterfactual inference'],
    summary: [
      'Built simulation infrastructure in which each agent is a persona-conditioned language-model policy π(a | s, m) equipped with an episodic memory store, retrieval-weighted reflection, and a planning loop that compiles high-level intent into environment-grounded actions. Populations of such agents are instantiated from calibrated demographic and behavioral priors, then rolled out in shared environments to study emergent macro-dynamics: information diffusion, coordination, market microstructure, and norm formation.',
      'The core technical problems are fidelity and identifiability: keeping per-agent behavior consistent with its conditioning distribution over long horizons (mitigating persona drift via memory consolidation and constrained decoding), and validating that aggregate simulation statistics reproduce held-out human population data rather than model priors. Counterfactual experiments — intervene on a policy, a price, an information channel — are run as paired rollouts with common random numbers to control variance.',
    ],
    papers: [
      {
        authors: 'J. S. Park, J. C. O’Brien, C. J. Cai, M. R. Morris, P. Liang, M. S. Bernstein',
        title: 'Generative Agents: Interactive Simulacra of Human Behavior',
        venue: 'Proc. UIST',
        year: 2023,
        link: 'https://arxiv.org/abs/2304.03442',
      },
      {
        authors: 'L. P. Argyle, E. C. Busby, N. Fulda, J. R. Gubler, C. Rytting, D. Wingate',
        title: 'Out of One, Many: Using Language Models to Simulate Human Samples',
        venue: 'Political Analysis 31(3)',
        year: 2023,
        link: 'https://arxiv.org/abs/2209.06899',
      },
      {
        authors: 'J. J. Horton',
        title: 'Large Language Models as Simulated Economic Agents: What Can We Learn from Homo Silicus?',
        venue: 'NBER Working Paper 31122',
        year: 2023,
        link: 'https://arxiv.org/abs/2301.07543',
      },
      {
        authors: 'A. S. Vezhnevets, J. P. Agapiou, A. Aharon, R. Ziv, J. Matyas, E. A. Duéñez-Guzmán, et al.',
        title: 'Generative Agent-Based Modeling with Actions Grounded in Physical, Social, or Digital Space Using Concordia',
        venue: 'arXiv preprint',
        year: 2023,
        link: 'https://arxiv.org/abs/2312.03664',
      },
    ],
  },
]

export default work
