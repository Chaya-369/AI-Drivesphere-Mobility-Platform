import BackButton from "../components/BackButton";

function OwnerCars() {

  const cars = [
    {
      name: "BMW X5",
      price: "₹9000/day",
      status: "Available",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e"
    },

    {
      name: "Audi A4",
      price: "₹7500/day",
      status: "Booked",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    },

    {
      name: "Hyundai Creta",
      price: "₹3500/day",
      status: "Available",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442"
    }
  ];

  return (
    <div className="ownercars-page">

      <BackButton />

      <h1>My Listed Cars</h1>

      <div className="ownercars-grid">

        {cars.map((car, index) => (

          <div className="ownercar-card" key={index}>

            <img src={car.image} alt={car.name} />

            <h2>{car.name}</h2>

            <p>{car.price}</p>

            <span className={car.status === "Available" ? "available" : "booked"}>
              {car.status}
            </span>

            <div className="ownercar-buttons">
              <button>Edit</button>
              <button className="delete-btn">Delete</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default OwnerCars;