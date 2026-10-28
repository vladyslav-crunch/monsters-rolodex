import "./App.css";
import CardList from "./components/card-list/card-list.component";
import SeacrhBox from "./components/search-box/search-box.component";
import StatePanel from "./components/state-panel/state-panel.component";
import { useCallback, useState, ChangeEvent } from "react";
import { useEffect } from "react";

import { getData } from "./utils/data.utils";

export type Monster = {
  id: string;
  name: string;
  email: string;
}

type LoadStatus = "loading" | "ready" | "error";

const getCountLabel = (
  loadStatus: LoadStatus,
  shownCount: number,
  totalCount: number,
  searchFiled: string
): string => {
  if (loadStatus === "loading") {
    return "loading monsters…";
  }
  if (loadStatus === "error") {
    return "couldn't load the roster";
  }
  if (searchFiled.length > 0) {
    return `${shownCount} of ${totalCount} match “${searchFiled}”`;
  }
  return `${totalCount} monsters · showing all`;
};

const App = () => {
  const [searchFiled, setSearchField] = useState("");
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [filteredMonsters, setFilterMonsters] = useState(monsters);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");

  const loadMonsters = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const users = await getData<Monster[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      setMonsters(users);
      setLoadStatus("ready");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    loadMonsters();
  }, [loadMonsters]);

  const onSearchChange = (event:ChangeEvent<HTMLInputElement>):void => {
    setSearchField(event.target.value);
  };

  const onClearSearch = ():void => {
    setSearchField("");
  };

  useEffect(() => {
    const newfilteredMonsters = monsters.filter((monster) => {
      return monster.name.toLowerCase().includes(searchFiled.toLowerCase());
    });
    setFilterMonsters(newfilteredMonsters);
  }, [monsters, searchFiled]);

  const noMatches =
    loadStatus === "ready" &&
    searchFiled.length > 0 &&
    filteredMonsters.length === 0;

  const countLabel = getCountLabel(
    loadStatus,
    filteredMonsters.length,
    monsters.length,
    searchFiled
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Monsters Rolodex</h1>
        <SeacrhBox
          id="monsters-search"
          className="monsters-search-box"
          label="Search monsters"
          value={searchFiled}
          placeholder="search monsters"
          onChangeHandler={onSearchChange}
        />
      </header>
      <p className="monsters-count" role="status">
        {countLabel}
      </p>
      {loadStatus === "error" ? (
        <StatePanel
          title="We couldn't reach the monster directory"
          text="Check your connection, then try again — nothing you typed is lost."
          actionLabel="Try again"
          onAction={loadMonsters}
        />
      ) : noMatches ? (
        <StatePanel
          title={`No monsters match “${searchFiled}”`}
          text={`Try a shorter name, or clear the search to see all ${monsters.length}.`}
          actionLabel="Clear search"
          onAction={onClearSearch}
        />
      ) : (
        <CardList monsters={filteredMonsters} />
      )}
    </div>
  );
};

export default App;
