import { useCallback, useEffect, useState } from "react";

export default function CarInventory() {
  const [carModels, setCarModels] = useState([]);
  const [formData, setFormData] = useState({
    modelName: "",
    baseSuffix: "",
    variant: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCarModels = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/car-models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCarModels(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // Initial data load is asynchronous; the state update happens after fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCarModels();
  }, [fetchCarModels]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/admin/car-models/${editingId}`
        : "http://localhost:5000/api/admin/car-models";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ modelName: "", baseSuffix: "", variant: "" });
        setEditingId(null);
        fetchCarModels();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carModel) => {
    setFormData(carModel);
    setEditingId(carModel._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/admin/car-models/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchCarModels();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="car-inventory">
      <h3>Car Inventory Management</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="modelName"
          placeholder="Model Name (e.g., Fortuner)"
          value={formData.modelName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="baseSuffix"
          placeholder="Base Suffix (e.g., 4x2)"
          value={formData.baseSuffix}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="variant"
          placeholder="Variant (e.g., Diesel Manual)"
          value={formData.variant}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : editingId ? "Update" : "Add"} Car Model
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Base Suffix</th>
            <th>Variant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carModels.map((car) => (
            <tr key={car._id}>
              <td>{car.modelName}</td>
              <td>{car.baseSuffix}</td>
              <td>{car.variant}</td>
              <td>
                <button onClick={() => handleEdit(car)}>Edit</button>
                <button onClick={() => handleDelete(car._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
