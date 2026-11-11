const readings = [
  { source: 'Field report', value: 'Wind from north' },
  { source: 'Station log', value: 'Wind from south' },
]

export function ReportComparison() {
  return <figure className="report-comparison">
    <div className="report-panels">
      <section className="report-panel" aria-labelledby="manual-review">
        <h2 id="manual-review">Manual review</h2>
        <ul className="report-records">{readings.map(reading => <li key={reading.source}>
          <span>{reading.source}</span><strong>{reading.value}</strong>
        </li>)}</ul>
        <p>Reviewer spots the mismatch.</p>
      </section>
      <section className="report-panel" aria-labelledby="side-by-side-view">
        <h2 id="side-by-side-view">Side-by-side view</h2>
        <ul className="report-records">{readings.map(reading => <li key={reading.source}>
          <span>{reading.source}</span><strong>{reading.value}</strong>
        </li>)}</ul>
        <p><span className="conflict-mark" aria-hidden="true">!</span> The mismatch is flagged.</p>
      </section>
    </div>
    <figcaption>Fictional example · Both readings are recorded at 09:00.</figcaption>
  </figure>
}

export function TransportMap() {
  return <figure className="concept-map">
    <div className="transport-map" role="group" aria-label="An update travels from a field device through a shared link to two teams">
      <span className="map-node">Field device</span>
      <span className="map-node map-hub">Communications link</span>
      <ul className="map-branches">
        <li className="map-node">Team A</li><li className="map-node">Team B</li>
      </ul>
    </div>
    <figcaption>One update can reach multiple teams.</figcaption>
  </figure>
}

export function AlertGrid({ resolved }: { resolved: boolean }) {
  return <figure className="alert-chart">
    <div className="alert-grid" aria-hidden="true">
      {Array.from({ length: 59 }, (_, index) => <span key={index} className={resolved ? (index < 9 ? 'confirmed' : 'false-positive') : undefined} />)}
    </div>
    <figcaption>
      {resolved ? <>
        <span><i className="confirmed" aria-hidden="true" /> 9 correct alerts</span>
        <span><i className="false-positive" aria-hidden="true" /> 50 false positives</span>
      </> : <span>59 alerts among 1,000 objects · one marker per alert</span>}
    </figcaption>
  </figure>
}

export function AgentLoop() {
  return <figure className="concept-map">
    <ol className="agent-loop" aria-label="The model calls a permitted tool, receives its result, and can choose another action">
      <li className="map-node">Model</li>
      <li className="map-node map-hub">Permitted tool</li>
      <li className="map-node">Observed result</li>
    </ol>
    <p className="return-line"><span>Result returns to the model</span></p>
    <figcaption>The model can use the result as context for its next decision.</figcaption>
  </figure>
}
