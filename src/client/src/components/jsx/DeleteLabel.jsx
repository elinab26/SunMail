import { useState } from "react";
import "../css/DeleteLabel.css";

function DeleteLabel({ labelId, onDeleted, close }) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function deleteLabelHandler() {
    const res = await fetch(`http://localhost:8080/api/labels/${labelId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status !== 204) {
      alert("Error deleting label");
    } else {
      await onDeleted();
      close();
    }
  }

  function handleDelete() {
    setIsConfirming(true);
  }

  function handleConfirm() {
    deleteLabelHandler();
  }

  function handleCancel() {
    setIsConfirming(false);
    close();
  }

  if (isConfirming) {
    return (
      <div className="deleteConfirmation">
        <p>Are you sure you want to delete this label?</p>
        <div className="confirmButtons">
          <button onClick={handleConfirm} className="confirmButtonDelete">
            Yes, Delete
          </button>
          <button onClick={handleCancel} className="cancelButtonDelete">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="popupOption deleteOption" onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteLabel;
