import { Eq, EqBlock } from '../components/Katex'

export const meta = {
  slug: 'representation-as-compression',
  title: 'Representation as Compression: An Information-Theoretic Account of Learning',
  date: '2026 · Essay II',
  teaser:
    'Sufficient statistics, the information bottleneck, rate–distortion, and PAC-Bayes are one idea wearing four costumes: a representation is good exactly insofar as it is a short code for what matters.',
  abstract:
    'We reconstruct representation learning from information-theoretic first principles. The classical notion of a minimal sufficient statistic is relaxed into the information bottleneck Lagrangian; variational autoencoders are exhibited as its tractable dual; rate–distortion theory supplies the operational meaning of the trade-off; and PAC-Bayes converts description length into a generalization guarantee. On this reading, the cross-entropy objective of a large language model is a codelength, and scaling laws are empirical rate–distortion curves for natural data.',
}

export default function RepresentationAsCompression() {
  return (
    <>
      <h2>1&nbsp;&nbsp;Sufficiency</h2>
      <p>
        Let <Eq>{String.raw`X`}</Eq> be an observation and <Eq>{String.raw`Y`}</Eq> the variable we
        care about. A statistic <Eq>{String.raw`T = T(X)`}</Eq> is sufficient for{' '}
        <Eq>{String.raw`Y`}</Eq> when it absorbs all the relevant evidence,
      </p>
      <EqBlock>{String.raw`I(T(X); Y) \;=\; I(X; Y),`}</EqBlock>
      <p>
        and minimal sufficient when it is a function of every other sufficient statistic — the
        coarsest summary that loses nothing. Minimal sufficiency is the platonic ideal of a learned
        representation, but for natural data exact sufficiency is unattainable and the ideal must
        be relaxed to a trade-off.
      </p>

      <h2>2&nbsp;&nbsp;The bottleneck</h2>
      <p>
        Tishby’s information bottleneck makes the relaxation quantitative. Among stochastic
        encoders <Eq>{String.raw`p(z \mid x)`}</Eq> forming the Markov chain{' '}
        <Eq>{String.raw`Y \leftrightarrow X \leftrightarrow Z`}</Eq>, minimize
      </p>
      <EqBlock>{String.raw`\mathcal{L}_{\mathrm{IB}} \;=\; I(X; Z) \;-\; \beta\, I(Z; Y),`}</EqBlock>
      <p>
        compressing the input (small <Eq>{String.raw`I(X;Z)`}</Eq>) while preserving relevance
        (large <Eq>{String.raw`I(Z;Y)`}</Eq>). The data-processing inequality pins the ceiling,
      </p>
      <EqBlock>{String.raw`I(Z; Y) \;\le\; I(X; Y),`}</EqBlock>
      <p>
        so the multiplier <Eq>{String.raw`\beta`}</Eq> traces a frontier of representations from
        trivial to sufficient. Whether SGD training implicitly follows this frontier — the famous
        “compression phase” — remains contested; the objective itself needs no such empirical
        claim to be the right normative target.
      </p>

      <h2>3&nbsp;&nbsp;The variational dual</h2>
      <p>
        Mutual information is intractable at scale, but it admits variational bounds, and the
        bounds are precisely the objectives we already train. For a latent-variable model{' '}
        <Eq>{String.raw`p_\theta(x, z) = p(z)\, p_\theta(x \mid z)`}</Eq> with approximate
        posterior <Eq>{String.raw`q_\phi(z \mid x)`}</Eq>, Jensen’s inequality gives the evidence
        lower bound
      </p>
      <EqBlock>{String.raw`\log p_\theta(x) \;\ge\; \mathbb{E}_{q_\phi(z \mid x)}\!\big[\log p_\theta(x \mid z)\big] \;-\; D_{\mathrm{KL}}\!\big(q_\phi(z \mid x)\,\|\,p(z)\big).`}</EqBlock>
      <p>
        Weight the KL term by <Eq>{String.raw`\beta`}</Eq> and this is the bottleneck Lagrangian in
        disguise: the KL is an upper bound on the rate <Eq>{String.raw`I(X;Z)`}</Eq>, the
        reconstruction term a lower bound on the preserved information. A β-VAE is an information
        bottleneck that compiles.
      </p>

      <h2>4&nbsp;&nbsp;Operational meaning: rate–distortion</h2>
      <p>Shannon’s rate–distortion function gives the trade-off its operational teeth:</p>
      <EqBlock>{String.raw`R(D) \;=\; \min_{p(\hat{x} \mid x)\,:\; \mathbb{E}[d(X, \hat{X})] \le D} I(X; \hat{X})`}</EqBlock>
      <p>
        is the fewest bits per symbol at which <Eq>{String.raw`X`}</Eq> can be reproduced within
        distortion <Eq>{String.raw`D`}</Eq>. Every learned representation implicitly sits on some
        rate–distortion curve for some distortion measure; the art of representation learning is
        choosing the distortion so that the bits the code keeps are the bits the task needs.
        Perceptual codecs, tokenizers, and embedding models differ only in{' '}
        <Eq>{String.raw`d(\cdot,\cdot)`}</Eq>.
      </p>

      <h2>5&nbsp;&nbsp;Compression implies generalization</h2>
      <p>
        Description length is not merely an aesthetic. The PAC-Bayes theorem converts it into a
        guarantee: for prior <Eq>{String.raw`P`}</Eq> fixed before seeing data and any posterior{' '}
        <Eq>{String.raw`Q`}</Eq> over hypotheses, with probability at least{' '}
        <Eq>{String.raw`1 - \delta`}</Eq>,
      </p>
      <EqBlock>{String.raw`\mathbb{E}_{h \sim Q}\big[L(h)\big] \;\le\; \mathbb{E}_{h \sim Q}\big[\widehat{L}_n(h)\big] \;+\; \sqrt{\frac{D_{\mathrm{KL}}(Q \,\|\, P) + \ln\!\frac{2\sqrt{n}}{\delta}}{2n}}.`}</EqBlock>
      <p>
        The complexity penalty is a KL divergence — the number of extra bits needed to encode the
        learned hypothesis against the prior. Models that can be described briefly relative to what
        was believed before training provably generalize; MDL’s two-part code and Occam’s razor
        are the <Eq>{String.raw`n \to \infty`}</Eq> shadow of the same inequality.
      </p>

      <h2>6&nbsp;&nbsp;Language models as codes</h2>
      <p>
        A language model trained with cross-entropy is, literally, a compressor. Its loss on the
        true source <Eq>{String.raw`p`}</Eq> decomposes as
      </p>
      <EqBlock>{String.raw`H(p, q_\theta) \;=\; H(p) \;+\; D_{\mathrm{KL}}(p \,\|\, q_\theta),`}</EqBlock>
      <p>
        an irreducible entropy of natural language plus the model’s excess codelength, and
        arithmetic coding turns <Eq>{String.raw`q_\theta`}</Eq> into an actual codec achieving that
        rate. On this view the empirical scaling law
      </p>
      <EqBlock>{String.raw`L(N, D) \;=\; E \;+\; \frac{A}{N^{\alpha}} \;+\; \frac{B}{D^{\beta}}`}</EqBlock>
      <p>
        is a measured rate curve: <Eq>{String.raw`E`}</Eq> estimates the entropy floor of the
        source, and the power-law terms price out how many parameters and how much data it costs
        to close the KL gap. That “intelligence” tracks compression this tightly is the deepest
        empirical fact we have about learned representations — and the least explained.
      </p>

      <div className="paper-refs">
        <div className="refs-head">References</div>
        <ol>
          <li>
            N. Tishby, F. C. Pereira, W. Bialek. “The Information Bottleneck Method.”{' '}
            <i>Proc. Allerton Conference</i>, 1999.
          </li>
          <li>
            D. P. Kingma, M. Welling. “Auto-Encoding Variational Bayes.” <i>ICLR</i>, 2014.
          </li>
          <li>
            T. M. Cover, J. A. Thomas. <i>Elements of Information Theory.</i> Wiley, 2006.
          </li>
          <li>
            D. A. McAllester. “Some PAC-Bayesian Theorems.” <i>Machine Learning</i> 37, 1999.
          </li>
          <li>
            J. Hoffmann et al. “Training Compute-Optimal Large Language Models.” <i>NeurIPS</i>,
            2022.
          </li>
        </ol>
      </div>
    </>
  )
}
