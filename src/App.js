import "./App.css";
import CardList from "./components/card-list/card-list.component";
import SeacrhBox from "./components/search-box/search-box.component";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [searchFiled, setSearchField] = useState("");
  const [monsters, setMonsters] = useState([]);
  const [filteredMonsters, setFilterMonsters] = useState(monsters);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((users) => setMonsters(users));
  }, []);

  const onSearchChange = (event) => {
    const searchFiledString = event.target.value.toLowerCase();
    setSearchField(searchFiledString);
  };

  useEffect(() => {
    const newfilteredMonsters = monsters.filter((monster) => {
      return monster.name.toLowerCase().includes(searchFiled);
    });
    setFilterMonsters(newfilteredMonsters);
  }, [monsters, searchFiled]);

  return (
    <div className="App">
      <h1 className="app-title">Monsters Rolodex</h1>
      <SeacrhBox
        onChangeHandler={onSearchChange}
        placeholder="search monsters"
        className="monsters-search-box"
      />
      <CardList monsters={filteredMonsters} />
    </div>
  );
};

export default App;
