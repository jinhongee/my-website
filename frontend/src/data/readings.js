// Curated reading list — foundational texts, not blog posts.
const readings = [
  {
    group: 'Learning Theory & Statistical Mechanics',
    items: [
      {
        title: 'Neural Tangent Kernel: Convergence and Generalization in Neural Networks',
        authors: 'A. Jacot, F. Gabriel, C. Hongler',
        venue: 'Proc. NeurIPS',
        year: 2018,
        link: 'https://arxiv.org/pdf/1806.07572',
        note: 'Infinite-width training dynamics linearize into kernel gradient descent — the exactly solvable model that anchors the whole modern theory.',
      },
      {
        title: 'Reconciling Modern Machine-Learning Practice and the Classical Bias–Variance Trade-off',
        authors: 'M. Belkin, D. Hsu, S. Ma, S. Mandal',
        venue: 'PNAS 116(32)',
        year: 2019,
        link: 'https://www.pnas.org/doi/10.1073/pnas.1903070116',
        note: 'Double descent: interpolation is not the end of generalization but the start of a second regime classical theory never predicted.',
      },
      {
        title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
        authors: 'R. Rafailov, A. Sharma, E. Mitchell, S. Ermon, C. D. Manning, C. Finn',
        venue: 'arXiv',
        year: 2023,
        link: 'https://arxiv.org/pdf/2305.18290',
        note: 'The KL-constrained RL objective has a closed-form optimal policy, so the reward model can be substituted away entirely — RLHF collapses into a classification loss.',
      },
      {
        title: 'On the Theory of Policy Gradient Methods: Optimality, Approximation, and Distribution Shift',
        authors: 'A. Agarwal, S. M. Kakade, J. D. Lee, G. Mahajan',
        venue: 'JMLR 22(98)',
        year: 2021,
        link: 'https://arxiv.org/pdf/1908.00261',
        note: 'Global convergence for a non-concave objective: softmax and natural policy gradient escape the usual stationary-point guarantee, with the price of exploration isolated in a distribution mismatch coefficient.',
      },
    ],
  },
  {
    group: 'Geometry & Topology of Learning',
    items: [
      {
        title: 'Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges',
        authors: 'M. M. Bronstein, J. Bruna, T. Cohen, P. Veličković',
        venue: 'arXiv',
        year: 2021,
        link: 'https://arxiv.org/pdf/2104.13478',
        note: 'An Erlangen program for deep learning: architectures as symmetry groups and invariance classes rather than a zoo of tricks.',
      },
      {
        title: 'Topology and Data',
        authors: 'G. Carlsson',
        venue: 'Bulletin of the AMS 46(2)',
        year: 2009,
        link: 'https://www.ams.org/journals/bull/2009-46-02/S0273-0979-09-01249-X/S0273-0979-09-01249-X.pdf?_gl=1*1o4fmj1*_ga*MTUxMTE4NDkzMS4xNzg2NDk2OTIz*_ga_26G4XFTR63*czE3ODY0OTY5MjMkbzEkZzEkdDE3ODY0OTc4MTckajYwJGwwJGgw&t=1786497822743',
        note: 'Persistent homology as a functorial summary of data across scales — the founding statement of topological data analysis.',
      },
      {
        title: 'Testing the Manifold Hypothesis',
        authors: 'C. Fefferman, S. Mitter, H. Narayanan',
        venue: 'J. Amer. Math. Soc. 29',
        year: 2016,
        link: 'https://arxiv.org/pdf/1310.0425',
        note: 'The assumption every high-dimensional method quietly rests on, made falsifiable: sample complexity for deciding whether data lies near a manifold of bounded curvature and volume.',
      },
      {
        title: 'Topology of Deep Neural Networks',
        authors: 'G. Naitzat, A. Zhitnikov, L.-H. Lim',
        venue: 'JMLR 21(184)',
        year: 2020,
        link: 'https://arxiv.org/pdf/2004.06093',
        note: 'Betti numbers of the data manifold collapse layer by layer — ReLU nets simplify topology monotonically toward linear separability in a way smooth activations do not.',
      },
    ],
  },

]

export default readings
