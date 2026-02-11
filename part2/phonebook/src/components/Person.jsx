export const PersonForm = ({ onSubmit, onNameChange, onNumberChange, nameValue, numberValue }) => (
    <form onSubmit={onSubmit}>
        <div>
            name: <input value={nameValue} onChange={onNameChange} />
        </div>
        <div>
            number: <input value={numberValue} onChange={onNumberChange} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
);

export const Persons = ({ personsToShow, onDelete }) => (
    <div>
        {personsToShow.map((person) => (
            <p key={person.id}>
                {person.name} {person.number} <button onClick={() => onDelete(person.id)}>delete</button>
            </p>
        ))}
    </div>
);
