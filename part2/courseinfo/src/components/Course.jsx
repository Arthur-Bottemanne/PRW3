const Header = ({ name }) => {
    return <h1>{name}</h1>;
};

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    );
};

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map((part) => (
                <Part key={part.id} part={part} />
            ))}
        </div>
    );
};

const Total = ({ course }) => {
    const parts = course.parts;
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);

    return (
        <b>
            <p>total of {total} exercises</p>
        </b>
    );
};

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <Content course={course} />
            <Total course={course} />
        </div>
    );
};

export default Course;
