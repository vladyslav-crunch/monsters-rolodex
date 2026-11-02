import "./search-box.styles.css";
import { ChangeEventHandler, useId } from "react";


type SeacrhBoxProps = {
  className: string; 
  label: string;
  placeholder?: string,
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

 

const SeacrhBox = ({ className, label, placeholder, onChangeHandler } :SeacrhBoxProps ) => {
  const inputId = useId();

  return (
    <div className={`search-box-container ${className}`}>
      <label className="search-box-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="search-box"
        type="search"
        placeholder={placeholder}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default SeacrhBox;
