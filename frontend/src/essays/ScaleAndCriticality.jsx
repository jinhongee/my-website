import { Eq, EqBlock } from '../components/Katex'

export const meta = {
  slug: 'scale-and-criticality',
  title: 'Scale and Criticality: A Statistical-Mechanical View of Deep Networks',
  teaser:
    'Wide networks are random fields and training is a partition function — trainability, scaling laws, and emergence all live at phase boundaries.',
  abstract:
    'We treat deep networks as statistical-mechanical systems. At infinite width a network at initialization is a Gaussian process whose layerwise kernel recursion admits ordered and chaotic phases; trainability requires initialization at the critical boundary between them. The Bayesian posterior defines a partition function whose free-energy asymptotics are governed by the geometry of the loss variety, and empirical scaling laws play the role of thermodynamic equations of state. Emergent capabilities and grokking are read as finite-size signatures of underlying phase transitions.',
}

export default function ScaleAndCriticality() {
  return (
    <>
      <h2>1&nbsp;&nbsp;Networks as random fields</h2>
      <p>
        Consider a fully connected network with weights drawn{' '}
        <Eq>{String.raw`W^{(\ell)}_{ij} \sim \mathcal{N}(0, \sigma_w^2 / n_\ell)`}</Eq> and biases{' '}
        <Eq>{String.raw`b^{(\ell)}_i \sim \mathcal{N}(0, \sigma_b^2)`}</Eq>. As the widths{' '}
        <Eq>{String.raw`n_\ell \to \infty`}</Eq>, the central limit theorem makes each
        pre-activation a Gaussian field: the network at initialization converges to a Gaussian
        process,
      </p>
      <EqBlock>{String.raw`f(x) \;\sim\; \mathcal{GP}\big(0,\; K^{(L)}(x, x')\big),`}</EqBlock>
      <p>with the kernel built layer by layer through the recursion</p>
      <EqBlock>{String.raw`K^{(\ell+1)}(x, x') \;=\; \sigma_b^2 \;+\; \sigma_w^2\, \mathbb{E}_{(u,v) \sim \mathcal{N}(0,\, K^{(\ell)})}\big[\phi(u)\,\phi(v)\big].`}</EqBlock>
      <p>
        Architecture design, in this limit, is kernel design; and the recursion is a discrete-time
        dynamical system whose fixed points decide everything.
      </p>

      <h2>2&nbsp;&nbsp;Order, chaos, and the edge</h2>
      <p>
        Track the normalized correlation <Eq>{String.raw`c^{(\ell)}`}</Eq> between two inputs as
        depth grows. Its fixed point <Eq>{String.raw`c^* = 1`}</Eq> has stability multiplier
      </p>
      <EqBlock>{String.raw`\chi \;=\; \left.\frac{\partial c^{(\ell+1)}}{\partial c^{(\ell)}}\right|_{c = 1} \;=\; \sigma_w^2\, \mathbb{E}_{u}\big[\phi'(u)^2\big].`}</EqBlock>
      <p>
        For <Eq>{String.raw`\chi < 1`}</Eq> all inputs collapse to perfect correlation with depth —
        the ordered phase, where the network forgets its input. For <Eq>{String.raw`\chi > 1`}</Eq>{' '}
        nearby inputs decorrelate exponentially — the chaotic phase, where it forgets smoothness.
        Signal propagates to depth <Eq>{String.raw`\ell`}</Eq> only within a correlation length{' '}
        <Eq>{String.raw`\xi \sim |\log \chi|^{-1}`}</Eq>, which diverges exactly at{' '}
        <Eq>{String.raw`\chi = 1`}</Eq>: criticality. Deep networks are trainable when initialized
        at the edge of chaos — and schemes from Xavier/He initialization to residual scaling are
        engineering devices for pinning the system to that boundary.
      </p>

      <h2>3&nbsp;&nbsp;The partition function</h2>
      <p>
        Bayesian learning makes the thermodynamic analogy exact. With prior{' '}
        <Eq>{String.raw`\varphi(\theta)`}</Eq> and inverse temperature{' '}
        <Eq>{String.raw`\beta`}</Eq>, the marginal likelihood is a partition function,
      </p>
      <EqBlock>{String.raw`Z_n \;=\; \int e^{-n\beta L_n(\theta)}\, \varphi(\theta)\, d\theta, \qquad F_n \;=\; -\tfrac{1}{\beta}\log Z_n.`}</EqBlock>
      <p>
        For regular models Laplace’s method gives{' '}
        <Eq>{String.raw`F_n \approx n L_n(\theta_*) + \tfrac{d}{2\beta} \log n`}</Eq>. But neural
        networks are singular: the minimizing set is a variety with singularities, the Hessian is
        degenerate along it, and the Gaussian approximation fails. Watanabe’s resolution-of-
        singularities analysis replaces the exponent,
      </p>
      <EqBlock>{String.raw`F_n \;=\; n L_n(\theta_*) \;+\; \frac{\lambda}{\beta} \log n \;-\; \frac{m - 1}{\beta} \log \log n \;+\; O_p(1),`}</EqBlock>
      <p>
        with <Eq>{String.raw`\lambda \le d/2`}</Eq> the real log canonical threshold. Low{' '}
        <Eq>{String.raw`\lambda`}</Eq> regions — degenerate, high-entropy basins — dominate the
        posterior for the same reason low-energy, high-entropy macrostates dominate a Gibbs
        ensemble. Generalization is a free-energy calculation.
      </p>

      <h2>4&nbsp;&nbsp;Equations of state</h2>
      <p>
        Empirically, loss obeys power laws in the macroscopic variables — parameters{' '}
        <Eq>{String.raw`N`}</Eq>, tokens <Eq>{String.raw`D`}</Eq>, compute{' '}
        <Eq>{String.raw`C`}</Eq>:
      </p>
      <EqBlock>{String.raw`L(N, D) \;=\; E \;+\; \frac{A}{N^{\alpha}} \;+\; \frac{B}{D^{\beta}}, \qquad \alpha \approx 0.34,\;\; \beta \approx 0.28,`}</EqBlock>
      <p>
        in the Chinchilla parameterization. Minimizing subject to the budget constraint{' '}
        <Eq>{String.raw`C \approx 6ND`}</Eq> yields compute-optimal allocations
      </p>
      <EqBlock>{String.raw`N^* \;\propto\; C^{\,a}, \qquad D^* \;\propto\; C^{\,b}, \qquad a \approx b \approx 0.5,`}</EqBlock>
      <p>
        i.e. parameters and data should scale together. These relations function exactly like
        equations of state: macroscopic regularities, robust across microscopic architectural
        detail, hinting at an underlying universality class we have not yet derived from first
        principles — though variance-limited and resolution-limited regimes, and the manifold
        dimension of the data, all leave fingerprints on the exponents.
      </p>

      <h2>5&nbsp;&nbsp;Finite width as interaction</h2>
      <p>
        Real networks live at finite width, where the Gaussian picture acquires corrections. In
        the effective-theory expansion of Roberts, Yaida, and Hanin, the connected four-point
        function of preactivations scales like
      </p>
      <EqBlock>{String.raw`\kappa_4 \;\sim\; O\!\left(\frac{\ell}{n}\right),`}</EqBlock>
      <p>
        so the depth-to-width ratio <Eq>{String.raw`\ell / n`}</Eq> is the coupling constant of
        deep learning: it measures both the departure from Gaussianity and the strength of feature
        learning. Too small and the network is effectively a frozen kernel machine; too large and
        fluctuations swamp the signal. The useful regime is weakly coupled but not free — the same
        window in which perturbative field theories are calculable.
      </p>

      <h2>6&nbsp;&nbsp;Emergence as phase transition</h2>
      <p>
        Sharp capability onsets under scaling, and delayed generalization on algorithmic tasks
        (grokking), both carry the phenomenology of phase transitions: an order parameter (task
        accuracy, circuit formation) switching abruptly as a control parameter (scale, training
        time) crosses a threshold, with the transition rounded by finite size. In the grokking
        setting one can watch the competition directly — a memorizing solution with low entropy
        and a generalizing circuit with lower “energy” under weight decay — and the crossover is a
        first-order transition in the free energy
      </p>
      <EqBlock>{String.raw`F \;=\; \mathbb{E}[L] \;-\; T\,S`}</EqBlock>
      <p>
        between the two basins. Whether large-model emergence is “real” discontinuity or a
        measurement artifact of discontinuous metrics remains an active dispute; what is not in
        dispute is that the language of statistical mechanics — phases, order parameters, critical
        exponents, universality — is currently our sharpest instrument for saying anything precise
        about why scale works.
      </p>

      <div className="paper-refs">
        <div className="refs-head">References</div>
        <ol>
          <li>
            R. M. Neal. <i>Bayesian Learning for Neural Networks.</i> Springer, 1996.
          </li>
          <li>
            B. Poole, S. Lahiri, M. Raghu, J. Sohl-Dickstein, S. Ganguli. “Exponential
            Expressivity in Deep Neural Networks Through Transient Chaos.” <i>NeurIPS</i>, 2016.
          </li>
          <li>
            D. A. Roberts, S. Yaida, B. Hanin. <i>The Principles of Deep Learning Theory.</i>{' '}
            Cambridge University Press, 2022.
          </li>
          <li>
            J. Hoffmann et al. “Training Compute-Optimal Large Language Models.” <i>NeurIPS</i>,
            2022.
          </li>
          <li>
            A. Power, Y. Burda, H. Edwards, I. Babuschkin, V. Misra. “Grokking: Generalization
            Beyond Overfitting on Small Algorithmic Datasets.” <i>arXiv:2201.02177</i>, 2022.
          </li>
        </ol>
      </div>
    </>
  )
}
