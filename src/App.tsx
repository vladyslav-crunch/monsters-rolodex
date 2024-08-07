import "./App.css";
import CardList from "./components/card-list/card-list.component";
import SeacrhBox from "./components/search-box/search-box.component";
import { useState, ChangeEvent } from "react";
import { useEffect } from "react";

import { getData } from "./utils/data.utils";

export type Monster = {
  id: string;
  name: string;
  email: string;
}

const App = () => {
  const [searchFiled, setSearchField] = useState("");
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [filteredMonsters, setFilterMonsters] = useState(monsters);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getData<Monster[]>("https://jsonplaceholder.typicode.com/users")
      setMonsters(users)
    }
    fetchUsers();
  }, []);

  const onSearchChange = (event:ChangeEvent<HTMLInputElement>):void => {
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
