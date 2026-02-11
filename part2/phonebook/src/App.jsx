import axios from "axios";
import { useState, useEffect } from "react";

import { Persons, PersonForm } from "./components/Person";
import { Filter } from "./components/Filter";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3001/persons").then((response) => {
            setPersons(response.data);
        });
    }, []);

    const validateForm = () => {
        const nameExists = persons.some((person) => person.name === newName);

        if (nameExists) {
            alert(`${newName} is already added to phonebook`);
            return false;
        }

        return true;
    };

    const addPerson = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newPerson = {
            name: newName,
            number: newNumber,
            id: persons.length + 1,
        };

        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
    };

    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);

    const personsToShow =
        searchTerm === ""
            ? persons
            : persons.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={searchTerm} onChange={handleSearchChange} />

            <h2>add a new</h2>
            <PersonForm
                onSubmit={addPerson}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
                nameValue={newName}
                numberValue={newNumber}
            />

            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} />
        </div>
    );
};

export default App;
