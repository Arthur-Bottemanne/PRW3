import { useState, useEffect } from "react";
import personService from "./services/persons";

import { Persons, PersonForm } from "./components/Person";
import { Filter } from "./components/Filter";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const hasDuplicate = () => {
        const person = persons.find((person) => person.name === newName);

        if (person !== undefined) {
            updatePerson(person);

            return true;
        }

        return false;
    };

    const addPerson = (event) => {
        event.preventDefault();

        if (hasDuplicate()) {
            return;
        }

        const newPerson = {
            name: newName,
            number: newNumber,
            id: (persons.length + 1).toString(),
        };

        personService.create(newPerson).then((createdPerson) => {
            setPersons(persons.concat(createdPerson));
            setNewName("");
            setNewNumber("");
        });
    };

    const updatePerson = (person) => {
        if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
            const newPerson = {
                name: person.name,
                number: newNumber,
            };

            personService.update(person.id, newPerson).then((updatedPerson) => {
                setPersons(
                    persons.map((person) => {
                        if (person.id === updatedPerson.id) {
                            person.number = updatedPerson.number;
                        }
                        return person;
                    }),
                );
                setNewName("");
                setNewNumber("");
            });
        }
    };

    const deletePerson = (id) => {
        const person = persons.find((person) => person.id === id);
        const destroy = window.confirm(`Delete ${person.name}`);

        if (destroy) {
            personService.destroy(id).then(() => {
                const updatedPersons = persons.filter((person) => person.id !== id);
                setPersons(updatedPersons);
            });
        }
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
            <Persons personsToShow={personsToShow} onDelete={deletePerson} />
        </div>
    );
};

export default App;
