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

type LoadStatus = "loading" | "ready" | "error";

const describeResults = (
  status: LoadStatus,
  query: string,
  matchCount: number,
  total: number
): string => {
  if (status === "loading") return "loading monsters…";
  if (status === "error") return "couldn’t load the roster";
  if (!query) return `${total} monsters`;
  if (matchCount === 0) return `no monsters match “${query}”`;
  return `${matchCount} of ${total} monsters match “${query}”`;
};

const App = () => {
  const [searchFiled, setSearchField] = useState("");
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [fetchAttempt, setFetchAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async (): Promise<void> => {
      try {
        const users = await getData<Monster[]>("https://jsonplaceholder.typicode.com/users")
        if (cancelled) return;
        setMonsters(users);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("error");
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [fetchAttempt]);

  const onSearchChange = (event:ChangeEvent<HTMLInputElement>):void => {
    setSearchField(event.target.value);
  };

  const onClearSearch = ():void => {
    setSearchField("");
  };

  const onRetryFetch = ():void => {
    setStatus("loading");
    setFetchAttempt((attempt) => attempt + 1);
  };

  const trimmedSearch = searchFiled.trim();
  const query = trimmedSearch.toLowerCase();
  const filteredMonsters = query
    ? monsters.filter((monster) => monster.name.toLowerCase().includes(query))
    : monsters;
  const noMatches = status === "ready" && query !== "" && filteredMonsters.length === 0;

  return (
    <div className="App">
      <h1 className="app-title">Monsters Rolodex</h1>
      <SeacrhBox
        value={searchFiled}
        onChangeHandler={onSearchChange}
        placeholder="search monsters"
        className="monsters-search-box"
      />
      <p className="search-status" role="status">
        {describeResults(status, trimmedSearch, filteredMonsters.length, monsters.length)}
      </p>
      {noMatches && (
        <div className="search-panel">
          <p className="search-panel-title">no monsters match “{trimmedSearch}”</p>
          <p className="search-panel-hint">
            try a shorter name, or clear the search to see all {monsters.length}.
          </p>
          <button className="search-panel-action" type="button" onClick={onClearSearch}>
            Clear search
          </button>
        </div>
      )}
      {status === "error" && (
        <div className="search-panel">
          <p className="search-panel-title">couldn’t reach the monster directory</p>
          <p className="search-panel-hint">check your connection, then try again.</p>
          <button className="search-panel-action" type="button" onClick={onRetryFetch}>
            Try again
          </button>
        </div>
      )}
      {status === "ready" && <CardList monsters={filteredMonsters} />}
    </div>
  );
};

export default App;
