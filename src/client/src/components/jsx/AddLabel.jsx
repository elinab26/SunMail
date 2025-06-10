import { useState } from "react";
import "../css/AddLabel.css";

function AddLabel({ userId, onLabelAdded }) {
  const [labelName, setLabelName] = useState("");

  async function addLabelHandler(event) {
    event.preventDefault();
    const label = { name: labelName };
    const res = await fetch("http://localhost:8080/api/labels", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,  // <-- ici c'est dynamique
      },
      body: JSON.stringify(label),
    });
    if (res.status !== 201) {
      alert("Label already exists");
    } else {
      setLabelName("");
      await onLabelAdded();   // <--- Ici on recharge la liste complète
    }
  }

  return (
    <div>
      <form onSubmit={addLabelHandler}>
        <input
          id="inputLabel"
          name="name"
          placeholder="Label Name"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
        <button className="button" id="addButton" type="submit">
          +
        </button>
      </form>
    </div>
  );
}

export default AddLabel;
