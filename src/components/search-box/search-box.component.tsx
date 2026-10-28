import "./search-box.styles.css";
import { ChangeEventHandler } from "react";


type SeacrhBoxProps = {
  id: string;
  className: string;
  label: string;
  value: string;
  placeholder?: string,
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

 

const SeacrhBox = ({ id, className, label, value, placeholder, onChangeHandler } :SeacrhBoxProps ) => (
  <div className="search-box-group">
    <label className="search-box-label" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      className={`search-box ${className}`}
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={onChangeHandler}
    />
  </div>
);

export default SeacrhBox;
