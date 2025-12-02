import React, { useEffect, useState } from "react";

export default function AnimalForm({ onSubmit, initial }) {
  const defaultForm = {
    animal_code: "",
    name: "",
    breed: "",
    gender: "unknown",
    birthdate: "",
    owner: "",
    notes: "",
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setForm(initial || defaultForm);
  }, [initial]);

  const change = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!initial) setForm(defaultForm);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        placeholder="Animal Code"
        value={form.animal_code}
        onChange={(e) => change("animal_code", e.target.value)}
        style={styles.input}
        required
      />

      <input
        placeholder="Nama Hewan"
        value={form.name}
        onChange={(e) => change("name", e.target.value)}
        style={styles.input}
        required
      />

      <input
        placeholder="Breed"
        value={form.breed}
        onChange={(e) => change("breed", e.target.value)}
        style={styles.input}
      />

      <select
        value={form.gender}
        onChange={(e) => change("gender", e.target.value)}
        style={styles.input}
      >
        <option value="unknown">Unknown</option>
        <option value="male">Jantan</option>
        <option value="female">Betina</option>
      </select>

      <input
        type="date"
        value={form.birthdate}
        onChange={(e) => change("birthdate", e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Pemilik"
        value={form.owner}
        onChange={(e) => change("owner", e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Catatan"
        value={form.notes}
        onChange={(e) => change("notes", e.target.value)}
        style={{ ...styles.input, minHeight: 60 }}
      />

      <button type="submit" style={styles.button}>
        {initial ? "Update" : "Tambah"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #90caf9",
  },
  button: {
    background: "#1565c0",
    color: "white",
    padding: 10,
    border: "none",
    borderRadius: 6,
  },
};
