import { useState, useEffect } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const apiUrl = "http://localhost:8000";

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(`${apiUrl}/todos`)
            .then((res) => res.json())
            .then((res) => setTodos(res))
            .catch(() => setError("Unable to fetch todos"));
    };

    const handleEdit = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
    };

    const handleUpdate = async () => {
        setError("");
        if (editTitle.trim() === '' || editDescription.trim() === '') {
            setError('Title and description are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/todos/${editId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                const updatedTodos = todos.map(item =>
                    item._id === editId ? updatedTodo : item
                );

                setTodos(updatedTodos);
                setMessage("Item Updated Successfully");
                setTimeout(() => setMessage(""), 3000);

                setEditId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unable to update Todo item");
            }
        } catch (error) {
            setError("Unable to update Todo item");
        }
    };

    const handleEditCancel = () => {
        setEditId(null);
    };

    const handleSubmit = async () => {
        setError("");
        if (title.trim() === '' || description.trim() === '') {
            setError('Title and description are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                const newTodo = await response.json();
                setTodos([...todos, newTodo]);
                setTitle("");
                setDescription("");
                setMessage("Item Added Successfully");
                setTimeout(() => setMessage(""), 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unable to create Todo item");
            }
        } catch (error) {
            setError("Unable to create Todo item");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/todos/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo._id !== id));
                setMessage("Item Deleted Successfully");
                setTimeout(() => setMessage(""), 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unable to delete Todo item");
            }
        } catch (error) {
            setError("Unable to delete Todo item");
        }
    };

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo Project with MERN stack</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <ul className="list-group">
                    {todos.map(todo => (
                        <li key={todo._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column me-2">
                                {editId === todo._id ? (
                                    <>
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                placeholder="Title"
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                value={editTitle}
                                                className="form-control"
                                                type="text"
                                            />
                                            <input
                                                placeholder="Description"
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                value={editDescription}
                                                className="form-control"
                                                type="text"
                                            />
                                            <button className="btn btn-dark" onClick={handleUpdate}>Update</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="fw-bold">{todo.title}</span>
                                        <span>{todo.description}</span>
                                    </>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                {editId === todo._id ? (
                                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                ) : (
                                    <>
                                        <button className="btn btn-warning" onClick={() => handleEdit(todo)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
