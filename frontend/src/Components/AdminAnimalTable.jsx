export default function AnimalTable({ animals, onEdit, onDelete }) {
  return (
    <table style={styles.table}>
      <thead style={styles.thead}>
        <tr>
          {[
            "ID",
            "Code",
            "Nama",
            "Breed",
            "Gender",
            "Lahir",
            "Pemilik",
            "Catatan",
            "Aksi",
          ].map((h) => (
            <th style={styles.th} key={h}>
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {animals.map((a) => (
          <tr key={a.id}>
            <td style={styles.td}>{a.id}</td>
            <td style={styles.td}>{a.animal_code}</td>
            <td style={styles.td}>{a.name}</td>
            <td style={styles.td}>{a.breed}</td>
            <td style={styles.td}>{a.gender}</td>
            <td style={styles.td}>{a.birthdate}</td>
            <td style={styles.td}>{a.owner}</td>
            <td style={styles.td}>{a.notes}</td>

            <td style={styles.td}>
              <button style={styles.btnEdit} onClick={() => onEdit(a)}>
                Edit
              </button>
              <button
                style={styles.btnDelete}
                onClick={() => onDelete(a.id)}
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#1565c0",
    color: "white",
  },
  th: { padding: 10 },
  td: {
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  btnEdit: {
    background: "#64b5f6",
    padding: "6px 8px",
    border: "none",
    marginRight: 5,
    cursor: "pointer",
  },
  btnDelete: {
    background: "#e57373",
    padding: "6px 8px",
    border: "none",
    cursor: "pointer",
  },
};
