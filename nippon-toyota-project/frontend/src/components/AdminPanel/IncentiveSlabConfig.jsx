import { useCallback, useEffect, useState } from "react";

export default function IncentiveSlabConfig() {
  const [slabs, setSlabs] = useState([]);
  const [formData, setFormData] = useState({
    slabName: "",
    minCars: "",
    maxCars: "",
    incentivePerCar: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSlabs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/incentive-slabs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSlabs(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // Initial data load is asynchronous; the state update happens after fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSlabs();
  }, [fetchSlabs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatRange = (slab) => (
    slab.maxCars === null || slab.maxCars === undefined
      ? `${slab.minCars}+`
      : `${slab.minCars} - ${slab.maxCars}`
  );

  const buildSlabPayload = () => ({
    ...formData,
    minCars: parseInt(formData.minCars),
    maxCars: formData.maxCars === "" || formData.maxCars === null
      ? null
      : parseInt(formData.maxCars),
    incentivePerCar: parseFloat(formData.incentivePerCar),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/admin/incentive-slabs/${editingId}`
        : "http://localhost:5000/api/admin/incentive-slabs";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildSlabPayload()),
      });

      if (response.ok) {
        setFormData({
          slabName: "",
          minCars: "",
          maxCars: "",
          incentivePerCar: "",
        });
        setEditingId(null);
        fetchSlabs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slab) => {
    setFormData(slab);
    setEditingId(slab._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/admin/incentive-slabs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSlabs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="incentive-slab-config">
      <h3>Incentive Slab Configuration</h3>
      <p className="info">Configure tiered incentive payouts based on sales volume</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="slabName"
          placeholder="Slab Name (e.g., Bronze)"
          value={formData.slabName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="minCars"
          placeholder="Minimum Cars"
          value={formData.minCars}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="maxCars"
          placeholder="Maximum Cars (blank for no limit)"
          value={formData.maxCars}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="incentivePerCar"
          placeholder="Incentive Per Car (₹)"
          value={formData.incentivePerCar}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : editingId ? "Update" : "Add"} Slab
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Slab Name</th>
            <th>Range (Cars)</th>
            <th>Incentive Per Car (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab) => (
            <tr key={slab._id}>
              <td>{slab.slabName}</td>
              <td>
                {formatRange(slab)}
              </td>
              <td>₹{slab.incentivePerCar}</td>
              <td>
                <button onClick={() => handleEdit(slab)}>Edit</button>
                <button onClick={() => handleDelete(slab._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
