import "./search-box.styles.css";
import { ChangeEventHandler, useId } from "react";


type SeacrhBoxProps = {
  className: string;
  value: string;
  label?: string,
  placeholder?: string,
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

const SeacrhBox = ({ className, value, label = "search monsters", placeholder, onChangeHandler } :SeacrhBoxProps ) => {
  const inputId = useId();

  return (
    <>
      <label className="search-box-label" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`search-box ${className}`}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={onChangeHandler}
      />
    </>
  );
};

export default SeacrhBox;
