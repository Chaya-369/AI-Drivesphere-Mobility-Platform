import alto from "../assets/cars/alto.png";
import audi from "../assets/cars/audi-a4.png";
import bmw from "../assets/cars/bmw-x5.png";
import byd from "../assets/cars/byd-atto3.png";
import city from "../assets/cars/honda-city.png";
import creta from "../assets/cars/hyundai-creta.png";
import i20 from "../assets/cars/hyundai-i20.png";
import konaEV from "../assets/cars/hyundai-kona-ev.png";
import kwid from "../assets/cars/kwid.png";
import thar from "../assets/cars/mahindra-thar.png";
import ertiga from "../assets/cars/maruti-ertiga.png";
import mercedes from "../assets/cars/mercedes-glc.png";
import mgEV from "../assets/cars/mg-zs-ev.png";
import rangeRover from "../assets/cars/range-rover.png";
import superb from "../assets/cars/skoda-superb.png";
import nexonEV from "../assets/cars/tata-nexon-ev.png";
import tiago from "../assets/cars/tiago.png";
import innova from "../assets/cars/toyota-innova.png";
import wagonr from "../assets/cars/wagonr.png";

export const carDatabase = [
  { id: "alto",       name: "Maruti Alto",      image: alto,      price: 599,   fuel: "Petrol",   seats: "4 Seats", rating: "4.3⭐", type: "Budget", location: "Bengaluru", center: "Yelahanka" },
  { id: "kwid",       name: "Renault Kwid",     image: kwid,      price: 699,   fuel: "Petrol",   seats: "5 Seats", rating: "4.4⭐", type: "Budget", location: "Bengaluru", center: "Electronic City" },
  { id: "wagonr",     name: "WagonR",           image: wagonr,    price: 799,   fuel: "Petrol",   seats: "5 Seats", rating: "4.4⭐", type: "Budget", location: "Bengaluru", center: "Indiranagar" },
  { id: "tiago",      name: "Tata Tiago",       image: tiago,     price: 799,   fuel: "Petrol",   seats: "5 Seats", rating: "4.5⭐", type: "Budget", location: "Bengaluru", center: "Yelahanka" },
  { id: "i20",        name: "Hyundai i20",      image: i20,       price: 999,   fuel: "Petrol",   seats: "5 Seats", rating: "4.6⭐", type: "Budget", location: "Bengaluru", center: "Electronic City" },
  { id: "ertiga",     name: "Maruti Ertiga",    image: ertiga,    price: 1599,  fuel: "Petrol",   seats: "7 Seats", rating: "4.6⭐", type: "Family", location: "Bengaluru", center: "Indiranagar" },
  { id: "innova",     name: "Toyota Innova",    image: innova,    price: 2099,  fuel: "Diesel",   seats: "7 Seats", rating: "4.9⭐", type: "Family", location: "Bengaluru", center: "Yelahanka" },
  { id: "creta",      name: "Hyundai Creta",    image: creta,     price: 1799,  fuel: "Petrol",   seats: "5 Seats", rating: "4.7⭐", type: "Adventure", location: "Bengaluru", center: "Electronic City" },
  { id: "thar",       name: "Mahindra Thar",    image: thar,      price: 2399,  fuel: "Diesel",   seats: "4 Seats", rating: "4.9⭐", type: "Adventure", location: "Bengaluru", center: "Indiranagar" },
  { id: "city",       name: "Honda City",       image: city,      price: 1599,  fuel: "Petrol",   seats: "5 Seats", rating: "4.7⭐", type: "Business", location: "Bengaluru", center: "Yelahanka" },
  { id: "superb",     name: "Skoda Superb",     image: superb,    price: 2799,  fuel: "Petrol",   seats: "5 Seats", rating: "4.8⭐", type: "Business", location: "Bengaluru", center: "Electronic City" },
  { id: "audi",       name: "Audi A4",          image: audi,      price: 4199,  fuel: "Petrol",   seats: "5 Seats", rating: "4.9⭐", type: "Business", location: "Bengaluru", center: "Indiranagar" },
  { id: "nexon",      name: "Tata Nexon EV",    image: nexonEV,   price: 1999,  fuel: "Electric", seats: "5 Seats", rating: "4.8⭐", type: "EV", location: "Bengaluru", center: "Yelahanka" },
  { id: "kona",       name: "Hyundai Kona EV",  image: konaEV,    price: 2699,  fuel: "Electric", seats: "5 Seats", rating: "4.8⭐", type: "EV", location: "Bengaluru", center: "Electronic City" },
  { id: "zs",         name: "MG ZS EV",         image: mgEV,      price: 3199,  fuel: "Electric", seats: "5 Seats", rating: "4.7⭐", type: "EV", location: "Bengaluru", center: "Indiranagar" },
  { id: "atto3",      name: "BYD Atto 3",       image: byd,       price: 3599,  fuel: "Electric", seats: "5 Seats", rating: "4.9⭐", type: "EV", location: "Bengaluru", center: "Yelahanka" },
  { id: "x5",         name: "BMW X5",           image: bmw,       price: 5399,  fuel: "Diesel",   seats: "5 Seats", rating: "5.0⭐", type: "Luxury", location: "Bengaluru", center: "Electronic City" },
  { id: "glc",        name: "Mercedes GLC",     image: mercedes,  price: 5999,  fuel: "Petrol",   seats: "5 Seats", rating: "5.0⭐", type: "Luxury", location: "Bengaluru", center: "Indiranagar" },
  { id: "rangerover", name: "Range Rover",      image: rangeRover,price: 8399,  fuel: "Diesel",   seats: "5 Seats", rating: "5.0⭐", type: "Luxury", location: "Bengaluru", center: "Yelahanka" },
];
