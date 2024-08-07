import "./search-box.styles.css";
import { ChangeEventHandler } from "react";


type SeacrhBoxProps = {
  className: string; 
  placeholder?: string,
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
}

 

const SeacrhBox = ({ className, placeholder, onChangeHandler } :SeacrhBoxProps ) => (
  <input
    className={`search-box ${className}`}
    type="search"
    placeholder={placeholder}
    onChange={onChangeHandler}
  />
);

export default SeacrhBox;
