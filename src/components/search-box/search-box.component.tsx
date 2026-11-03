import "./search-box.styles.css";
import { ChangeEventHandler } from "react";


type SeacrhBoxProps = {
  className: string;
  value: string;
  placeholder?: string,
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

 

const SeacrhBox = ({ className, value, placeholder, onChangeHandler } :SeacrhBoxProps ) => (
  <input
    className={`search-box ${className}`}
    type="search"
    value={value}
    placeholder={placeholder}
    onChange={onChangeHandler}
  />
);

export default SeacrhBox;
