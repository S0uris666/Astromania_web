const ProfileForm = ({ values, onFieldChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFieldChange(name, value);
  };

  return (
    <section className="card bg-base-200 shadow-md">
      <div className="card-body space-y-4">
        <h2 className="card-title text-lg">Informacion profesional</h2>

        <label className="form-control w-full">
          <span className="label-text">Nombre</span>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            className="input"
            placeholder="Tu nombre de perfil"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Correo</span>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="input"
            placeholder="Tu email de contacto"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Visibilidad del perfil</span>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="published">Visible para la comunidad</option>
            <option value="draft">Oculto (modo borrador)</option>
          </select>
        </label>

        <label className="form-control w-full">
          <span className="label-text">Profesion</span>
          <input
            type="text"
            name="profesion"
            value={values.profesion}
            onChange={handleChange}
            className="input"
            placeholder="Astrofisico, Divulgador cientifico, etc."
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Especializacion</span>
          <input
            type="text"
            name="especializacion"
            value={values.especializacion}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Cosmologia, Observacion, Educacion..."
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Ciudad</span>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Valparaiso, Santiago, Concepcion..."
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Descripcion</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            className="textarea textarea-bordered min-h-[140px]"
            placeholder="Comparte tu trayectoria y enfoque como divulgador."
          />
        </label>
      </div>
    </section>
  );
};

export default ProfileForm;
