import React, { useState, useEffect } from "react";
const API = process.env.REACT_APP_API;

export const Users = () => {
  const [nombre, setnombre] = useState("");
  const [correo, setcorreo] = useState("");
  const [foto, setfoto] = useState("");
  const [mascotas, setMascotas] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editing) {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          foto: foto,
          mascotas: mascotas,
        }),
      });
      const data = await res.json();
      console.log(data);
    } else {
      await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          foto: foto,
          mascotas: mascotas,
        }),
      });

      setEditing(false);
      setId("");
    }

    await getUsers();
    await getFoto();

    setcorreo("");
    setnombre("");
    setfoto("");
    setMascotas("");
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  const getFoto = async () => {
    const res = await fetch(`${API}/face`);
    const data = await res.json();
    setfoto(data);
  };


  useEffect(() => {
    getUsers();
    getFoto();
  }, []);

  const deleteUser = async (id) => {
    const userResponse = window.confirm("¿Eliminar este dato?");
    if (userResponse) {
      await fetch(`${API}/users/${id}`, {
        method: "DELETE",
      });
      await getUsers();
      await getFoto();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/user/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(data._id);

    setnombre(data.nombre);
    setfoto(data.foto);
    setcorreo(data.correo);
    setMascotas(data.mascotas);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <img width="200px" height="200px" alt="" src={foto} />
        <form onSubmit={handleSubmit} className="card card-body">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              onChange={(e) => setnombre(e.target.value)}
              value={nombre}
              className="form-control"
              placeholder="nombre"
              autoFocus
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              onChange={(e) => setcorreo(e.target.value)}
              value={correo}
              className="form-control"
              placeholder="correo"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              onChange={(e) => setMascotas(e.target.value)}
              value={mascotas}
              className="form-control"
              placeholder="Mascotas"
            />
          </div>
          <button className="btn btn-primary btn-block form-control">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
      <div className="col-md-8">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fotografia</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Animales</th>
              <th>Funciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img src={user.foto} width="100px" height="100px" alt="" />
                </td>
                <td>{user.nombre}</td>
                <td>{user.correo}</td>
                <td className="text-center">
                  <button>
                    <img
                      src="https://icon-library.com/images/drop-down-arrow-icon/drop-down-arrow-icon-4.jpg"
                      width="20px"
                      height="20px"
                      alt=""
                    />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-m btn-block"
                    onClick={(e) => editUser(user._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-m btn-block"
                    onClick={(e) => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
