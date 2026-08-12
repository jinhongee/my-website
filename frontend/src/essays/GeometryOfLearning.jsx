import { Eq, EqBlock } from '../components/Katex'

export const meta = {
  slug: 'geometry-of-learning',
  title: 'Learning as Geometry: Gradient Flow, Curvature, and Degenerate Minima',
  teaser:
    'Training is a gradient flow on a curved, singular landscape — read through the Fisher metric, the neural tangent kernel, and the real log canonical threshold.',
  abstract:
    'We develop the view that learning is a geometric phenomenon: stochastic gradient descent is a discretization of a flow on parameter space, the correct notion of distance on that space is statistical rather than Euclidean, and the loci to which the flow converges are not isolated points but singular analytic varieties. Three formalisms organize the picture — natural gradient descent under the Fisher–Rao metric, the neural tangent kernel as the linearization of training dynamics, and Watanabe’s singular learning theory, whose real log canonical threshold replaces parameter count as the effective dimension governing generalization.',
}

export default function GeometryOfLearning() {
  return (
    <>
      <h2>1&nbsp;&nbsp;The flow</h2>
      <p>
        Fix a parametric family <Eq>{String.raw`f_\theta : \mathcal{X} \to \mathcal{Y}`}</Eq> with{' '}
        <Eq>{String.raw`\theta \in \mathbb{R}^d`}</Eq> and a dataset{' '}
        <Eq>{String.raw`\{(x_i, y_i)\}_{i=1}^{n}`}</Eq> drawn i.i.d. from an unknown distribution{' '}
        <Eq>{String.raw`q(x, y)`}</Eq>. Training minimizes the empirical risk
      </p>
      <EqBlock>{String.raw`L_n(\theta) \;=\; \frac{1}{n}\sum_{i=1}^{n} \ell\big(f_\theta(x_i),\, y_i\big),`}</EqBlock>
      <p>
        and gradient descent with step size <Eq>{String.raw`\eta`}</Eq> is the Euler discretization
        of the gradient flow
      </p>
      <EqBlock>{String.raw`\frac{d\theta}{dt} \;=\; -\nabla_\theta L_n(\theta), \qquad \theta_{k+1} = \theta_k - \eta\, \nabla_\theta L_n(\theta_k).`}</EqBlock>
      <p>
        Everything interesting about deep learning is hidden in the innocuous symbol{' '}
        <Eq>{String.raw`\nabla`}</Eq>. A gradient is only defined relative to a metric: it is the
        vector field dual to the differential <Eq>{String.raw`dL`}</Eq> under a chosen inner
        product. Write the metric explicitly as a positive-definite tensor{' '}
        <Eq>{String.raw`G(\theta)`}</Eq> and the flow becomes
      </p>
      <EqBlock>{String.raw`\frac{d\theta}{dt} \;=\; -\,G(\theta)^{-1}\,\nabla_\theta L_n(\theta).`}</EqBlock>
      <p>
        Standard SGD silently takes <Eq>{String.raw`G = I`}</Eq>, the Euclidean metric on raw
        parameters — a choice with no statistical meaning, since reparameterizing the network
        changes the trajectory while leaving the model class untouched.
      </p>

      <h2>2&nbsp;&nbsp;The metric that matters</h2>
      <p>
        The statistically natural geometry comes from the model’s own predictive distributions.
        Expanding the Kullback–Leibler divergence between infinitesimally separated models,
      </p>
      <EqBlock>{String.raw`D_{\mathrm{KL}}\!\big(p_\theta \,\|\, p_{\theta + d\theta}\big) \;=\; \tfrac{1}{2}\, d\theta^{\top} G(\theta)\, d\theta \;+\; O(\|d\theta\|^3),`}</EqBlock>
      <p>where the second-order coefficient is exactly the Fisher information matrix</p>
      <EqBlock>{String.raw`G(\theta) \;=\; \mathbb{E}_{x \sim q,\; y \sim p_\theta(\cdot \mid x)}\!\left[ \nabla_\theta \log p_\theta(y \mid x)\; \nabla_\theta \log p_\theta(y \mid x)^{\top} \right].`}</EqBlock>
      <p>
        Amari’s natural gradient <Eq>{String.raw`\dot\theta = -G^{-1}\nabla L`}</Eq> is the flow
        that is invariant under smooth reparameterization: it moves through the space of
        distributions, not the space of coordinates. Modern optimizers are best read as cheap
        approximations to this ideal — diagonal (Adam), Kronecker-factored (K-FAC) — trading
        curvature fidelity for tractability at <Eq>{String.raw`d \sim 10^{11}`}</Eq>.
      </p>

      <h2>3&nbsp;&nbsp;The linearized regime</h2>
      <p>
        Around initialization, the network is well approximated by its first-order Taylor expansion
        in parameters,
      </p>
      <EqBlock>{String.raw`f(x; \theta) \;\approx\; f(x; \theta_0) \;+\; \nabla_\theta f(x; \theta_0)^{\top} (\theta - \theta_0),`}</EqBlock>
      <p>
        and under this linearization training with square loss becomes kernel regression under the
        neural tangent kernel
      </p>
      <EqBlock>{String.raw`\Theta(x, x') \;=\; \nabla_\theta f(x; \theta_0)^{\top}\, \nabla_\theta f(x'; \theta_0).`}</EqBlock>
      <p>
        Jacot, Gabriel, and Hongler showed that as width tends to infinity{' '}
        <Eq>{String.raw`\Theta`}</Eq> concentrates on a deterministic kernel and stays frozen along
        training, so the function-space dynamics close into a linear ODE:
      </p>
      <EqBlock>{String.raw`\frac{d f_t}{dt} \;=\; -\,\Theta\, (f_t - y) \qquad \Longrightarrow \qquad f_t \;=\; y + e^{-\Theta t}\,(f_0 - y).`}</EqBlock>
      <p>
        Each kernel eigenmode is learned at a rate set by its eigenvalue: gradient descent has a
        spectral bias toward smooth functions. The regime where this approximation breaks — where
        the kernel itself moves — is precisely the regime of feature learning, which is to say, the
        regime where deep learning earns its keep.
      </p>

      <h2>4&nbsp;&nbsp;Degenerate minima and singular models</h2>
      <p>
        The classical picture of an isolated minimum with positive-definite Hessian is simply false
        for neural networks. Permutation symmetries, rescaling invariances, and rank-deficient
        Jacobians mean the set of minimizers
      </p>
      <EqBlock>{String.raw`W_0 \;=\; \{\theta : L(\theta) = \min L\}`}</EqBlock>
      <p>
        is a positive-dimensional analytic variety, generically with singularities — points where{' '}
        <Eq>{String.raw`W_0`}</Eq> fails to be a manifold. Watanabe’s singular learning theory
        handles exactly this situation. Resolving the singularities (Hironaka) puts the KL
        divergence into normal crossing form, and the Bayesian free energy acquires the asymptotic
        expansion
      </p>
      <EqBlock>{String.raw`F_n \;=\; n L_n(\theta_*) \;+\; \lambda \log n \;-\; (m - 1) \log \log n \;+\; O_p(1),`}</EqBlock>
      <p>
        where <Eq>{String.raw`\lambda`}</Eq> is the real log canonical threshold (RLCT) and{' '}
        <Eq>{String.raw`m`}</Eq> its multiplicity. For regular models{' '}
        <Eq>{String.raw`\lambda = d/2`}</Eq> and one recovers BIC; for singular models{' '}
        <Eq>{String.raw`\lambda \le d/2`}</Eq>, often dramatically so. The RLCT is the honest
        effective dimension of the model: a billion-parameter network sitting in a deeply singular
        region behaves, statistically, like a far smaller one. Flat directions are not a nuisance —
        they are the mechanism of generalization.
      </p>

      <h2>5&nbsp;&nbsp;Implicit bias</h2>
      <p>
        Even without explicit regularization the optimizer prefers certain minimizers. For
        overparameterized least squares initialized at the origin, gradient flow converges to the
        minimum-norm interpolant,
      </p>
      <EqBlock>{String.raw`\theta_\infty \;=\; \arg\min_{\theta} \|\theta\|_2 \quad \text{s.t.} \quad X\theta = y,`}</EqBlock>
      <p>
        and for logistic-type losses on separable data the direction of{' '}
        <Eq>{String.raw`\theta_t`}</Eq> converges to the max-margin separator. Stochasticity adds a
        further selection principle: the covariance of minibatch noise scales anisotropically with
        curvature, biasing SGD toward wide basins — the same basins singular learning theory
        already flags as low-RLCT.
      </p>

      <h2>6&nbsp;&nbsp;Coda: the manifold below</h2>
      <p>
        All of this happens above a second geometry: the data itself concentrates near a
        low-dimensional manifold <Eq>{String.raw`\mathcal{M} \subset \mathbb{R}^D`}</Eq> with{' '}
        <Eq>{String.raw`\dim \mathcal{M} \ll D`}</Eq>. A trained network is a chart-builder — its
        layers compose into coordinates in which <Eq>{String.raw`\mathcal{M}`}</Eq> flattens and
        the label function becomes simple. The geometry of the parameter landscape and the geometry
        of the data manifold are not two subjects; the first is the shadow the second casts on{' '}
        <Eq>{String.raw`\mathbb{R}^d`}</Eq>.
      </p>

      <div className="paper-refs">
        <div className="refs-head">References</div>
        <ol>
          <li>
            S. Amari. <i>Information Geometry and Its Applications.</i> Springer, 2016.
          </li>
          <li>
            A. Jacot, F. Gabriel, C. Hongler. “Neural Tangent Kernel: Convergence and
            Generalization in Neural Networks.” <i>NeurIPS</i>, 2018.
          </li>
          <li>
            S. Watanabe. <i>Algebraic Geometry and Statistical Learning Theory.</i> Cambridge
            University Press, 2009.
          </li>
          <li>
            D. Soudry, E. Hoffer, M. S. Nacson, S. Gunasekar, N. Srebro. “The Implicit Bias of
            Gradient Descent on Separable Data.” <i>JMLR</i> 19, 2018.
          </li>
        </ol>
      </div>
    </>
  )
}
