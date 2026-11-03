import "./loading-state.styles.css";

const LoadingState = () => (
  <div className="loading-state" role="status">
    <p className="loading-state-message">Summoning monsters…</p>
    <div className="loading-state-dots" aria-hidden="true">
      <span className="loading-state-dot" />
      <span className="loading-state-dot" />
      <span className="loading-state-dot" />
    </div>
  </div>
);

export default LoadingState;
