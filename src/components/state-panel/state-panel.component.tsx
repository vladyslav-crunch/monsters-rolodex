import "./state-panel.styles.css";

type StatePanelProps = {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
}

const StatePanel = ({ title, text, actionLabel, onAction } :StatePanelProps ) => (
  <div className="state-panel-wrap">
    <div className="state-panel">
      <p className="state-panel-title">{title}</p>
      <p className="state-panel-text">{text}</p>
      <button className="state-panel-button" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  </div>
);

export default StatePanel;
