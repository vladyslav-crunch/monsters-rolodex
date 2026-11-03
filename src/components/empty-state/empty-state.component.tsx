import "./empty-state.styles.css";

type EmptyStateProps = {
  query: string;
  onClearSearchHandler: () => void;
};

const EmptyState = ({ query, onClearSearchHandler }: EmptyStateProps) => (
  <div className="empty-state" role="status">
    <h2 className="empty-state-title">No monsters match “{query}”</h2>
    <p className="empty-state-message">Try a different name.</p>
    <button
      className="empty-state-button"
      type="button"
      onClick={onClearSearchHandler}
    >
      Show all monsters
    </button>
  </div>
);

export default EmptyState;
