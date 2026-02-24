import { useState, useEffect } from "react";
import axios from "axios";

import { CountryDetail } from "./components/CountryDetail";

const Content = ({ countries, setFilteredCountries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1 && countries.length <= 10) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => setFilteredCountries([country])}>show</button>
          </li>
        ))}
      </ul>
    );
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  return null;
};

const App = () => {
  const [search, setSearch] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setAllCountries(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    const matches = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredCountries(matches);
  };

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <Content
        countries={filteredCountries}
        setFilteredCountries={setFilteredCountries}
      />
    </div>
  );
};

export default App;
