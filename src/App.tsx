import "./App.css";
import CardList from "./components/card-list/card-list.component";
import EmptyState from "./components/empty-state/empty-state.component";
import LoadingState from "./components/loading-state/loading-state.component";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getData<Monster[]>("https://jsonplaceholder.typicode.com/users")
        setMonsters(users)
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const onSearchChange = (event:ChangeEvent<HTMLInputElement>):void => {
    const searchFiledString = event.target.value.toLowerCase();
    setSearchField(searchFiledString);
  };

  const onClearSearch = ():void => {
    setSearchField("");
  };

  const hasSearchQuery = searchFiled.length > 0;
  const hasNoMatches = hasSearchQuery && filteredMonsters.length === 0;

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
        value={searchFiled}
      />
      {isLoading ? (
        <LoadingState />
      ) : hasNoMatches ? (
        <EmptyState query={searchFiled} onClearSearchHandler={onClearSearch} />
      ) : (
        <CardList monsters={filteredMonsters} />
      )}
    </div>
  );
};

export default App;
