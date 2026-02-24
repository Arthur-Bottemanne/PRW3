import { useState, useEffect } from "react";

import personService from "./services/persons";
import { Persons, PersonForm } from "./components/Person";
import { Filter } from "./components/Filter";
import { Notification } from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [infoMessage, setInfoMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const notify = (message, type = "success") => {
        setInfoMessage(message);
        setMessageType(type);
        setTimeout(() => {
            setInfoMessage(null);
        }, 5000);
    };

    const addPerson = (event) => {
        event.preventDefault();
        const existingPerson = persons.find((p) => p.name === newName);

        if (existingPerson) {
            updatePerson(existingPerson);
            return;
        }

        const newPerson = {
            name: newName,
            number: newNumber,
            id: (persons.length + 1).toString(),
        };

        personService.create(newPerson).then((createdPerson) => {
            setPersons(persons.concat(createdPerson));
            notify(`Added ${createdPerson.name}`);
            setNewName("");
            setNewNumber("");
        });
    };

    const updatePerson = (person) => {
        if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
            const changedPerson = { ...person, number: newNumber };

            personService
                .update(person.id, changedPerson)
                .then((returnedPerson) => {
                    setPersons(persons.map((p) => (p.id !== person.id ? p : returnedPerson)));
                    notify(`Updated ${returnedPerson.name}'s number`);
                    setNewName("");
                    setNewNumber("");
                })
                .catch((error) => {
                    notify(`Information of ${person.name} has already been removed from server`, "error");
                    setPersons(persons.filter((p) => p.id !== person.id));
                });
        }
    };

    const deletePerson = (id) => {
        const person = persons.find((p) => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            personService.destroy(id).then(() => {
                setPersons(persons.filter((p) => p.id !== id));
                notify(`Deleted ${person.name}`);
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
            <Notification message={infoMessage} type={messageType} />

            <Filter value={searchTerm} onChange={handleSearchChange} />

            <h3>Add a new</h3>
            <PersonForm
                onSubmit={addPerson}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
                nameValue={newName}
                numberValue={newNumber}
            />

            <h3>Numbers</h3>
            <Persons personsToShow={personsToShow} onDelete={deletePerson} />
        </div>
    );
};

export default App;
