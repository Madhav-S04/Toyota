import { useCallback, useEffect, useState } from "react";

export default function SalesCalculator() {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7);
  });
  const [salesData, setSalesData] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [incentiveDetails, setIncentiveDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatSlab = (slab) => ({
    name: slab.slabName || slab.name,
    range: slab.range || (
      slab.maxCars === null || slab.maxCars === undefined
        ? `${slab.minCars}+`
        : `${slab.minCars}-${slab.maxCars}`
    ),
    incentivePerCar: slab.incentivePerCar,
  });

  const fetchCarModels = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/sales/car-models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      // Initialize sales data with car models
      setSalesData(
        data.map((car) => ({
          carModelId: car._id,
          modelName: car.modelName,
          baseSuffix: car.baseSuffix,
          variant: car.variant,
          quantity: 0,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchSalesRecord = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sales/sales-record?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.salesRecord) {
        const formattedSales = data.salesRecord.carModelSales.map((sale) => ({
          carModelId: sale.carModelId._id,
          modelName: sale.carModelId.modelName,
          baseSuffix: sale.carModelId.baseSuffix,
          variant: sale.carModelId.variant,
          quantity: sale.quantity,
        }));
        setSalesData(formattedSales);
        setTotalCars(data.salesRecord.totalCars);
        setIncentiveDetails({
          totalIncentive: data.salesRecord.totalIncentive,
          slab: data.salesRecord.applicableSlab
            ? formatSlab(data.salesRecord.applicableSlab)
            : {
                name: "No applicable slab",
                range: "0-0",
                incentivePerCar: 0,
              },
        });
      } else {
        const resetSales = (data.carModels || []).map((car) => ({
          carModelId: car._id,
          modelName: car.modelName,
          baseSuffix: car.baseSuffix,
          variant: car.variant,
          quantity: 0,
        }));

        setSalesData(resetSales);
        setTotalCars(0);
        setIncentiveDetails(null);
      }
    } catch (err) {
      console.error(err);
    }
  }, [month]);

  useEffect(() => {
    // Initial data load is asynchronous; the state updates happen after fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCarModels();
    fetchSalesRecord();
  }, [fetchCarModels, fetchSalesRecord]);

  const handleQuantityChange = (index, value) => {
    const newSalesData = [...salesData];
    newSalesData[index].quantity = parseInt(value) || 0;
    setSalesData(newSalesData);

    const newTotal = newSalesData.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCars(newTotal);

    // Calculate incentive preview
    calculateIncentivePreview(newTotal);
  };

  const calculateIncentivePreview = async (total) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/sales/calculate-incentive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ totalCars: total }),
        }
      );
      const data = await response.json();
      setIncentiveDetails({
        totalIncentive: data.totalIncentive,
        slab: data.slab,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/sales/sales-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          month,
          carModelSales: salesData.map((sale) => ({
            carModelId: sale.carModelId,
            quantity: sale.quantity,
          })),
        }),
      });

      if (response.ok) {
        alert("Sales record saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving sales record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sales-calculator">
      <h3>Sales Volume Tracker & Incentive Calculator</h3>

      <div className="month-selector">
        <label>Select Month & Year:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="sales-input">
        <h4>Enter Car Sales Volume</h4>
        <table>
          <thead>
            <tr>
              <th>Car Model</th>
              <th>Base Suffix</th>
              <th>Variant</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={sale.carModelId}>
                <td>{sale.modelName}</td>
                <td>{sale.baseSuffix}</td>
                <td>{sale.variant}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={sale.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="total-cars">
          <h4>Total Cars Sold</h4>
          <p className="value">{totalCars}</p>
        </div>

        {incentiveDetails && (
          <div className="incentive-details">
            <h4>Incentive Breakdown</h4>
            <div className="detail-item">
              <span>Applicable Slab:</span>
              <span className="highlight">
                {incentiveDetails.slab.name} ({incentiveDetails.slab.range} cars)
              </span>
            </div>
            <div className="detail-item">
              <span>Incentive Per Car:</span>
              <span className="highlight">₹{incentiveDetails.slab.incentivePerCar}</span>
            </div>
            <div className="detail-item total">
              <span>Total Incentive (Monthly Payout):</span>
              <span className="highlight">₹{incentiveDetails.totalIncentive}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || totalCars === 0}
        className="save-btn"
      >
        {loading ? "Saving..." : "Save Sales Record"}
      </button>
    </div>
  );
}
